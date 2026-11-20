// ESPN live fallback for the non-football sports on /api/live-sports.
//
// The API-Sports account behind every per-sport key can be suspended (the
// provider then answers HTTP 200 with "Your account is suspended…", which the
// route reports as status "error"). ESPN's public site API needs no key and
// covers basketball/NBA, NFL and MLB, so those feeds keep rendering while the
// paid account is down. Handball and volleyball are not on ESPN and stay
// dependent on API-Sports.

import type { LiveSport, LiveSportEvent } from "./liveSportsData";

// Plain HTTP on purpose: ESPN's Akamai edge denies server-side HTTPS from
// Node runtimes (TLS fingerprinting) but serves the same JSON over HTTP.
const SITE_API = "http://site.api.espn.com/apis/site/v2/sports";
const TIMEOUT_MS = 8000;

// LiveSport value → ESPN sport/league paths.
const ESPN_LEAGUES: Partial<Record<LiveSport, string[]>> = {
  basketball: ["basketball/nba"],
  nba: ["basketball/nba"],
  baseball: ["baseball/mlb"],
  nfl: ["football/nfl"],
};

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

/** True when ESPN carries the sport at all (so an empty result means "no
 * games live right now", not "no provider"). */
export function espnSupportedSport(sport: LiveSport): boolean {
  return Boolean(ESPN_LEAGUES[sport]);
}

/** In-play events for one sport, serious competitions first. ESPN serves the
 * current matchday by default, so no date handling is needed here. */
export async function espnLiveSportEvents(sport: LiveSport): Promise<LiveSportEvent[]> {
  const paths = ESPN_LEAGUES[sport];
  if (!paths) return [];
  const responses = await Promise.all(paths.map(async (path) => {
    try {
      const response = await fetch(`${SITE_API}/${path}/scoreboard`, {
        signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store",
      });
      if (!response.ok) return null;
      return record(await response.json().catch(() => null));
    } catch (error) {
      console.warn(`ESPN scoreboard (${path}) failed:`, error instanceof Error ? error.message : error);
      return null;
    }
  }));
  const events: LiveSportEvent[] = [];
  for (const body of responses) {
    if (!body) continue;
    const league = record(records(body.leagues)[0]);
    const competitionLabel = text(league.name, "Live event");
    for (const event of records(body.events)) {
      const competition = record(records(event.competitions)[0]);
      const status = record(competition.status ? competition.status : event.status);
      const type = record(status.type);
      if (text(type.state) !== "in") continue;
      const competitors = records(competition.competitors);
      const side = (which: string) => record(competitors.find((entry) => text(record(entry).homeAway) === which));
      const home = side("home");
      const away = side("away");
      const homeTeam = record(home.team);
      const awayTeam = record(away.team);
      events.push({
        id: text(event.id),
        sport,
        source: "espn",
        competition: competitionLabel,
        participants: [text(homeTeam.displayName, "Home"), text(awayTeam.displayName, "Away")],
        logos: [
          text(homeTeam.logo) || text(record(records(homeTeam.logos)[0]).href) || undefined,
          text(awayTeam.logo) || text(record(records(awayTeam.logos)[0]).href) || undefined,
        ],
        score: `${text(home.score, "-")} - ${text(away.score, "-")}`,
        status: text(type.shortDetail) || text(type.description) || "Live",
        location: text(record(competition.venue).fullName) || undefined,
        date: text(event.date) || undefined,
      });
    }
  }
  return events;
}

// ─── Single-game detail ─────────────────────────────────────────────────────
//
// The API-Sports account can be suspended for months, but the live lists keep
// working through ESPN. Without this, every match-details pane for
// basketball/NBA/NFL/MLB would be a dead end: the list id belongs to ESPN and
// API-Sports answers "not found" (or "account suspended") for it.

type SummaryCache = { expiresAt: number; value: JsonRecord | null };
const summaryCache = new Map<string, SummaryCache>();
const SUMMARY_TTL_MS = 45_000;

function periodKey(sport: LiveSport, index: number): string {
  if (sport === "baseball") return `inning_${index + 1}`;
  if (sport === "nfl" || sport === "basketball" || sport === "nba") return `quarter_${index + 1}`;
  return `period_${index + 1}`;
}

function numeric(value: unknown): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(text(value));
  return Number.isFinite(parsed) ? parsed : null;
}

