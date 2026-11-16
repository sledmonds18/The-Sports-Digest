export const LIVE_SPORTS = [
  "football",
  "basketball",
  "baseball",
  "nba",
  "nfl",
  "volleyball",
  "handball",
] as const;

export type LiveSport = (typeof LIVE_SPORTS)[number];
export type LiveSportStatus = "ready" | "unconfigured" | "error" | "unsupported";

export interface LiveSportEvent {
  id: string;
  sport: LiveSport;
  competition: string;
  participants: string[];
  score: string;
  status: string;
  location?: string;
  date?: string;
  /** Team crests aligned by index with `participants` (entries may be missing). */
  logos?: (string | undefined)[];
}

export interface LiveSportFeed {
  sport: LiveSport;
  status: LiveSportStatus;
  events: LiveSportEvent[];
  message?: string;
}

export const LIVE_SPORT_LABELS: Record<LiveSport, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  nba: "NBA",
  nfl: "NFL",
  volleyball: "Volleyball",
  handball: "Handball",
};

export const LIVE_SPORT_ICONS: Record<LiveSport, string> = {
  football: "⚽",
  basketball: "🏀",
  baseball: "⚾",
  nba: "🏀",
  nfl: "🏈",
  volleyball: "🏐",
  handball: "🤾",
};

// Major competitions always surface at the top of the live centre; every other
// competition follows. Order matters: earlier entries rank higher. Domestic
// leagues are country-qualified so lookalikes (Mexico's "Liga Premier Serie A",
// Austria's "Bundesliga") do not rank as Europe's top flights.
const PRIORITY_COMPETITIONS = [
  "fifa world cup",
  "wc qualification",
  "nations league",
  "africa cup of nations",
  "ghana premier league",
  "caf champions league",
  "caf confederation cup",
  "uefa champions league",
  "uefa europa league",
  "premier league · england",
  "laliga",
  "la liga · spain",
  "serie a · italy",
  "serie a · brazil",
  "bundesliga · germany",
  "ligue 1 · france",
  "eredivisie · netherlands",
  "primeira liga · portugal",
  "efl championship · england",
  "major league soccer · usa",
  "saudi pro league",
  "copa libertadores",
  "fa cup · england",
  "copa del rey · spain",
  "coppa italia · italy",
  "dfb pokal · germany",
  "nba",
  "euroleague",
  "mlb",
  "nfl",
  "formula 1",
] as const;

function normalizeCompetitionLabel(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function competitionRank(competition?: string): number {
  if (!competition) return PRIORITY_COMPETITIONS.length;
  const label = normalizeCompetitionLabel(competition);
  const index = PRIORITY_COMPETITIONS.findIndex((name) => label.includes(name));
  return index === -1 ? PRIORITY_COMPETITIONS.length : index;
}

// Serious competitions first; ties are broken by earlier kick-off.
export function compareEventsByPriority(
  first: { competition?: string; date?: string },
  second: { competition?: string; date?: string },
): number {
  const rankDiff = competitionRank(first.competition) - competitionRank(second.competition);
  if (rankDiff !== 0) return rankDiff;
  const firstDate = Date.parse(first.date || "");
  const secondDate = Date.parse(second.date || "");
  if (!Number.isNaN(firstDate) && !Number.isNaN(secondDate) && firstDate !== secondDate) {
    return firstDate - secondDate;
  }
  return 0;
}

// Mix every live sport into the summary surfaces (home bar, ticker) so a busy
// football slate cannot crowd basketball, handball etc. out of view. Within
// each sport the serious-matches-first order is preserved.
export function interleaveBySport<T extends { sport: LiveSport }>(events: T[], limit: number): T[] {
  const bySport = LIVE_SPORTS.map((sport) => events.filter((event) => event.sport === sport));
  const picked: T[] = [];
  for (let round = 0; picked.length < limit; round++) {
    let addedThisRound = false;
    for (const list of bySport) {
      if (picked.length >= limit) break;
      if (round < list.length) {
        picked.push(list[round]);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
  }
  return picked;
}
