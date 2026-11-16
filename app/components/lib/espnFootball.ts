// ESPN football fallback provider for /api/matches.
//
// Both paid providers can return nothing football-related — API-Sports returns
// HTTP 403 when the account has no football product, and a Sportmonks free
// plan returns empty lists for every league outside its coverage. This module
// is the last link in the provider chain: ESPN's public site API needs no key
// and covers the competitions the site surfaces (top European leagues, UEFA
// and CAF cups, World Cup, the Americas…).
//
// Responses are normalised into the API-Football fixture shape the client
// components already consume, sorted serious-competitions-first via
// competitionRank, and the Ghana Premier League supplement from
// ghanaFootballFeed.ts is merged into fixture/result ranges exactly like the
// Sportmonks path does.
//
// Caveat: fixture detail needs to know which ESPN league slug an event id
// belongs to, so scoreboard responses record id→slug here. A detail request
// landing on a cold serverless instance may miss that map and return null.

import { competitionRank } from "./liveSportsData";
import { ghanaFixturesInRange } from "./ghanaFootballFeed";

// ESPN's Akamai edge denies server-side HTTPS from Node runtimes (TLS
// fingerprinting) but serves the same JSON over plain HTTP, which the paid
// providers can't cover — the score data is public, so that trade-off is
// accepted here.
const SITE_API = "http://site.api.espn.com/apis/site/v2/sports/soccer";
const TIMEOUT_MS = 8000;

// Priority-ordered league slugs. ESPN has no single "all soccer" endpoint, so
// each slug costs one cheap request; unknown or unlicensed slugs simply 404
// and are skipped, so extending this list is always safe.
const LEAGUE_SLUGS = [
  // Continental / international cups first.
  "fifa.world",
  "fifa.worldq.uefa",
  "fifa.worldq.conmebol",
  "fifa.worldq.concacaf",
  "fifa.worldq.caf",
  "fifa.worldq.afc",
  "fifa.worldq.ofc",
  "uefa.champions",
  "uefa.europa",
  "uefa.europa.conf",
  "uefa.nations",
  "caf.nations",
  "caf.champions",
  "caf.confed",
  "conmebol.libertadores",
  "conmebol.sudamericana",
  "concacaf.champions",
  // Top domestic flights.
  "eng.1",
  "esp.1",
  "ita.1",
  "ger.1",
  "fra.1",
  "ned.1",
  "por.1",
  "eng.2",
  "tur.1",
  "sco.1",
  "bra.1",
  "arg.1",
  "mex.1",
  "usa.1",
  "sau.1",
  "rsa.1",
  "egy.1",
] as const;

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function records(value: unknown): JsonRecord[] {
  return Array.isArray(value)
    ? value.filter((item) => item !== null && typeof item === "object" && !Array.isArray(item)) as JsonRecord[]
    : [];
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

/** ESPN league slug → country label for the "league · country" UI line. */
function countryForSlug(slug: string): string {
  const prefix = slug.split(".")[0];
  const countries: Record<string, string> = {
    eng: "England", esp: "Spain", ita: "Italy", ger: "Germany", fra: "France",
    ned: "Netherlands", por: "Portugal", tur: "Türkiye", sco: "Scotland",
    usa: "USA", mex: "Mexico", bra: "Brazil", arg: "Argentina", sau: "Saudi Arabia",
    rsa: "South Africa", egy: "Egypt", uefa: "Europe", fifa: "World",
    caf: "Africa", conmebol: "South America", concacaf: "North America",
  };
  return countries[prefix] ?? "";
}

// ─── Caches ─────────────────────────────────────────────────────────────────

type Cache<T> = { expiresAt: number; value: T };
let liveCache: Cache<JsonRecord[]> | null = null;
const rangeCaches = new Map<string, Cache<JsonRecord[]>>();
const detailCache = new Map<string, Cache<JsonRecord>>();
// ESPN event id → league slug, populated from scoreboard responses so the
// detail view can locate the summary endpoint without extra lookups.
const eventSlugById = new Map<string, string>();

// ─── Scoreboard fetching ────────────────────────────────────────────────────

async function scoreboard(slug: string, dates?: string): Promise<{ events: JsonRecord[]; league: JsonRecord } | null> {
  const url = new URL(`${SITE_API}/${slug}/scoreboard`);
  if (dates) url.searchParams.set("dates", dates);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!response.ok) return null;
    const body = record(await response.json().catch(() => null));
    const league = record(records(body.leagues)[0]);
    return { events: records(body.events), league };
  } catch (error) {
    console.warn(`ESPN scoreboard (${slug}) failed:`, error instanceof Error ? error.message : error);
    return null;
  }
}

