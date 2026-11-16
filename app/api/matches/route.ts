import axios from "axios";
import { competitionRank } from "../../components/lib/liveSportsData";
import { isSportmonksEnabled, sportmonksMatches } from "../../components/lib/sportmonksFootball";
import {
  espnFixtureDetail,
  espnFixturesInRange,
  espnLiveMatches,
  espnResultsInRange,
} from "../../components/lib/espnFootball";
import { lsLiveMatches } from "../../components/lib/livescoreFootball";
export const dynamic = "force-dynamic";

type MatchListCache = { expiresAt: number; response: unknown[] };
type StandingsCache = { expiresAt: number; response: unknown[] };
type DetailCache = { expiresAt: number; response: unknown };
let liveCache: MatchListCache | null = null;
let fixturesCache: MatchListCache | null = null;
let resultsCache: MatchListCache | null = null;
const detailCache = new Map<string, DetailCache>();
const standingsCache = new Map<string, StandingsCache>();
const leagueSeasonsCache = new Map<string, StandingsCache>();

function providerErrorMessage(data: { errors?: unknown }) {
  const errors = data.errors;
  const hasErrors = Array.isArray(errors)
    ? errors.length > 0
    : errors && typeof errors === "object"
      ? Object.keys(errors).length > 0
      : Boolean(errors);
  if (!hasErrors) return null;

  const details = Array.isArray(errors)
    ? errors
    : errors && typeof errors === "object"
      ? Object.values(errors as Record<string, unknown>)
      : [errors];
  const message = details
    .map((detail) => typeof detail === "string" ? detail : JSON.stringify(detail))
    .filter(Boolean)
    .join("; ")
    .slice(0, 240);
  return message || "The football data provider rejected the request.";
}

function assertProviderResponse(data: { errors?: unknown }) {
  const message = providerErrorMessage(data);
  if (message) throw new Error(message);
}

// Major competitions first (Premier League, LaLiga, Champions League, the Ghana
// Premier League…), then the rest of the slate; ties break by earlier kick-off.
type FixtureRecord = {
  fixture?: { date?: string };
  league?: { name?: string; country?: string };
};

