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
        competition: competitionLabel,
        participants: [text(homeTeam.displayName, "Home"), text(awayTeam.displayName, "Away")],
        logos: [text(homeTeam.logo) || undefined, text(awayTeam.logo) || undefined],
        score: `${text(home.score, "-")} - ${text(away.score, "-")}`,
        status: text(type.shortDetail) || text(type.description) || "Live",
        location: text(record(competition.venue).fullName) || undefined,
        date: text(event.date) || undefined,
      });
    }
  }
  return events;
}
