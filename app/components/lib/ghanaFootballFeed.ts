// Ghana Premier League supplement for /api/matches.
//
// The GPL is not covered by the current Sportmonks subscription, so league 233
// is served from TheSportsDB instead (free tier, league id 4974). Every helper
// here normalises TheSportsDB v1 responses into the API-Football shapes the
// client components consume, mirroring app/components/lib/sportmonksFootball.ts.
//
// Env: THESPORTSDB_API_KEY — a free key from thesportsdb.com. The public test
// key "123" is used when unset; it works but truncates responses, so register
// a free key for full fixture lists and standings.

const TSDB_ROOT = "https://www.thesportsdb.com/api/v1/json";
const GPL_LEAGUE_ID = 4974; // "Ghanaian Premier League" on TheSportsDB
const TIMEOUT_MS = 8000;

export function tsdbKey(): string {
  const environment = process.env as Record<string, string | undefined>;
  return environment.THESPORTSDB_API_KEY?.trim() || "123";
}

export function isGhanaLeague(apiLeagueId: number): boolean {
  return apiLeagueId === 233; // API-Football id used by the standings page
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

// TheSportsDB GPL seasons are "2026-2027" style; the standings UI passes the
// starting year. (Older archived seasons on TheSportsDB skip years because the
// league was suspended, so a missing year resolves to an empty table.)
function seasonSlug(year: number): string {
  return `${year}-${year + 1}`;
}

type Cache<T> = { expiresAt: number; value: T };
let badgeCache: Cache<string | undefined> | null = null;
const seasonEventsCache = new Map<number, Cache<JsonRecord[]>>();
const standingsCache = new Map<number, Cache<JsonRecord[]>>();

async function tsdbFetch(path: string): Promise<unknown | null> {
  const url = `${TSDB_ROOT}/${tsdbKey()}${path}`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" });
    if (!response.ok) return null;
    const body = await response.json().catch(() => null);
    if (!body || typeof body !== "object") return null;
    return body;
  } catch (error) {
    console.warn("TheSportsDB request failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

// TheSportsDB GPL event → API-Football fixture shape.
function toApiFootballFixture(event: JsonRecord): JsonRecord {
  const dateEvent = text(event.dateEvent);
  const time = text(event.strTime) || "00:00:00";
  const short = text(event.strStatus, "NS");
  const statusMap: Record<string, string> = {
    "Match Finished": "FT",
    "Not Started": "NS",
    Postponed: "PST",
    Cancelled: "CANC",
    Abandoned: "ABD",
    "After Over Time": "AET",
    "After Penalty": "PEN",
  };
  return {
    fixture: {
      id: Number(text(event.idEvent)) || 0,
      date: dateEvent ? `${dateEvent} ${time}` : "",
      status: { elapsed: null, short: statusMap[short] ?? short, long: short },
      venue: undefined,
    },
    league: {
      id: 233,
      name: "Ghana Premier League",
      country: "Ghana",
      logo: badgeCache?.value,
    },
    teams: {
      home: { id: Number(text(event.idHomeTeam)) || 0, name: text(event.strHomeTeam, "Home"), logo: text(event.strHomeTeamBadge) || undefined, winner: null },
      away: { id: Number(text(event.idAwayTeam)) || 0, name: text(event.strAwayTeam, "Away"), logo: text(event.strAwayTeamBadge) || undefined, winner: null },
    },
    goals: {
      home: event.intHomeScore == null || event.intHomeScore === "" ? null : Number(event.intHomeScore),
      away: event.intAwayScore == null || event.intAwayScore === "" ? null : Number(event.intAwayScore),
    },
    score: { halftime: { home: null, away: null }, fulltime: { home: null, away: null } },
  };
}

async function leagueBadge(): Promise<string | undefined> {
  if (badgeCache && badgeCache.expiresAt > Date.now()) return badgeCache.value;
  const body = record(await tsdbFetch(`/lookupleague.php?id=${GPL_LEAGUE_ID}`));
  const badge = text(record(records(body.leagues)[0]).strBadge) || undefined;
  badgeCache = { value: badge, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  return badge;
}

// Full GPL season schedule, cached for hours. The free test key truncates this
// list; a registered key returns the complete round-by-round schedule.
async function seasonEvents(year: number): Promise<JsonRecord[]> {
  const cached = seasonEventsCache.get(year);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const body = record(await tsdbFetch(`/eventsseason.php?id=${GPL_LEAGUE_ID}&s=${seasonSlug(year)}`));
  const events = records(body.events);  void leagueBadge();
  seasonEventsCache.set(year, { value: events, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
  return events;
}

function dateOnly(fixture: JsonRecord): string {
  return text(record(fixture.fixture).date).slice(0, 10);
}

/** GPL fixtures within [from, to] inclusive, in API-Football fixture shape. */
export async function ghanaFixturesInRange(from: string, to: string): Promise<JsonRecord[]> {
  const events = await seasonEvents(Number(from.slice(0, 4)));
  return events
    .map(toApiFootballFixture)
    .filter((fixture) => {
      const date = dateOnly(fixture);
      return date >= from && date <= to;
    })
    .sort((first, second) => dateOnly(first).localeCompare(dateOnly(second)));
}

/** GPL seasons for the standings page dropdown (starting years, newest first). */
export function ghanaSeasons(): JsonRecord[] {
  return [2026, 2025, 2024, 2023, 2022, 2021, 2020].map((year) => ({
    year,
    current: year === 2026,
    coverage: { standings: true },
  }));
}

/** GPL table for a starting year, in the API-Football standings shape. */
export async function ghanaStandings(year: number): Promise<JsonRecord[] | null> {
  const cacheKey = year;
  const cached = standingsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const body = record(await tsdbFetch(`/lookuptable.php?l=${GPL_LEAGUE_ID}&s=${seasonSlug(year)}`));
  const table = records(body.table);
  if (table.length === 0) return null;
  const rows = table.map((row, index) => ({
    rank: index + 1,
    team: {
      id: Number(text(row.idTeam)) || 0,
      name: text(row.strTeam, "Unknown"),
      logo: text(row.strBadge) || text(row.strTeamBadge) || undefined,
    },
    points: Number(text(row.intPoints)) || 0,
    goalsDiff: Number(text(row.intGoalDifference)) || 0,
    all: {
      played: Number(text(row.intPlayed)) || 0,
      win: Number(text(row.intWin)) || 0,
      draw: Number(text(row.intDraw)) || 0,
      lose: Number(text(row.intLoss)) || 0,
      goals: { for: Number(text(row.intGoalsFor)) || 0, against: Number(text(row.intGoalsAgainst)) || 0 },
    },
    form: text(row.strForm) || null,
    group: null,
    description: null,
  }));
  standingsCache.set(cacheKey, { value: rows, expiresAt: Date.now() + 6 * 60 * 60 * 1000 });
  return rows;
}

/** Best-effort GPL fixture detail (Sportmonks fallback when its lookup 404s). */
export async function ghanaDetail(detailId: string): Promise<JsonRecord | null> {
  if (!/^\d+$/.test(detailId)) return null;
  const body = record(await tsdbFetch(`/lookupevent.php?id=${detailId}`));
  const event = record(records(body.events)[0]);
  if (text(event.idEvent) !== detailId) return null;
  const fixture = toApiFootballFixture(event);
  const scoreline = text(event.strResultString) || text(event.strStatus);
  return {
    ...fixture,
    events: [],
    statistics: [],
    // The detail panel reads fixture.status.long when elapsed is null.
    _summary: scoreline,
  };
}
