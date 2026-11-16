export const dynamic = "force-dynamic";

type NflView = "fixtures" | "results" | "standings";

type NflCacheEntry = {
  expiresAt: number;
  response: unknown[];
  updatedAt: string;
};

const cache = new Map<string, NflCacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000;
const NFL_LEAGUE_ID = 1;

function getCurrentSeason(now = new Date()): number {
  return now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}

function getApiKey(): string | undefined {
  return process.env.API_NFL_KEY?.trim() ||
    process.env.API_SPORTS_KEY?.trim() ||
    process.env.NEXT_PUBLIC_API_KEY?.trim();
}

function getErrorMessage(errors: unknown, apiKey: string): string | undefined {
  if (!errors || (Array.isArray(errors) && errors.length === 0) ||
      (typeof errors === "object" && !Array.isArray(errors) && Object.keys(errors).length === 0)) {
    return undefined;
  }
  const details = Array.isArray(errors)
    ? errors
    : typeof errors === "object"
      ? Object.values(errors)
      : [errors];
  const message = details
    .map((detail) => typeof detail === "string" || typeof detail === "number" ? String(detail) : "")
    .filter(Boolean)
    .join("; ");
  return message.replaceAll(apiKey, "[redacted]").slice(0, 200) ||
    "The American football provider rejected this request.";
}

function getSeasonAccessLimit(message: string): { firstSeason: number; lastSeason: number } | null {
  const match = message.match(/free plans do not have access to this season,\s*try from\s+(\d{4})\s+to\s+(\d{4})/i);
  if (!match) return null;
  const firstSeason = Number(match[1]);
  const lastSeason = Number(match[2]);
  return firstSeason <= lastSeason ? { firstSeason, lastSeason } : null;
}

function validView(value: string | null): value is NflView {
  return value === "fixtures" || value === "results" || value === "standings";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view");
  if (!validView(view)) {
    return Response.json({ status: "error", message: "Choose fixtures, results or standings." }, { status: 400 });
  }

  const requestedSeason = searchParams.get("season");
  const season = requestedSeason === null ? getCurrentSeason() : Number(requestedSeason);
  if (!Number.isInteger(season) || season < 2000 || season > 2100) {
    return Response.json({ status: "error", message: "Choose a valid NFL season." }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey || apiKey === "your_api_sports_key") {
    return Response.json(
      { response: [], status: "unconfigured", message: "Add API_NFL_KEY to the server environment.", updatedAt: null },
      { status: 503 }
    );
  }

  const cacheKey = `${view}:${season}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json(
      { response: cached.response, status: "ready", updatedAt: cached.updatedAt },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const endpoint = view === "standings" ? "standings" : "games";
  const url = new URL(`https://v1.american-football.api-sports.io/${endpoint}`);
  url.searchParams.set("league", String(NFL_LEAGUE_ID));
  url.searchParams.set("season", String(season));

  try {
    const upstream = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const payload: unknown = await upstream.json();
    const data = payload !== null && typeof payload === "object"
      ? payload as { response?: unknown; errors?: unknown }
      : {};
    const message = getErrorMessage(data.errors, apiKey);

    if (!upstream.ok || message) {
      const seasonAccessLimit = message ? getSeasonAccessLimit(message) : null;
      if (seasonAccessLimit) {
        return Response.json({
          response: [],
          status: "season_unavailable",
          message: `The API-Sports plan configured for this site only provides NFL seasons ${seasonAccessLimit.firstSeason}–${seasonAccessLimit.lastSeason}. Current-season data requires provider access to the ${season} season.`,
          ...seasonAccessLimit,
          updatedAt: null,
        });
      }

      const error = message || `The American football provider returned HTTP ${upstream.status}.`;
      console.warn(`NFL ${view} provider error: ${error}`);
      return Response.json(
        { response: [], status: "error", message: error, updatedAt: null },
        { status: 502 }
      );
    }

    if (!Array.isArray(data.response)) {
      console.warn(`NFL ${view} provider returned an unexpected response format.`);
      return Response.json(
        { response: [], status: "error", message: "The NFL data provider returned an unexpected response.", updatedAt: null },
        { status: 502 }
      );
    }

    const updatedAt = new Date().toISOString();
    cache.set(cacheKey, { response: data.response, expiresAt: Date.now() + CACHE_DURATION, updatedAt });
    return Response.json(
      { response: data.response, status: "ready", updatedAt },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "The provider request failed.";
    console.warn(`NFL ${view} data unavailable:`, message);
    return Response.json(
      { response: [], status: "error", message: `NFL ${view} are temporarily unavailable.`, updatedAt: null },
      { status: 502 }
    );
  }
}