function elapsedMinute(status: JsonRecord): number | null {
  const period = Number(text(status.period)) || 0;
  const clock = Number(text(status.clock));
  if (clock > 0) {
    const minute = Math.floor(clock / 60);
    return period >= 2 ? Math.min(120, 45 + minute) : minute;
  }
  // displayClock falls back to strings like "45'+2'".
  const parsed = parseInt(text(status.displayClock), 10);
  return Number.isFinite(parsed) ? (period >= 2 ? Math.min(120, 45 + parsed) : parsed) : null;
}

function statusShape(status: JsonRecord): { elapsed: number | null; short: string; long: string } {
  const type = record(status.type);
  const state = text(type.state) || text(status.state);
  const shortDetail = text(type.shortDetail) || text(type.description);
  if (state === "in") {
    const upper = shortDetail.trim().toUpperCase();
    const short = /^(HT|FT|AET|PEN|BREAK)/.test(upper) ? upper.slice(0, 3) : "LIVE";
    return { elapsed: elapsedMinute(status), short, long: shortDetail || "In play" };
  }
  if (state === "post") {
    const upper = shortDetail.trim().toUpperCase();
    const short = upper.includes("PEN") ? "PEN" : upper.includes("AET") ? "AET" : "FT";
    return { elapsed: null, short, long: shortDetail || "Match finished" };
  }
  return { elapsed: null, short: "NS", long: shortDetail || "Not started" };
}

function competitorSide(competition: JsonRecord, side: "home" | "away"): JsonRecord {
  const entry = records(competition.competitors).find(
    (item) => text(record(item).homeAway) === side
  ) ?? {};
  const team = record(entry.team);
  return {
    id: Number(text(team.id)) || 0,
    name: text(team.displayName, side === "home" ? "Home" : "Away"),
    logo: text(team.logo) || undefined,
    winner: text(entry.winner) === "true" ? true : null,
  };
}

function competitorScore(competition: JsonRecord, side: "home" | "away"): number | null {
  const entry = records(competition.competitors).find((item) => text(record(item).homeAway) === side);
  const score = text(record(entry).score);
  return /^\d+$/.test(score) ? Number(score) : null;
}

// ESPN scoreboard event → API-Football fixture shape.
function toApiFootballFixture(event: JsonRecord, league: JsonRecord, slug: string): JsonRecord {
  const competition = record(records(event.competitions)[0]);
  const status = statusShape(competition.status ? record(competition.status) : record(event.status));
  const country = countryForSlug(text(league.slug) || slug);
  const venue = record(competition.venue);
  eventSlugById.set(text(event.id), text(league.slug) || slug);
  return {
    fixture: {
      id: Number(text(event.id)) || 0,
      date: text(event.date),
      status,
      venue: text(venue.fullName)
        ? { name: text(venue.fullName), city: text(record(venue.address).city) || null }
        : undefined,
    },
    league: {
      id: Number(text(league.id)) || 0,
      name: text(league.name, "Football"),
      country,
      logo: text(record(records(league.logos)[0]).href) || undefined,
    },
    teams: {
      home: competitorSide(competition, "home"),
      away: competitorSide(competition, "away"),
    },
    goals: {
      home: competitorScore(competition, "home"),
      away: competitorScore(competition, "away"),
    },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  };
}

function accraDateCompact(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date).replaceAll("-", "");
}

function accraDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

// ESPN soccer scoreboards reject date ranges (HTTP 400), so multi-day views
// fetch one Accra day at a time. A pool keeps the parallelism polite, and each
// day's combined result is cached so repeat views don't re-hit ESPN.
const dayCache = new Map<string, Cache<JsonRecord[]>>();
const DAY_CACHE_TTL = 30 * 60 * 1000;