function compareFixturesByPriority(first: FixtureRecord, second: FixtureRecord): number {
  const firstLabel = [first.league?.name, first.league?.country].filter(Boolean).join(" · ");
  const secondLabel = [second.league?.name, second.league?.country].filter(Boolean).join(" · ");
  const rankDiff = competitionRank(firstLabel) - competitionRank(secondLabel);
  if (rankDiff !== 0) return rankDiff;
  const firstDate = Date.parse(first.fixture?.date || "");
  const secondDate = Date.parse(second.fixture?.date || "");
  if (!Number.isNaN(firstDate) && !Number.isNaN(secondDate) && firstDate !== secondDate) {
    return firstDate - secondDate;
  }
  return 0;
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
  const view = new URL(request.url).searchParams.get("view") || "";

  // Standings and seasons have no ESPN equivalent; keep the primary provider's
  // behaviour, including its "plan coverage" error messages.
  if (view === "standings" || view === "seasons") {
    return isSportmonksEnabled() ? sportmonksMatches(request) : apiSportsMatches(request);
  }

  const primary = isSportmonksEnabled()
    ? await sportmonksMatches(request)
    : await apiSportsMatches(request);
  const primaryPayload = await primary.json();
  const primaryItems = Array.isArray(primaryPayload.response) ? primaryPayload.response : [];

  // A detail lookup only falls back when the primary provider could not find
  // the fixture at all; list views fall back whenever the primary came back
  // empty, because both paid providers answer "ok, 0 rows" when a
  // subscription lacks league coverage — which is indistinguishable from a
  // genuinely quiet day until ESPN also reports nothing.
  if (view === "detail") {
    if (primaryPayload.status !== "not_found" && primaryPayload.status !== "error") {
      return replay(primary, primaryPayload);
    }
    const espnDetail = await espnFixtureDetail(new URL(request.url).searchParams.get("id") || "");
    if (espnDetail) {
      return Response.json({ response: espnDetail, status: "ok", updatedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
    }
    return replay(primary, primaryPayload);
  }

  const [espnItems, livescoreItems] = view === "fixtures"
    ? [await espnFixturesInRange(7), [] as unknown[]]
    : view === "results"
      ? [await espnResultsInRange(7), [] as unknown[]]
      : view === "" ? await Promise.all([espnLiveMatches(), lsLiveMatches()]) : [[], []] as [unknown[], unknown[]];

  // Livescore leads the live sweep (it flags in-play games immediately);
  // ESPN entries are kept for duplicates because their ids support the
  // match-centre detail view.
  const espnPairs = new Set(espnItems.map(teamPairKey));
  const fallbackItems = [
    ...espnItems,
    ...livescoreItems.filter((item) => !espnPairs.has(teamPairKey(item))),
  ];

  if (primaryItems.length === 0 && fallbackItems.length === 0) {
    // Keep the primary's status semantics ("ok" empty slate vs error).
    return replay(primary, primaryPayload);
  }

  // Merge rather than replace so leagues only one provider covers survive,
  // then rank everything serious-competitions-first.
  const seen = new Set(primaryItems.map((item: unknown) => fixtureId(item)));
  const primaryPairs = new Set(primaryItems.map(teamPairKey));
  const merged = [
    ...primaryItems,
    ...fallbackItems.filter((item) => !seen.has(fixtureId(item)) && !primaryPairs.has(teamPairKey(item))),
  ].sort((first, second) => compareFixturesByPriority(first as FixtureRecord, second as FixtureRecord));

  return Response.json(
    { response: merged, status: "ok", updatedAt: new Date().toISOString() },
    { headers: LIST_CACHE_HEADERS[view] ?? LIST_CACHE_HEADERS[""] }
  );
}

const LIST_CACHE_HEADERS: Record<string, Record<string, string>> = {
  "": { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" },
  fixtures: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600" },
  results: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" },
};

function fixtureId(fixture: unknown): number {
  const value = fixture as { fixture?: { id?: number | string } } | null;
  return Number(value?.fixture?.id) || 0;
}

// Match identity across providers with different ids: normalised team pair.
function teamPairKey(fixture: unknown): string {
  const value = fixture as { teams?: { home?: { name?: string }; away?: { name?: string } } } | null;
  const norm = (name?: string) => (name ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return `${norm(value?.teams?.home?.name)}|${norm(value?.teams?.away?.name)}`;
}

function replay(response: Response, payload: unknown): Response {
  const cacheControl = response.headers.get("Cache-Control");
  return Response.json(payload, {
    status: response.status,
    headers: cacheControl ? { "Cache-Control": cacheControl } : undefined,
  });
}

// API_SPORTS_KEY is the fallback provider for the football views. The project
// guide lists API_FOOTBALL as the provider URL, so never use it as a key.
async function apiSportsMatches(request: Request) {
  // API_FOOTBALL is the provider URL in the project guide, so never use it as a key.
  const apiKey = process.env.API_SPORTS_KEY || process.env.NEXT_PUBLIC_API_KEY;
  const { searchParams } = new URL(request.url);
  const wantsFixtures = searchParams.get("view") === "fixtures";
  const wantsResults = searchParams.get("view") === "results";
  const wantsStandings = searchParams.get("view") === "standings";
  const wantsSeasons = searchParams.get("view") === "seasons";
  const wantsDetail = searchParams.get("view") === "detail";
  const detailId = searchParams.get("id") || "";
  const league = searchParams.get("league") || "";
  const season = searchParams.get("season") || "";
  if (wantsDetail && !/^\d+$/.test(detailId)) {
    return Response.json({ response: null, status: "invalid_request", updatedAt: null }, { status: 400 });
  }
  const standingsHeaders = { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200" };
  if ((wantsStandings && (!/^\d+$/.test(league) || !/^\d{4}$/.test(season))) || (wantsSeasons && !/^\d+$/.test(league))) {
    return Response.json({ response: [], status: "invalid_request", updatedAt: null }, { status: 400, headers: standingsHeaders });
  }
  const headers = wantsFixtures || wantsResults
    ? { "Cache-Control": wantsResults ? "public, s-maxage=1800, stale-while-revalidate=3600" : "public, s-maxage=3600, stale-while-revalidate=21600" }
    : { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" };

  if (!apiKey?.trim() || apiKey === "your_api_sports_key") {
    return Response.json(
      { response: [], status: "unconfigured", updatedAt: null },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
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

  // Single-fixture detail: goals with scorers, cards, substitutions, VAR and
  // team statistics (fouls, possession, shots…). Short cache so an open detail
  // panel can auto-refresh without hammering the provider.
  if (wantsDetail) {
    const detailHeaders = { "Cache-Control": "no-store" };
    const cachedDetail = detailCache.get(detailId);
    if (cachedDetail && cachedDetail.expiresAt > Date.now()) {
      return Response.json({ response: cachedDetail.response, status: "ok", updatedAt: new Date().toISOString() }, { headers: detailHeaders });
    }
    try {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
        headers: { "x-apisports-key": apiKey },
        params: { id: detailId },
        timeout: 8000,
      });
      assertProviderResponse(response.data);
      const fixture = Array.isArray(response.data?.response) ? response.data.response[0] : null;
      if (!fixture) {
        return Response.json({ response: null, status: "not_found", updatedAt: null }, { status: 404, headers: detailHeaders });
      }
      detailCache.set(detailId, { response: fixture, expiresAt: Date.now() + 45_000 });
      return Response.json({ response: fixture, status: "ok", updatedAt: new Date().toISOString() }, { headers: detailHeaders });
    } catch (error) {
      const responseData = axios.isAxiosError(error) ? error.response?.data : null;
      const message = (responseData && typeof responseData === "object"
        ? providerErrorMessage(responseData as { errors?: unknown })
        : null)
        || (error instanceof Error ? error.message : "The football data provider rejected the request.");
      console.warn("Football fixture detail unavailable:", message);
      return Response.json({ response: null, status: "error", message, updatedAt: null }, { status: 502, headers: detailHeaders });
    }
  }

  const cachedList = wantsResults ? resultsCache : fixturesCache;
  if ((wantsFixtures || wantsResults) && cachedList && cachedList.expiresAt > Date.now()) {
    return Response.json({ response: cachedList.response, status: "ok", updatedAt: new Date().toISOString() }, { headers });
  }

  // The shared API-Sports key has a small per-minute quota, so the live view is
  // served from a short in-memory cache instead of hitting the provider on
  // every page load (the home bar, ticker and match centre all fetch it).
  const isLiveView = !wantsFixtures && !wantsResults && !wantsStandings && !wantsSeasons;
  if (isLiveView && liveCache && liveCache.expiresAt > Date.now()) {
    return Response.json({ response: liveCache.response, status: "ok", updatedAt: new Date().toISOString() }, { headers });
  }

  try {
    let fixtures: unknown[];
    if (wantsFixtures || wantsResults) {
      // The provider rejects global from/to date-range queries on this plan
      // ("The From field need another parameter"), so upcoming and recent
      // matches are fetched one Accra day at a time instead. Requests run
      // sequentially to stay inside the shared key's per-minute quota, and a
      // failed day is skipped rather than blanking the whole list.
      const today = new Date();
      const dayOffsets = wantsResults
        ? Array.from({ length: 8 }, (_, index) => index - 7)
        : Array.from({ length: 7 }, (_, index) => index);
      fixtures = [];
      let reachableDays = 0;
      for (const offset of dayOffsets) {
        try {
          const dayResponse = await axios.get("https://v3.football.api-sports.io/fixtures", {
            headers: { "x-apisports-key": apiKey },
            params: { date: dateInAccra(new Date(today.getTime() + offset * 24 * 60 * 60 * 1000)), timezone: "Africa/Accra" },
            timeout: 8000,
          });
          reachableDays += 1;
          const dayMessage = providerErrorMessage(dayResponse.data ?? {});
          if (dayMessage) {
            console.warn(`Football fixtures day fetch rejected: ${dayMessage}`);
            continue;
          }
          if (Array.isArray(dayResponse.data?.response)) fixtures.push(...dayResponse.data.response);
        } catch (dayError) {
          console.warn("Football fixtures day fetch failed:", dayError instanceof Error ? dayError.message : dayError);
        }
      }
      if (reachableDays === 0) {
        throw new Error("The football data provider is temporarily unavailable.");
      }
    } else {
      const response = await axios.get("https://v3.football.api-sports.io/fixtures", {
        headers: { "x-apisports-key": apiKey },
        params: { live: "all" },
        timeout: 8000,
      });
      assertProviderResponse(response.data);
      const matchData = response.data?.response;
      fixtures = Array.isArray(matchData) ? matchData : [];
    }

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

    const rankedLiveFixtures = [...fixtures].sort((first, second) => compareFixturesByPriority(first as FixtureRecord, second as FixtureRecord));
    liveCache = { response: rankedLiveFixtures, expiresAt: Date.now() + 60_000 };
    return Response.json({
      response: rankedLiveFixtures,
      status: "ok",
      updatedAt: new Date().toISOString(),
    }, { headers });
  } catch (error) {
    const responseData = axios.isAxiosError(error) ? error.response?.data : null;
    const message = (responseData && typeof responseData === "object"
      ? providerErrorMessage(responseData as { errors?: unknown })
      : null)
      || (error instanceof Error ? error.message : "The football data provider rejected the request.");
    console.warn("External live sports API unavailable:", message);
    return Response.json({
      response: [],
      status: "error",
      message,
      updatedAt: null,
    }, { status: 502, headers });
  }
}
