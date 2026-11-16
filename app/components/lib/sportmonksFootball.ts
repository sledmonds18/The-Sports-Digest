// Sportmonks football provider for /api/matches.
//
// When SPORTMONKS_API_TOKEN (or SPORTMONKS_TOKEN) is set in the server
// environment, the football route delegates here instead of API-Sports. The
// provider normalises Sportmonks v3 responses into the API-Football fixture
// shape the client components already consume, so the UI needs no changes and
// API-Sports stays wired in as a fallback whenever the token is absent.
//
// Env: SPORTMONKS_API_TOKEN — a Sportmonks Football API token
// (MySportmonks → API → API Access). Verify the subscription covers every
// league shown on the site (Ghana Premier League needs the Worldwide plan).
//
// Ghana Premier League: not covered by the current subscription, so league 233
// is served from TheSportsDB via app/components/lib/ghanaFootballFeed.ts and
// merged into the fixture/result views.

const API_ROOT = "https://api.sportmonks.com/v3/football";
const TIMEOUT_MS = 8000;

const TOKEN_NAMES = ["SPORTMONKS_API_TOKEN", "SPORTMONKS_TOKEN"] as const;

import {
  ghanaDetail,
  ghanaFixturesInRange,
  ghanaSeasons,
  ghanaStandings,
  isGhanaLeague,
} from "./ghanaFootballFeed";

