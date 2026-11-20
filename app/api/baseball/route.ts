import { apiSportsKey } from "../../components/lib/apiSportsKey";
import { getPlanSeasonLimit } from "../../components/lib/apiSportsPlan";

export const dynamic = "force-dynamic";

type BaseballView = "fixtures" | "results" | "standings";

type CacheEntry = {
  expiresAt: number;
  response: unknown[];
  updatedAt: string;
};

const MLB_LEAGUE_ID = 1;
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, CacheEntry>();

function validView(value: string | null): value is BaseballView {
  return value === "fixtures" || value === "results" || value === "standings";
}

function errorMessage(errors: unknown, apiKey: string): string | undefined {
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
    "The baseball data provider rejected this request.";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view");
  if (!validView(view)) {
    return Response.json({ status: "error", message: "Choose fixtures, results or standings." }, { status: 400 });
  }

  const requestedSeason = searchParams.get("season");
  const season = requestedSeason === null ? new Date().getUTCFullYear() : Number(requestedSeason);
  if (!Number.isInteger(season) || season < 2000 || season > 2100) {
    return Response.json({ status: "error", message: "Choose a valid baseball season." }, { status: 400 });
  }

  const apiKey = apiSportsKey("API_BASEBALL_KEY");
  if (!apiKey) {
    return Response.json(
      { response: [], status: "unconfigured", message: "Add API_BASEBALL_KEY or API_SPORTS_KEY to the server environment.", updatedAt: null },
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
  const url = new URL(`https://v1.baseball.api-sports.io/${endpoint}`);
  url.searchParams.set("league", String(MLB_LEAGUE_ID));
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
    const message = errorMessage(data.errors, apiKey);

    if (!upstream.ok || message) {
      const seasonAccessLimit = message ? getPlanSeasonLimit(message) : null;
      if (seasonAccessLimit) {
        return Response.json({
          response: [],
          status: "season_unavailable",
          message: `The API-Sports plan configured for this site only provides baseball seasons ${seasonAccessLimit.firstSeason}–${seasonAccessLimit.lastSeason}. The ${season} season is not included.`,
          ...seasonAccessLimit,
          updatedAt: null,
        });
      }

      const error = message || `The baseball provider returned HTTP ${upstream.status}.`;
      console.warn(`Baseball ${view} provider error: ${error}`);
      return Response.json(
        { response: [], status: "error", message: error, updatedAt: null },
        { status: 502 }
      );
    }

    if (!Array.isArray(data.response)) {
      console.warn(`Baseball ${view} provider returned an unexpected response format.`);
      return Response.json(
        { response: [], status: "error", message: "The baseball data provider returned an unexpected response.", updatedAt: null },
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
    console.warn(`Baseball ${view} data unavailable:`, message);
    return Response.json(
      { response: [], status: "error", message: `Baseball ${view} are temporarily unavailable.`, updatedAt: null },
      { status: 502 }
    );
  }
}