async function pooled<T, R>(items: readonly T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = next++;
      if (index >= items.length) return;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

async function collectDay(compactDate: string): Promise<JsonRecord[]> {
  const cached = dayCache.get(compactDate);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const boards: ({ events: JsonRecord[]; league: JsonRecord } | null)[] = await pooled(LEAGUE_SLUGS, 12, (slug) => scoreboard(slug, compactDate));
  const fixtures: JsonRecord[] = [];
  for (const [index, board] of boards.entries()) {
    if (!board) continue;
    for (const event of board.events) {
      fixtures.push(toApiFootballFixture(event, board.league, LEAGUE_SLUGS[index]));
    }
  }
  dayCache.set(compactDate, { value: fixtures, expiresAt: Date.now() + DAY_CACHE_TTL });
  return fixtures;
}

function kickoff(fixture: JsonRecord): string {
  return text(record(fixture.fixture).date);
}

function byKickoff(first: JsonRecord, second: JsonRecord): number {
  return kickoff(first).localeCompare(kickoff(second));
}

// Serious competitions first (Premier League, Champions League, the Ghana
// Premier League…), then the rest; ties break by earlier kick-off.
function seriousFirst(fixtures: JsonRecord[]): JsonRecord[] {
  return [...fixtures].sort((first, second) => {
    const label = (fixture: JsonRecord) => {
      const league = record(fixture.league);
      return [text(league.name), text(league.country)].filter(Boolean).join(" · ");
    };
    const rankDiff = competitionRank(label(first)) - competitionRank(label(second));
    if (rankDiff !== 0) return rankDiff;
    return byKickoff(first, second);
  });
}

function statusShort(fixture: JsonRecord): string {
  return text(record(record(fixture.fixture).status).short);
}

// ─── Public views ───────────────────────────────────────────────────────────

/** Live fixtures (state "in") across the priority leagues, serious-first. */
export async function espnLiveMatches(): Promise<JsonRecord[]> {
  if (liveCache && liveCache.expiresAt > Date.now()) return liveCache.value;
  // Without a dates parameter ESPN serves the current matchday, which is
  // exactly the window an in-play filter needs.
  const boards: ({ events: JsonRecord[]; league: JsonRecord } | null)[] = await pooled(LEAGUE_SLUGS, 12, (slug) => scoreboard(slug));
  const all: JsonRecord[] = [];
  for (const [index, board] of boards.entries()) {
    if (!board) continue;
    for (const event of board.events) {
      all.push(toApiFootballFixture(event, board.league, LEAGUE_SLUGS[index]));
    }
  }
  const live = all.filter((fixture) => ["LIVE", "HT"].includes(statusShort(fixture)));
  const value = seriousFirst(live);
  liveCache = { value, expiresAt: Date.now() + 60_000 };
  return value;
}

/** Upcoming fixtures over the next `daysAhead` days (Ghana league merged in). */
export async function espnFixturesInRange(daysAhead: number): Promise<JsonRecord[]> {
  const from = accraDate(new Date());
  const to = accraDate(new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000));
  const cacheKey = `fixtures:${from}:${to}`;
  const cached = rangeCaches.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const days = Array.from({ length: daysAhead + 1 }, (_, offset) =>
    accraDateCompact(new Date(Date.now() + offset * 24 * 60 * 60 * 1000)));
  const perDay = await Promise.all(days.map((day) => collectDay(day)));
  const espnFixtures = perDay.flat()
    .filter((fixture) => statusShort(fixture) === "NS")
    .sort(byKickoff);
  const value = await mergeGhana(espnFixtures, from, to, false);
  rangeCaches.set(cacheKey, { value, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
  return value;
}

/** Recent results over the past `daysBack` days (Ghana league merged in). */
export async function espnResultsInRange(daysBack: number): Promise<JsonRecord[]> {
  const from = accraDate(new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000));
  const to = accraDate(new Date());
  const cacheKey = `results:${from}:${to}`;
  const cached = rangeCaches.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const days = Array.from({ length: daysBack + 1 }, (_, offset) =>
    accraDateCompact(new Date(Date.now() - offset * 24 * 60 * 60 * 1000)));
  const perDay = await Promise.all(days.map((day) => collectDay(day)));
  const espnFixtures = perDay.flat()
    .filter((fixture) => ["FT", "AET", "PEN"].includes(statusShort(fixture)))
    .sort((first, second) => byKickoff(second, first));
  const value = await mergeGhana(espnFixtures, from, to, true);
  rangeCaches.set(cacheKey, { value, expiresAt: Date.now() + 60 * 60 * 1000 });
  return value;
}

// ESPN does not carry the Ghana Premier League; fold the TheSportsDB supplement
// in exactly like the Sportmonks range path does so the desks never drop it.
async function mergeGhana(fixtures: JsonRecord[], from: string, to: string, newestFirst: boolean): Promise<JsonRecord[]> {
  try {
    const ghana = await ghanaFixturesInRange(from, to);
    if (ghana.length === 0) return fixtures;
    return [...fixtures, ...ghana].sort((first, second) => {
      const firstDate = kickoff(first);
      const secondDate = kickoff(second);
      return newestFirst ? secondDate.localeCompare(firstDate) : firstDate.localeCompare(secondDate);
    });
  } catch (error) {
    console.warn("Ghana fixtures merge skipped:", error instanceof Error ? error.message : error);
    return fixtures;
  }
}

// ─── Detail ─────────────────────────────────────────────────────────────────

// ESPN summary keyEvent type id → API-Football event type.
const KEY_EVENT_TYPES: Record<string, string> = {
  "goal": "Goal",
  "own-goal": "Goal",
  "penalty-goal": "Goal",
  "free-kick-goal": "Goal",
  "yellow-card": "Card",
  "red-card": "Card",
  "yellowred-card": "Card",
  "substitution": "Subst",
  "var": "Var",
  "penalty-shootout": "Penalty",
  "penalty-missed": "Var",
};

/** Best-effort fixture detail for an ESPN event id, or null when unknown. */
export async function espnFixtureDetail(detailId: string): Promise<JsonRecord | null> {
  if (!/^\d+$/.test(detailId)) return null;
  const cached = detailCache.get(detailId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const slug = eventSlugById.get(detailId);
  if (!slug) return null;
  try {
    const response = await fetch(`${SITE_API}/${slug}/summary?event=${detailId}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store",
    });
    if (!response.ok) return null;
    const body = record(await response.json().catch(() => null));
    const header = record(body.header);
    const competition = record(records(header.competitions)[0]);
    if (records(competition.competitors).length === 0) return null;
    const status = statusShape(competition.status ? record(competition.status) : record(header.status));
    const gameInfo = record(body.gameInfo);
    const venue = record(gameInfo.venue);
    const boardLeague = record(records(body.leagues)[0]);
    const events = records(body.keyEvents).map((event) => {
      const type = record(event.type);
      const clock = record(event.clock);
      const involved = records(event.athletesInvolved);
      return {
        time: { elapsed: parseInt(text(clock.displayValue), 10) || null, extra: null },
        type: KEY_EVENT_TYPES[text(type.id)] || text(type.text, "Event"),
        detail: text(type.text) || text(event.text),
        player: { name: text(record(involved[0]).displayName) || undefined },
        assist: { name: text(record(involved[1]).displayName) || undefined },
        team: { name: text(record(event.team).displayName) || undefined, logo: undefined },
      };
    });
    const fixture: JsonRecord = {
      fixture: {
        id: Number(detailId),
        date: text(competition.date) || text(header.date),
        status,
        venue: text(venue.fullName)
          ? { name: text(venue.fullName), city: text(record(venue.address).city) || null }
          : undefined,
      },
      league: {
        id: Number(text(boardLeague.id)) || 0,
        name: text(boardLeague.name, "Football"),
        country: countryForSlug(slug),
        logo: text(record(records(boardLeague.logos)[0]).href) || undefined,
      },
      teams: {
        home: competitorSide(competition, "home"),
        away: competitorSide(competition, "away"),
      },
      goals: {
        home: competitorScore(competition, "home"),
        away: competitorScore(competition, "away"),
      },
      score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
      events,
      statistics: [],
    };
    detailCache.set(detailId, { value: fixture, expiresAt: Date.now() + 45_000 });
    return fixture;
  } catch (error) {
    console.warn("ESPN fixture detail failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