// ESPN variable names → readable column/row labels.
function statLabel(name: string): string {
  const known: Record<string, string> = {
    "fieldGoalsMade-fieldGoalsAttempted": "FG",
    fieldGoalPct: "FG %",
    "threePointFieldGoalsMade-threePointFieldGoalsAttempted": "3PT",
    threePointFieldGoalPct: "3PT %",
    "freeThrowsMade-freeThrowsAttempted": "FT",
    freeThrowPct: "FT %",
    totalRebounds: "Rebounds",
    offensiveRebounds: "Off. rebounds",
    defensiveRebounds: "Def. rebounds",
    assists: "Assists",
    steals: "Steals",
    blocks: "Blocks",
    turnovers: "Turnovers",
    totalTurnovers: "Turnovers",
    teamTurnovers: "Team turnovers",
    technicalFouls: "Technical fouls",
    flagrantFouls: "Flagrant fouls",
    turnoverPoints: "Points off turnovers",
    fastBreakPoints: "Fast-break points",
    pointsInPaint: "Points in paint",
    largestLead: "Largest lead",
    leadChanges: "Lead changes",
    fouls: "Fouls",
    points: "Points",
    passingTouchdowns: "Passing TDs",
    rushingTouchdowns: "Rushing TDs",
    receivingTouchdowns: "Receiving TDs",
    totalTouchdowns: "Total TDs",
    netPassingYards: "Net passing yards",
    rushingYards: "Rushing yards",
    receivingYards: "Receiving yards",
    totalYards: "Total yards",
    thirdDownEff: "3rd down",
    fourthDownEff: "4th down",
    redZoneEff: "Red zone",
    possessionTime: "Possession",
    hits: "Hits",
    runs: "Runs",
    errors: "Errors",
    homeRuns: "Home runs",
    rbi: "RBI",
  };
  if (known[name]) return known[name];
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

type StatRow = { type: string; value: string };

// Team statistics: basketball/NFL expose a flat list, baseball nests one group
// per discipline (batting/pitching/fielding).
function teamStatRows(sport: LiveSport, statistics: unknown): StatRow[] {
  const groups = records(statistics);
  const rows: StatRow[] = [];
  const push = (entry: JsonRecord) => {
    const label = statLabel(text(entry.name));
    const value = text(entry.displayValue) || text(entry.value);
    if (label && value) rows.push({ type: label, value });
  };
  if (sport === "baseball") {
    // Baseball teams report three nested groups with dozens of fields each;
    // the scoreboard-worthy ones are R/H/E plus the batting power numbers.
    const pick = (groupName: string, name: string, label: string) => {
      const group = groups.find((entry) => text(entry.name) === groupName);
      const stat = records(record(group).stats).find((entry) => text(entry.name) === name);
      const value = text(record(stat).displayValue) || text(record(stat).value);
      if (value) rows.push({ type: label, value });
    };
    pick("batting", "runs", "Runs");
    pick("batting", "hits", "Hits");
    pick("fielding", "errors", "Errors");
    pick("batting", "homeRuns", "Home runs");
    pick("batting", "RBIs", "RBI");
    pick("batting", "walks", "Walks");
    pick("batting", "strikeouts", "Strikeouts");
    pick("batting", "stolenBases", "Stolen bases");
    pick("pitching", "earnedRuns", "Earned runs");
    pick("pitching", "saves", "Saves");
  } else {
    for (const entry of groups) {
      if (Array.isArray(entry.stats)) records(entry.stats).forEach(push);
      else push(entry);
    }
  }
  const seen = new Set<string>();
  return rows.filter((row) => !seen.has(row.type) && seen.add(row.type)).slice(0, 16);
}

function groupTitle(sport: LiveSport, group: JsonRecord, index: number): string {
  const name = text(group.name) || text(group.description);
  if (name) return name.replace(/^./, (letter) => letter.toUpperCase());
  if (sport === "baseball") return index === 0 ? "Batting" : index === 1 ? "Pitching" : "Fielding";
  return "";
}

type PlayerGroupShape = {
  title: string;
  labels: string[];
  players: { name: string; starter: boolean; stats: string[] }[];
};

// Per-team box score: every stat group ESPN returns (passing/rushing/receiving
// for the NFL, one group for the NBA, batting/pitching for MLB).
function playerGroupsFor(sport: LiveSport, entry: JsonRecord): PlayerGroupShape[] {
  return records(entry.statistics).map((group, index) => ({
    title: groupTitle(sport, group, index),
    labels: Array.isArray(group.labels) ? group.labels.map((label) => text(label)) : [],
    players: records(group.athletes).map((athlete) => ({
      name: text(record(athlete.athlete).displayName),
      starter: Boolean(athlete.starter),
      stats: Array.isArray(athlete.stats) ? athlete.stats.map((value) => text(value)) : [],
    })).filter((player) => player.name && player.stats.length > 0),
  })).filter((group) => group.labels.length > 0 && group.players.length > 0);
}


async function summaryBody(path: string, eventId: string): Promise<JsonRecord | null> {
  const cacheKey = `${path}:${eventId}`;
  const cached = summaryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  try {
    const response = await fetch(`${SITE_API}/${path}/summary?event=${eventId}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store",
    });
    if (!response.ok) {
      summaryCache.set(cacheKey, { value: null, expiresAt: Date.now() + SUMMARY_TTL_MS });
      return null;
    }
    const body = record(await response.json().catch(() => null));
    const value = Object.keys(body).length > 0 ? body : null;
    summaryCache.set(cacheKey, { value, expiresAt: Date.now() + SUMMARY_TTL_MS });
    return value;
  } catch (error) {
    console.warn(`ESPN summary (${path}/event ${eventId}) failed:`, error instanceof Error ? error.message : error);
    summaryCache.set(cacheKey, { value: null, expiresAt: Date.now() + SUMMARY_TTL_MS });
    return null;
  }
}

/** API-Sports-shaped game detail for an ESPN event id, or null when unknown. */
export async function espnSportGameDetail(sport: LiveSport, eventId: string): Promise<JsonRecord | null> {
  const paths = ESPN_LEAGUES[sport];
  if (!paths || !/^\d+$/.test(eventId)) return null;

  for (const path of paths) {
    const body = await summaryBody(path, eventId);
    if (!body) continue;
    const header = record(body.header);
    const competition = record(records(header.competitions)[0]);
    const competitors = records(competition.competitors);
    if (competitors.length === 0) continue;

    const side = (which: string) =>
      record(competitors.find((entry) => text(record(entry).homeAway) === which));
    const scoresFor = (entry: JsonRecord) => {
      const scores: JsonRecord = {};
      const total = numeric(entry.score);
      if (total != null) scores.total = total;
      records(entry.linescores).forEach((period, index) => {
        const value = numeric(record(period).value) ?? numeric(record(period).displayValue);
        if (value != null) scores[periodKey(sport, index)] = value;
      });
      return scores;
    };
    const status = record(competition.status ? competition.status : header.status);
    const type = record(status.type);
    const state = text(type.state);
    const home = side("home");
    const away = side("away");
    const homeTeam = record(home.team);
    const awayTeam = record(away.team);
    const box = record(body.boxscore);
    const statistics = records(box.teams)
      .map((teamEntry) => ({
        team: { name: text(record(teamEntry.team).displayName) },
        statistics: teamStatRows(sport, teamEntry.statistics),
      }))
      .filter((group) => group.statistics.length > 0);
    const playerStats = records(box.players)
      .map((playerEntry) => ({
        team: text(record(playerEntry.team).displayName),
        groups: playerGroupsFor(sport, playerEntry),
      }))
      .filter((group) => group.groups.length > 0);
    const detail: JsonRecord = {
      teams: {
        home: {
          name: text(homeTeam.displayName, "Home"),
          logo: text(homeTeam.logo) || text(record(records(homeTeam.logos)[0]).href) || undefined,
        },
        away: {
          name: text(awayTeam.displayName, "Away"),
          logo: text(awayTeam.logo) || text(record(records(awayTeam.logos)[0]).href) || undefined,
        },
      },
      scores: { home: scoresFor(home), away: scoresFor(away) },
      status: {
        long: text(type.description) || text(type.shortDetail) || "Live",
        short: text(type.shortDetail) || text(type.description) || "Live",
      },
      time: state === "in" ? text(status.displayClock) : "",
      date: text(competition.date) || text(header.date),
      statistics,
      playerStats,
    };
    return detail;
  }
  return null;
}
