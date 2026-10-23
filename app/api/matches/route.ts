import axios from "axios";

export const dynamic = "force-dynamic";

type MatchListCache = { expiresAt: number; response: unknown[] };
type StandingsCache = { expiresAt: number; response: unknown[] };
let fixturesCache: MatchListCache | null = null;
let resultsCache: MatchListCache | null = null;
const standingsCache = new Map<string, StandingsCache>();
const leagueSeasonsCache = new Map<string, StandingsCache>();

function assertProviderResponse(data: { errors?: unknown }) {
  const errors = data.errors;
  if (Array.isArray(errors) ? errors.length > 0 : errors && typeof errors === "object" ? Object.keys(errors).length > 0 : Boolean(errors)) {
    throw new Error("Football data provider rejected the request.");
  }
}

function dateInAccra(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function GET(request: Request) {
  // API_FOOTBALL is the provider URL in the project guide, so never use it as a key.
  const apiKey = process.env.API_SPORTS_KEY || process.env.NEXT_PUBLIC_API_KEY;
  const { searchParams } = new URL(request.url);
  const wantsFixtures = searchParams.get("view") === "fixtures";
  const wantsResults = searchParams.get("view") === "results";
  const wantsStandings = searchParams.get("view") === "standings";
  const wantsSeasons = searchParams.get("view") === "seasons";
  const league = searchParams.get("league") || "";
  const season = searchParams.get("season") || "";
  const standingsHeaders = { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200" };
  if ((wantsStandings && (!/^\d+$/.test(league) || !/^\d{4}$/.test(season))) || (wantsSeasons && !/^\d+$/.test(league))) {
    return Response.json({ response: [], status: "invalid_request", updatedAt: null }, { status: 400, headers: standingsHeaders });
  }
  const headers = wantsFixtures || wantsResults
    ? { "Cache-Control": wantsResults ? "public, s-maxage=1800, stale-while-revalidate=3600" : "public, s-maxage=3600, stale-while-revalidate=21600" }
    : { "Cache-Control": "no-store, max-age=0" };

  if (!apiKey?.trim() || apiKey === "your_api_sports_key") {
    return Response.json({ response: [], status: "unconfigured", updatedAt: null }, { headers: wantsStandings ? standingsHeaders : headers });
  }

  if (wantsStandings) {
    const cacheKey = `${league}:${season}`;
    const cachedStandings = standingsCache.get(cacheKey);
    if (cachedStandings && cachedStandings.expiresAt > Date.now()) {
      return Response.json({ response: cachedStandings.response, status: "ok", updatedAt: new Date().toISOString() }, { headers: standingsHeaders });
    }
    try {
      const response = await axios.get("https://v3.football.api-sports.io/standings", {
        headers: { "x-apisports-key": apiKey },
        params: { league, season },
        timeout: 8000,
      });
      assertProviderResponse(response.data);
      const data = Array.isArray(response.data?.response) ? response.data.response : [];
      standingsCache.set(cacheKey, { response: data, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
      return Response.json({ response: data, status: "ok", updatedAt: new Date().toISOString() }, { headers: standingsHeaders });
    } catch (error) {
      console.warn("External football standings API unavailable:", error);
      return Response.json({ response: [], status: "error", updatedAt: null }, { status: 502, headers: standingsHeaders });
    }
  }

  if (wantsSeasons) {
    const cachedSeasons = leagueSeasonsCache.get(league);
    if (cachedSeasons && cachedSeasons.expiresAt > Date.now()) {
      return Response.json({ response: cachedSeasons.response, status: "ok", updatedAt: new Date().toISOString() }, { headers: standingsHeaders });
    }
    try {
      const response = await axios.get("https://v3.football.api-sports.io/leagues", {
        headers: { "x-apisports-key": apiKey },
        params: { id: league },
        timeout: 8000,
      });
      assertProviderResponse(response.data);
      const seasons = Array.isArray(response.data?.response?.[0]?.seasons) ? response.data.response[0].seasons : [];
      leagueSeasonsCache.set(league, { response: seasons, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
      return Response.json({ response: seasons, status: "ok", updatedAt: new Date().toISOString() }, { headers: standingsHeaders });
    } catch (error) {
      console.warn("External league seasons API unavailable:", error);
      return Response.json({ response: [], status: "error", updatedAt: null }, { status: 502, headers: standingsHeaders });
    }
  }

  const cachedList = wantsResults ? resultsCache : fixturesCache;
  if ((wantsFixtures || wantsResults) && cachedList && cachedList.expiresAt > Date.now()) {
    return Response.json({ response: cachedList.response, status: "ok", updatedAt: new Date().toISOString() }, { headers });
  }

  try {
    const today = new Date();
    const from = dateInAccra(wantsResults ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : today);
    const to = dateInAccra(wantsResults ? today : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
      headers: { "x-apisports-key": apiKey },
      params: wantsFixtures || wantsResults ? { from, to, timezone: "Africa/Accra" } : { live: "all" },
      timeout: 8000,
    });
    assertProviderResponse(response.data);

    const matchData = response.data?.response;
    const fixtures = Array.isArray(matchData) ? matchData : [];

    if (wantsFixtures || wantsResults) {
      const cache: MatchListCache = { response: fixtures, expiresAt: Date.now() + (wantsResults ? 60 * 60 * 1000 : 6 * 60 * 60 * 1000) };
      if (wantsResults) resultsCache = cache;
      else fixturesCache = cache;
      return Response.json({
        response: fixtures,
        status: "ok",
        updatedAt: new Date().toISOString(),
      }, { headers });
    }

    return Response.json({
      response: fixtures,
      status: "ok",
      updatedAt: new Date().toISOString(),
    }, { headers });
  } catch (error) {
    console.warn("External live sports API unavailable:", error);
    return Response.json({
      response: [],
      status: "error",
      updatedAt: null,
    }, { status: 502, headers });
  }
}