export function sportmonksToken(): string | undefined {
  const environment = process.env as Record<string, string | undefined>;
  for (const name of TOKEN_NAMES) {
    const value = environment[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function isSportmonksEnabled(): boolean {
  return Boolean(sportmonksToken());
}

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function records(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.filter((item) => item !== null && typeof item === "object" && !Array.isArray(item)) as JsonRecord[] : [];
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function dateInAccra(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// ─── Provider calls ─────────────────────────────────────────────────────────

type SportmonksError = { message: string; status?: number };

async function smFetch(
  path: string,
  params: Record<string, string> = {},
): Promise<{ data: unknown; meta: unknown } | SportmonksError> {
  const token = sportmonksToken();
  if (!token) return { message: "No Sportmonks token configured." };
  const url = new URL(`${API_ROOT}${path}`);
  url.searchParams.set("api_token", token);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    const payload = record(await response.json().catch(() => ({})));
    const message = text(payload.message);
    // Sportmonks reports quota/permission problems in `message` even on HTTP 200.
    if (!response.ok || (message && !Array.isArray(payload.data))) {
      return {
        message: message.replaceAll(token, "[redacted]").slice(0, 240)
          || `Sportmonks returned HTTP ${response.status}.`,
        status: response.status,
      };
    }
    return { data: payload.data, meta: payload.pagination ?? payload.meta ?? null };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "The Sportmonks request failed.",
    };
  }
}

// Some include chains may not be accepted on a given plan; retry with the
// minimal set so a fancy include can never blank a whole view.
async function smFetchWithIncludes(
  path: string,
  fullIncludes: string,
  minimalIncludes: string,
  params: Record<string, string> = {},
): Promise<{ data: unknown; meta: unknown } | SportmonksError> {
  const result = await smFetch(path, { ...params, include: fullIncludes });
  if ("message" in result && minimalIncludes !== fullIncludes) {
    return smFetch(path, { ...params, include: minimalIncludes });
  }
  return result;
}

// ─── Shared caches (per serverless instance, mirroring the API-Sports route) ─

type Cache<T> = { expiresAt: number; value: T };
let liveCache: Cache<unknown[]> | null = null;
let fixturesCache: Cache<unknown[]> | null = null;
let resultsCache: Cache<unknown[]> | null = null;
const detailCache = new Map<string, Cache<unknown>>();
const standingsCache = new Map<string, Cache<unknown[]>>();
const seasonsCache = new Map<number, Cache<{ seasons: unknown[]; currentYear: number | null }>>();
const leagueIdCache = new Map<number, Cache<number | null>>();

// ─── League identity (API-Football id → Sportmonks id) ──────────────────────
//
// The standings UI passes API-Football league ids (they are stable across
// seasons), but Sportmonks numbers its leagues differently. Instead of
// hardcoding possibly-stale numbers, resolve each league once via the search
// endpoint and cache the result. Extend this map when new standings leagues
// are added to the standings page.

const LEAGUE_SEARCH: Record<number, { name: string; country?: string }> = {
  233: { name: "Ghana Premier League", country: "Ghana" },
  39: { name: "Premier League", country: "England" },
  2: { name: "UEFA Champions League", country: "World" },
  140: { name: "La Liga", country: "Spain" },
  78: { name: "Bundesliga", country: "Germany" },
  135: { name: "Serie A", country: "Italy" },
  61: { name: "Ligue 1", country: "France" },
  253: { name: "MLS", country: "USA" },
};

async function sportmonksLeagueId(apiLeagueId: number): Promise<number | null> {
  const cached = leagueIdCache.get(apiLeagueId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const search = LEAGUE_SEARCH[apiLeagueId];
  if (!search) {
    leagueIdCache.set(apiLeagueId, { value: null, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
    return null;
  }
  const result = await smFetch(`/leagues/search/${encodeURIComponent(search.name)}`, {
    include: "country",
    per_page: "50",
  });
  if ("message" in result) {
    leagueIdCache.set(apiLeagueId, { value: null, expiresAt: Date.now() + 60 * 60 * 1000 });
    return null;
  }
  const leagues = records(result.data);
  const wanted = (search.country ?? "").toLowerCase();
  const match = leagues.find((league) => {
    const country = text(record(record(league.country).data).name).toLowerCase();
    return wanted === "world" ? true : country.includes(wanted);
  }) ?? leagues.find((league) => text(league.name).toLowerCase().includes(search.name.toLowerCase()));
  const id = match ? Number(text(record(match).id)) || null : null;
  leagueIdCache.set(apiLeagueId, { value: id, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
  return id;
}

// ─── Normalisation into the API-Football fixture shape ──────────────────────

// Sportmonks state shortnames → API-Football status shorts. Unknown values
// pass through unchanged; the client falls back to the long name.
const STATUS_ALIASES: Record<string, string> = {
  POSTP: "PST",
  CANCL: "CANC",
  DELETED: "CANC",
  TBA: "NS",
  TBD: "NS",
  NOT_STARTED: "NS",
  FINISHED: "FT",
  "PT": "P",
  LIVE: "LIVE",
};

function normaliseStatus(fixture: JsonRecord): { short: string; long: string } {
  const state = record(fixture.state);
  const short = text(state.shortname, "NS").trim();
  return {
    short: STATUS_ALIASES[short] ?? short,
    long: text(state.name, short || "Not Started"),
  };
}

type ParticipantPair = { home?: JsonRecord; away?: JsonRecord };

function participantsOf(fixture: JsonRecord): ParticipantPair {
  const list = records(fixture.participants);
  const byMeta = (location: string) => list.find((item) =>
    text(record(item.meta).location).toLowerCase() === location);
  const pair: ParticipantPair = { home: byMeta("home"), away: byMeta("away") };
  // Fallback: the fixture name is "Home Team - Away Team".
  if (!pair.home || !pair.away) {
    const parts = text(fixture.name).split(/\s+-\s+/);
    if (parts.length === 2) {
      pair.home ??= list.find((item) => text(item.name) === parts[0].trim());
      pair.away ??= list.find((item) => text(item.name) === parts[1].trim());
    }
  }
  return pair;
}

function teamShape(participant: JsonRecord | undefined) {
  return {
    id: Number(text(record(participant).id)) || 0,
    name: text(record(participant).name, "Unknown"),
    logo: text(record(participant).image_path) || undefined,
    winner: null,
  };
}

// Score rows carry one entry per participant per description
// (CURRENT / HALFTIME / FULLTIME); split them home/away via participant ids.
function goalsOf(fixture: JsonRecord): { home: number | null; away: number | null } {
  const pair = participantsOf(fixture);
  const homeId = text(record(pair.home).id);
  const awayId = text(record(pair.away).id);
  const pick = (description: string) => {
    const rows = records(fixture.scores).filter((row) =>
      text(row.description).toUpperCase() === description);
    const byParticipant = (id: string) => {
      const row = rows.find((entry) => text(entry.participant_id) === id);
      return row && Number.isFinite(Number(row.score)) ? Number(row.score) : null;
    };
    return { home: byParticipant(homeId), away: byParticipant(awayId) };
  };
  const current = pick("CURRENT");
  return (current.home != null || current.away != null)
    ? current
    : pick("FULLTIME");
}

function leagueShape(fixture: JsonRecord) {
  const league = record(fixture.league);
  return {
    id: Number(text(league.id)) || 0,
    name: text(league.name, "Unknown competition"),
    country: text(record(league.country).name) || text(league.country),
    logo: text(league.image_path) || undefined,
  };
}

function venueShape(fixture: JsonRecord) {
  const venue = record(fixture.venue);
  const name = text(venue.name);
  const city = text(venue.city_name) || text(record(venue.city).name);
  return name || city ? { name: name || null, city: city || null } : undefined;
}

function toApiFootballFixture(fixture: JsonRecord): JsonRecord {
  const pair = participantsOf(fixture);
  const status = normaliseStatus(fixture);
  const goals = goalsOf(fixture);
  return {
    fixture: {
      id: Number(text(fixture.id)) || 0,
      date: text(fixture.starting_at) || text(fixture.date),
      status: { elapsed: null, short: status.short, long: status.long },
      venue: venueShape(fixture),
    },
    league: leagueShape(fixture),
    teams: { home: teamShape(pair.home), away: teamShape(pair.away) },
    goals,
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  };
}

// ─── Views ──────────────────────────────────────────────────────────────────

function jsonBody(response: unknown[], status: string, headers: Record<string, string>) {
  return Response.json({ response, status, updatedAt: new Date().toISOString() }, { headers });
}

async function getLive(): Promise<Response> {
  const headers = { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" };
  if (liveCache && liveCache.expiresAt > Date.now()) {
    return jsonBody(liveCache.value, "ok", headers);
  }
  const result = await smFetchWithIncludes(
    "/livescores/inplay",
    "league.country;participants;scores;state;venue",
    "participants;scores;state",
  );
  if ("message" in result) {
    console.warn("Sportmonks live scores unavailable:", result.message);
    return jsonBody([], "error", headers);
  }
  const fixtures = records(result.data).map(toApiFootballFixture);
  liveCache = { value: fixtures, expiresAt: Date.now() + 60_000 };
  return jsonBody(fixtures, "ok", headers);
}

// A single date-range call replaces API-Sports' sequential per-day requests.
async function getRange(daysBack: number, daysAhead: number): Promise<Response | SportmonksError> {
  const wantsResults = daysBack > 0;
  const from = dateInAccra(new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000));
  const to = dateInAccra(new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000));
  const headers = {
    "Cache-Control": wantsResults
      ? "public, s-maxage=1800, stale-while-revalidate=3600"
      : "public, s-maxage=3600, stale-while-revalidate=21600",
  };
  const cached = wantsResults ? resultsCache : fixturesCache;
  if (cached && cached.expiresAt > Date.now()) {
    return jsonBody(cached.value, "ok", headers);
  }
  const result = await smFetchWithIncludes(
    `/fixtures/between/${from}/${to}`,
    "league.country;participants;scores;state;venue",
    "participants;scores;state",
    { order: wantsResults ? "desc" : "asc" },
  );
  if ("message" in result) return result;
  const sportmonksFixtures = records(result.data).map(toApiFootballFixture);
  // The GPL is outside the Sportmonks subscription — merge it in from
  // TheSportsDB so the fixtures/results desks never drop Ghana matches.
  let merged = sportmonksFixtures;
  try {
    const ghana = await ghanaFixturesInRange(from, to);
    if (ghana.length > 0) {
      merged = [...sportmonksFixtures, ...ghana].sort((first, second) => {
        const firstDate = text(record(first.fixture).date);
        const secondDate = text(record(second.fixture).date);
        return wantsResults
          ? secondDate.localeCompare(firstDate)
          : firstDate.localeCompare(secondDate);
      });
    }
  } catch (error) {
    console.warn("Ghana fixtures merge skipped:", error instanceof Error ? error.message : error);
  }
  const fixtures = merged;
  const cache: Cache<unknown[]> = {
    value: fixtures,
    expiresAt: Date.now() + (wantsResults ? 60 * 60 * 1000 : 6 * 60 * 60 * 1000),
  };
  if (wantsResults) resultsCache = cache;
  else fixturesCache = cache;
  return jsonBody(fixtures, "ok", headers);
}

async function getDetail(detailId: string): Promise<Response> {
  const headers = { "Cache-Control": "no-store" };
  const cached = detailCache.get(detailId);
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json({ response: cached.value, status: "ok", updatedAt: new Date().toISOString() }, { headers });
  }
  const result = await smFetchWithIncludes(
    `/fixtures/${detailId}`,
    "league.country;participants;scores;state;venue;events;events.type;statistics;statistics.type",
    "participants;scores;state",
  );
  if ("message" in result) {
    console.warn("Sportmonks fixture detail unavailable:", result.message);
    return Response.json({ response: null, status: "error", message: result.message, updatedAt: null }, { status: 502, headers });
  }
  const fixture = records(result.data)[0];
  if (!fixture) {
    // GPL fixtures carry TheSportsDB ids the Sportmonks lookup can't resolve.
    const ghanaFallback = await ghanaDetail(detailId).catch(() => null);
    if (ghanaFallback) {
      detailCache.set(detailId, { value: ghanaFallback, expiresAt: Date.now() + 45_000 });
      return Response.json({ response: ghanaFallback, status: "ok", updatedAt: new Date().toISOString() }, { headers });
    }
    return Response.json({ response: null, status: "not_found", updatedAt: null }, { status: 404, headers });
  }
  const base = toApiFootballFixture(fixture);
  const events = records(fixture.events).map((event) => ({
    time: {
      elapsed: Number.isFinite(Number(event.minute)) ? Number(event.minute) : null,
      extra: Number.isFinite(Number(event.extra_minute)) ? Number(event.extra_minute) : null,
    },
    type: text(record(event.type).name),
    detail: "",
    player: { name: text(event.player_name) || undefined },
    assist: { name: text(event.related_player_name) || undefined },
    team: { name: teamShape(records(fixture.participants).find((item) => text(item.id) === text(event.participant_id))).name, logo: undefined },
  }));
  // Statistics arrive as one row per team per metric
  // ({participant_id, type:{name}, data:{value}}); keep the two groups in
  // home/away order because the UI indexes [0] and [1].
  const pair = participantsOf(fixture);
  const statisticsFor = (participant: JsonRecord | undefined) =>
    records(fixture.statistics)
      .filter((row) => participant && text(row.participant_id) === text(record(participant).id))
      .map((row) => ({
        type: text(record(row.type).name) || text(row.description),
        value: text(record(row.data).value) || text(row.value),
      }));
  const statistics = [statisticsFor(pair.home), statisticsFor(pair.away)]
    .filter((group) => group.length > 0)
    .map((group) => ({ statistics: group }));
  const response = { ...base, events, statistics };
  detailCache.set(detailId, { value: response, expiresAt: Date.now() + 45_000 });
  return Response.json({ response, status: "ok", updatedAt: new Date().toISOString() }, { headers });
}

// ─── Seasons & standings ────────────────────────────────────────────────────

function seasonYear(season: JsonRecord): number | null {
  const name = text(season.name).trim();
  const nameMatch = name.match(/^(\d{2,4})(?:\/(\d{2}))?$/);
  if (nameMatch) {
    const first = Number(nameMatch[1]);
    return nameMatch[1].length === 4 ? first : 2000 + first;
  }
  const start = text(season.starting_at);
  const startYear = Number(start.slice(0, 4));
  return Number.isFinite(startYear) && startYear > 1990 ? startYear : null;
}

async function getSeasons(apiLeagueId: number): Promise<Response> {
  const headers = { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200" };
  const cached = seasonsCache.get(apiLeagueId);
  if (cached && cached.expiresAt > Date.now()) {
    return jsonBody(cached.value.seasons, "ok", headers);
  }
  const smLeagueId = await sportmonksLeagueId(apiLeagueId);
  if (!smLeagueId) {
    const name = LEAGUE_SEARCH[apiLeagueId]?.name ?? `league ${apiLeagueId}`;
    return Response.json({
      response: [], status: "error",
      message: `${name} is not available in the current Sportmonks subscription (plan coverage).`,
      updatedAt: null,
    }, { status: 502, headers });
  }
  const [seasonsResult, leagueResult] = await Promise.all([
    smFetch("/seasons", { filters: `seasonLeagues:${smLeagueId}`, per_page: "50" }),
    smFetch(`/leagues/${smLeagueId}`, { include: "currentSeason" }),
  ]);
  if ("message" in seasonsResult) {
    console.warn("Sportmonks seasons unavailable:", seasonsResult.message);
    return Response.json({ response: [], status: "error", message: seasonsResult.message, updatedAt: null }, { status: 502, headers });
  }
  const league = record(leagueResult && !("message" in leagueResult) ? (leagueResult as { data: unknown }).data : {});
  const currentSeasonId = text(record(league.currentSeason).id);
  const seasons = records(seasonsResult.data).map((season) => {
    const year = seasonYear(season);
    return {
      year,
      current: Boolean(currentSeasonId) && text(season.id) === currentSeasonId,
      coverage: { standings: true },
    };
  }).filter((season) => season.year != null)
    .sort((first, second) => (second.year ?? 0) - (first.year ?? 0));
  seasonsCache.set(apiLeagueId, {
    value: { seasons, currentYear: seasons.find((season) => season.current)?.year ?? null },
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  return jsonBody(seasons, "ok", headers);
}

async function getStandings(apiLeagueId: number, year: number): Promise<Response> {
  const headers = { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200" };
  const cacheKey = `${apiLeagueId}:${year}`;
  const cached = standingsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return jsonBody(cached.value, "ok", headers);
  }
  const smLeagueId = await sportmonksLeagueId(apiLeagueId);
  if (!smLeagueId) {
    const name = LEAGUE_SEARCH[apiLeagueId]?.name ?? `league ${apiLeagueId}`;
    return Response.json({
      response: [], status: "error",
      message: `${name} is not available in the current Sportmonks subscription (plan coverage).`,
      updatedAt: null,
    }, { status: 502, headers });
  }
  // Season ids are opaque on Sportmonks; resolve (league, year) → season id.
  const seasonsResult = await smFetch("/seasons", { filters: `seasonLeagues:${smLeagueId}`, per_page: "50" });
  if ("message" in seasonsResult) {
    console.warn("Sportmonks season lookup failed:", seasonsResult.message);
    return Response.json({ response: [], status: "error", message: seasonsResult.message, updatedAt: null }, { status: 502, headers });
  }
  const season = records(seasonsResult.data)
    .map((entry) => ({ entry, year: seasonYear(entry) }))
    .filter((item) => item.year === year)
    .sort((first, second) => Number(text(record(second.entry).id)) - Number(text(record(first.entry).id)))[0];
  const seasonId = season ? text(record(season.entry).id) : "";
  if (!seasonId) {
    return Response.json({ response: [], status: "error", updatedAt: null }, { status: 502, headers });
  }
  const standingsResult = await smFetchWithIncludes(
    `/standings/seasons/${seasonId}`,
    "participant;group",
    "participant",
  );
  if ("message" in standingsResult) {
    console.warn("Sportmonks standings unavailable:", standingsResult.message);
    return Response.json({ response: [], status: "error", message: standingsResult.message, updatedAt: null }, { status: 502, headers });
  }
  const overall = records(standingsResult.data).filter((row) =>
    !text(row.type) || text(row.type).toLowerCase() === "overall");
  const rows = overall.map((row) => ({
    rank: Number(text(row.position)) || Number(text(row.rank)) || 0,
    team: teamShape(record(row.participant)),
    points: Number(text(row.points)) || 0,
    goalsDiff: Number(text(row.goal_diff) ?? text(row.goals_diff)) || 0,
    all: {
      played: Number(text(row.played)) || 0,
      win: Number(text(row.won)) || 0,
      draw: Number(text(row.draw)) || 0,
      lose: Number(text(row.lost)) || 0,
      goals: {
        for: Number(text(row.goals_for)) || 0,
        against: Number(text(row.goals_against)) || 0,
      },
    },
    form: text(row.recent_form) || text(row.form) || null,
    group: text(record(row.group).name) || null,
    description: text(row.description) || null,
  }));
  const leagueMeta = await smFetch(`/leagues/${smLeagueId}`, {});
  const league = "message" in leagueMeta ? {} : record((leagueMeta as { data: unknown }).data);
  const response = [{
    league: {
      id: apiLeagueId,
      name: text(league.name, "League"),
      country: text(record(league.country).name),
      logo: text(league.image_path) || undefined,
      season: year,
      standings: [rows],
    },
  }];
  standingsCache.set(cacheKey, { value: response, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
  return jsonBody(response, "ok", headers);
}

// ─── Entry point ────────────────────────────────────────────────────────────

const UNCONFIGURED_HEADERS = { "Cache-Control": "no-store, max-age=0" };
const STANDINGS_HEADERS = { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=43200" };

export async function sportmonksMatches(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "";
  if (view === "fixtures") {
    const result = await getRange(0, 6);
    return "message" in result
      ? Response.json({ response: [], status: "error", message: result.message, updatedAt: null }, { status: 502 })
      : result;
  }
  if (view === "results") {
    const result = await getRange(7, 0);
    return "message" in result
      ? Response.json({ response: [], status: "error", message: result.message, updatedAt: null }, { status: 502 })
      : result;
  }
  if (view === "detail") {
    const detailId = searchParams.get("id") || "";
    if (!/^\d+$/.test(detailId)) {
      return Response.json({ response: null, status: "invalid_request", updatedAt: null }, { status: 400 });
    }
    return getDetail(detailId);
  }
  if (view === "standings" || view === "seasons") {
    const league = Number(searchParams.get("league"));
    if (!Number.isFinite(league) || !league) {
      return Response.json({ response: view === "standings" ? [] : [], status: "invalid_request", updatedAt: null }, { status: 400 });
    }
    if (view === "seasons") {
      if (isGhanaLeague(league)) {
        return jsonBody(ghanaSeasons(), "ok", STANDINGS_HEADERS);
      }
      return getSeasons(league);
    }
    const season = Number(searchParams.get("season"));
    if (!Number.isFinite(season) || !season) {
      return Response.json({ response: [], status: "invalid_request", updatedAt: null }, { status: 400 });
    }
    if (isGhanaLeague(league)) {
      const rows = await ghanaStandings(season);
      if (!rows) {
        return Response.json({ response: [], status: "error", message: `No Ghana Premier League table for the ${season} season yet.`, updatedAt: null }, { status: 502, headers: STANDINGS_HEADERS });
      }
      return jsonBody([{
        league: {
          id: 233,
          name: "Ghana Premier League",
          country: "Ghana",
          logo: undefined,
          season,
          standings: [rows],
        },
      }], "ok", STANDINGS_HEADERS);
    }
    return getStandings(league, season);
  }
  // Default view: live scores.
  return getLive();
}
