import type {
  LiveSport,
  LiveSportEvent,
  LiveSportFeed,
} from "../../components/lib/liveSportsData";
import {
  LIVE_SPORTS,
  compareEventsByPriority,
} from "../../components/lib/liveSportsData";
import { espnLiveSportEvents, espnSportGameDetail, espnSupportedSport } from "../../components/lib/espnLive";
import { apiSportsKey } from "../../components/lib/apiSportsKey";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=1800",
};
const VOLLEYBALL_RESULTS_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
};

type JsonRecord = Record<string, unknown>;
type VolleyballResultsCache = {
  feed: LiveSportFeed;
  updatedAt: string;
  expiresAt: number;
};

let volleyballResultsCache: VolleyballResultsCache | null = null;
const gameDetailCache = new Map<string, { expiresAt: number; response: unknown }>();

const API_SPORTS_CONFIG: Partial<
  Record<LiveSport, { host: string; keyName: string; path: string; dateParam?: boolean }>
> = {
  basketball: {
    host: "https://v1.basketball.api-sports.io",
    keyName: "API_BASKETBALL_KEY",
    path: "/games",
    dateParam: true,
  },
  baseball: {
    host: "https://v1.baseball.api-sports.io",
    keyName: "API_BASEBALL_KEY",
    path: "/games",
    dateParam: true,
  },
  nba: {
    host: "https://v2.nba.api-sports.io",
    keyName: "API_NBA_KEY",
    path: "/games?live=all",
  },
  nfl: {
    host: "https://v1.american-football.api-sports.io",
    keyName: "API_NFL_KEY",
    path: "/games?live=all",
  },
  volleyball: {
    host: "https://v1.volleyball.api-sports.io",
    keyName: "API_VOLLEYBALL_KEY",
    path: "/games",
    dateParam: true,
  },
  handball: {
    host: "https://v1.handball.api-sports.io",
    keyName: "API_HANDBALL_KEY",
    path: "/games",
    dateParam: true,
  },
};

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function valueAt(value: unknown, ...keys: string[]): unknown {
  let current = value;
  for (const key of keys) current = record(current)[key];
  return current;
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function displayScore(home: unknown, away: unknown): string {
  const first = home == null ? "-" : text(home, "-");
  const second = away == null ? "-" : text(away, "-");
  return `${first} - ${second}`;
}

function dateInAccra(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function apiSportsEvent(sport: LiveSport, value: unknown, index: number): LiveSportEvent {
  const game = record(value);
  // API-NBA calls the away side `visitors` and reports numeric status codes,
  // so prefer the human-readable `long` value there.
  const status = sport === "nba"
    ? text(valueAt(game, "status", "long"), text(valueAt(game, "status", "short"), "Live"))
    : text(
        valueAt(game, "status", "short") ?? valueAt(game, "status", "long") ??
          valueAt(game, "event_status") ?? valueAt(game, "status"),
        "Live"
      );
  const eventTitle = text(valueAt(game, "competition", "name"), "Live event");
  const home = text(
    valueAt(game, "teams", "home", "name"),
    text(valueAt(game, "event_home_team"), text(valueAt(game, "drivers", "first", "name"), eventTitle))
  );
  const away = text(
    valueAt(game, "teams", "away", "name") ?? valueAt(game, "teams", "visitors", "name"),
    text(valueAt(game, "event_away_team"), text(valueAt(game, "drivers", "second", "name"), ""))
  );
  const homeScore =
    valueAt(game, "scores", "home", "total") ??
    valueAt(game, "scores", "home", "points") ??
    valueAt(game, "scores", "home");
  const awayScore =
    valueAt(game, "scores", "away", "total") ??
    valueAt(game, "scores", "away", "points") ??
    valueAt(game, "scores", "visitors", "total") ??
    valueAt(game, "scores", "visitors", "points") ??
    valueAt(game, "scores", "away") ??
    valueAt(game, "scores", "visitors");
  const league = text(
    valueAt(game, "league", "name"),
    text(valueAt(game, "league_name"), text(valueAt(game, "competition", "name"), "Live event"))
  );
  const country = text(valueAt(game, "country", "name"), text(valueAt(game, "country_name"), text(valueAt(game, "country"), "")));
  const date = text(valueAt(game, "date"), text(valueAt(game, "event_date"), text(valueAt(game, "timestamp"), "")));
  const volleyballScore = [
    text(valueAt(game, "event_final_result")),
    text(valueAt(game, "event_set_score")),
  ].filter(Boolean).join(" · ");
  const score = sport === "volleyball" && volleyballScore
    ? volleyballScore
    : displayScore(homeScore, awayScore);

  const homeLogo = text(valueAt(game, "teams", "home", "logo")) || undefined;
  const awayLogo =
    text(valueAt(game, "teams", "away", "logo")) ||
    text(valueAt(game, "teams", "visitors", "logo")) ||
    undefined;

  return {
    id: text(valueAt(game, "id"), text(valueAt(game, "event_key"), text(valueAt(game, "race", "id"), `${sport}-${index}`))),
    sport,
    source: "api-sports",
    competition: country ? `${league} · ${country}` : league,
    participants: away ? [home, away] : [home],
    logos: away ? [homeLogo, awayLogo] : [homeLogo],
    score,
    status,
    location: text(valueAt(game, "circuit", "name"), text(valueAt(game, "venue", "name"), text(valueAt(game, "event_stadium"), ""))) || undefined,
    date: date || undefined,
  };
}

function isLiveGame(sport: LiveSport, value: unknown): boolean {
  if (sport === "nba") {
    // API-NBA statuses are numeric: 2 means in play.
    const short = text(valueAt(value, "status", "short"));
    const long = text(valueAt(value, "status", "long")).trim().toLowerCase();
    return short === "2" || long === "in play" || long === "halftime" || long === "live";
  }
  const eventLive = text(valueAt(value, "event_live"));
  if (eventLive) return eventLive === "1";
  const status = text(
    valueAt(value, "status", "short") ?? valueAt(value, "status", "long") ??
      valueAt(value, "event_status") ?? valueAt(value, "status"),
    ""
  ).trim().toLowerCase();
  if (sport === "volleyball") return /^set\s*[1-5]\b/.test(status) || status === "live";
  return [
    "live", "in progress", "ongoing", "1h", "2h", "ht", "et", "bt", "q1", "q2",
    "q3", "q4", "1q", "2q", "3q", "4q", "ot", "first half", "second half",
    "quarter 1", "quarter 2", "quarter 3", "quarter 4", "1st quarter", "2nd quarter",
    "3rd quarter", "4th quarter", "in play",
  ].includes(status);
}

function isCompletedVolleyballGame(value: unknown): boolean {
  if (text(valueAt(value, "event_live")) === "1") return false;
  const status = text(
    valueAt(value, "status", "short") ?? valueAt(value, "status", "long") ??
      valueAt(value, "event_status") ?? valueAt(value, "status"),
    ""
  ).trim().toLowerCase();
  return ["ft", "finished", "match finished", "final", "ended", "completed"].includes(status);
}

function errorMessage(data: JsonRecord, apiKey: string): string | undefined {
  const errors = data.errors;
  if (!errors || (Array.isArray(errors) && errors.length === 0) ||
      (typeof errors === "object" && !Array.isArray(errors) && Object.keys(errors).length === 0)) {
    return undefined;
  }
  const details = Array.isArray(errors)
    ? errors
    : typeof errors === "object"
      ? Object.values(errors)
      : [errors];
  const message = details.map((detail) => text(detail)).filter(Boolean).join("; ");
  return message.replaceAll(apiKey, "[redacted]").slice(0, 200) ||
    "The sports data provider rejected this request.";
}

type PlayerStatRow = { name: string; starter: boolean; stats: string[] };
type PlayerStatGroup = { title: string; labels: string[]; players: PlayerStatRow[] };
type PlayerStatTeam = { team: string; groups: PlayerStatGroup[] };

// Per-game player statistics, normalised to the box-score shape the detail
// modal already renders for ESPN games. API-Basketball and API-NBA expose a
// companion endpoint; API-NFL uses the same `/games/statistics/players` route.
// Baseball, volleyball and handball do not publish player-level box scores, so
// they simply return no section instead of failing the whole detail request.
const PLAYER_STATS_ENDPOINT: Partial<Record<LiveSport, { path: string; param: string }>> = {
  basketball: { path: "/games/statistics/players", param: "id" },
  nba: { path: "/players/statistics", param: "game" },
  nfl: { path: "/games/statistics/players", param: "id" },
};

function recordArray(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function teamNamesById(game: JsonRecord): Map<string, string> {
  const teams = record(game.teams);
  const names = new Map<string, string>();
  for (const side of ["home", "away", "visitors"]) {
    const team = record(teams[side]);
    const id = text(team.id);
    const name = text(team.name);
    if (id && name && !names.has(id)) names.set(id, name);
  }
  return names;
}

function basketballPlayerBoxScores(rows: JsonRecord[], game: JsonRecord): PlayerStatTeam[] {
  const names = teamNamesById(game);
  const labels = ["MIN", "PTS", "REB", "AST", "FG", "3PT", "FT"];
  const order: string[] = [];
  const buckets = new Map<string, { starters: PlayerStatRow[]; bench: PlayerStatRow[] }>();
  const shotLine = (row: JsonRecord, group: string) =>
    `${text(valueAt(row, group, "total"), "0")}/${text(valueAt(row, group, "attempts"), "0")}`;

  for (const row of rows) {
    const name = text(valueAt(row, "player", "name"));
    if (!name) continue;
    const team = text(valueAt(row, "team", "name")) || names.get(text(valueAt(row, "team", "id"))) || "Team";
    if (!buckets.has(team)) {
      buckets.set(team, { starters: [], bench: [] });
      order.push(team);
    }
    const starter = text(row.type) === "starters";
    const bucket = buckets.get(team)!;
    (starter ? bucket.starters : bucket.bench).push({
      name,
      starter,
      stats: [
        text(row.minutes, "-"),
        text(row.points, "0"),
        text(valueAt(row, "rebounds", "total"), "0"),
        text(row.assists, "0"),
        shotLine(row, "field_goals"),
        shotLine(row, "threepoint_goals"),
        shotLine(row, "freethrows_goals"),
      ],
    });
  }

  const minutesOf = (player: PlayerStatRow) => {
    const [minutes, seconds] = (player.stats[0] || "0").split(":").map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  return order.map((team) => {
    const bucket = buckets.get(team)!;
    const groups: PlayerStatGroup[] = [];
    for (const [title, players] of [["Starters", bucket.starters], ["Bench", bucket.bench]] as const) {
      if (players.length === 0) continue;
      groups.push({
        title,
        labels,
        players: [...players].sort((first, second) => minutesOf(second) - minutesOf(first)),
      });
    }
    return { team, groups };
  }).filter((entry) => entry.groups.length > 0);
}

function nbaPlayerBoxScores(rows: JsonRecord[]): PlayerStatTeam[] {
  const labels = ["MIN", "PTS", "REB", "AST", "STL", "BLK", "TO", "PF", "+/-"];
  const order: string[] = [];
  const buckets = new Map<string, PlayerStatRow[]>();

  for (const row of rows) {
    const player = record(row.player);
    const name = text(player.name) || [text(player.firstname), text(player.lastname)].filter(Boolean).join(" ");
    if (!name) continue;
    const team = text(valueAt(row, "team", "name")) || "Team";
    if (!buckets.has(team)) {
      buckets.set(team, []);
      order.push(team);
    }
    buckets.get(team)!.push({
      // The NBA feed does not flag starters; the position column already says
      // who plays where, so leave the badge off rather than guess.
      name,
      starter: false,
      stats: [
        text(row.min, "-"),
        text(row.points, "0"),
        text(row.totReb, "0"),
        text(row.assists, "0"),
        text(row.steals, "0"),
        text(row.blocks, "0"),
        text(row.turnovers, "0"),
        text(row.pFouls, "0"),
        text(row.plusMinus, "-"),
      ],
    });
  }

  return order.map((team) => ({
    team,
    groups: [{
      title: "Box score",
      labels,
      players: [...buckets.get(team)!].sort(
        (first, second) => (Number(second.stats[0]) || 0) - (Number(first.stats[0]) || 0)
      ),
    }],
  }));
}

const NFL_STAT_LABELS: Record<string, string> = {
  "passing.yards": "PASS YDS",
  "passing.touchdowns": "PASS TD",
  "passing.interceptions": "INT",
  "passing.completions": "CMP",
  "passing.attempts": "ATT",
  "rushing.yards": "RUSH YDS",
  "rushing.touchdowns": "RUSH TD",
  "receiving.receptions": "REC",
  "receiving.yards": "REC YDS",
  "receiving.touchdowns": "REC TD",
  "defense.tackles": "TKL",
  "defense.sacks": "SACK",
  "defense.interceptions": "INT",
  "kicking.field_goals": "FG",
  "kicking.extra_points": "XP",
  tackles: "TKL",
  sacks: "SACK",
  interceptions: "INT",
};

function statLabel(key: string): string {
  return NFL_STAT_LABELS[key] || key
    .split(".")
    .pop()!
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toUpperCase()
    .slice(0, 12);
}

function flattenPlayerStats(value: unknown, prefix = "", out = new Map<string, string>()): Map<string, string> {
  for (const [key, entry] of Object.entries(record(value))) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (entry !== null && typeof entry === "object" && !Array.isArray(entry)) {
      flattenPlayerStats(entry, path, out);
    } else if (typeof entry === "string" || typeof entry === "number") {
      out.set(path, text(entry));
    }
  }
  return out;
}

// API-NFL's player-stat payload has changed shape between releases, so accept
// both a flat stat object and a `statistics: [{ name, value }]` list.
function nflPlayerBoxScores(rows: JsonRecord[], game: JsonRecord): PlayerStatTeam[] {
  const names = teamNamesById(game);
  const order: string[] = [];
  const buckets = new Map<string, Map<string, { name: string; values: Map<string, string> }>>();

  for (const row of rows) {
    const name = text(valueAt(row, "player", "name"));
    if (!name) continue;
    const team = text(valueAt(row, "team", "name")) || names.get(text(valueAt(row, "team", "id"))) || "Team";
    const namedStats = recordArray(row.statistics)
      .map((entry) => ({
        key: text(entry.name),
        value: text(entry.value),
      }))
      .filter((entry) => entry.key && entry.value);
    const values = namedStats.length > 0
      ? new Map(namedStats.map((entry) => [entry.key.toLowerCase(), entry.value]))
      : flattenPlayerStats(row);
    for (const key of [...values.keys()]) {
      if (/^(player|team|game|group|position|pos|statistics)\b/.test(key)) values.delete(key);
    }

    if (values.size === 0) continue;
    if (!buckets.has(team)) {
      buckets.set(team, new Map());
      order.push(team);
    }
    buckets.get(team)!.set(name, { name, values });
  }

  return order.map((team) => {
    const players = [...buckets.get(team)!.values()];
    const keys: string[] = [];
    for (const player of players) {
      for (const key of player.values.keys()) if (!keys.includes(key)) keys.push(key);
    }
    return {
      team,
      groups: [{
        title: "Box score",
        labels: keys.map(statLabel),
        players: players.map((player) => ({
          name: player.name,
          starter: false,
          stats: keys.map((key) => player.values.get(key) ?? "-"),
        })),
      }],
    };
  }).filter((entry) => entry.groups[0].players.length > 0);
}

function playerBoxScores(sport: LiveSport, rows: JsonRecord[], game: JsonRecord): PlayerStatTeam[] {
  if (sport === "basketball") return basketballPlayerBoxScores(rows, game);
  if (sport === "nba") return nbaPlayerBoxScores(rows);
  if (sport === "nfl") return nflPlayerBoxScores(rows, game);
  return [];
}

async function fetchPlayerStats(sport: LiveSport, apiKey: string, id: string): Promise<JsonRecord[]> {
  const endpoint = PLAYER_STATS_ENDPOINT[sport];
  const config = API_SPORTS_CONFIG[sport];
  if (!endpoint || !config) return [];
  try {
    const url = new URL(`${config.host}${endpoint.path}`);
    url.searchParams.set(endpoint.param, id);
    const response = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const data = record(await response.json());
    const message = errorMessage(data, apiKey);
    if (!response.ok || message) {
      console.warn(`${sport} player statistics unavailable:`, message || `HTTP ${response.status}`);
      return [];
    }
    return recordArray(data.response);
  } catch (error) {
    console.warn(`${sport} player statistics unavailable:`, error instanceof Error ? error.message : error);
    return [];
  }
}

async function getApiSportsFeed(
  sport: LiveSport,
  config: NonNullable<typeof API_SPORTS_CONFIG[LiveSport]>,
  requestDate?: Date,
  includeCompleted = false
): Promise<LiveSportFeed> {
  const apiKey = apiSportsKey(config.keyName);
  if (!apiKey) {
    return { sport, status: "unconfigured", events: [], message: "Add the shared API-Sports key to the server environment." };
  }

  try {
    const url = new URL(`${config.host}${config.path}`);
    if (config.dateParam) url.searchParams.set("date", dateInAccra(requestDate));
    const response = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    const data = record(await response.json());
    const message = errorMessage(data, apiKey);
    if (!response.ok || message) {
      console.warn(`${sport} live data provider returned HTTP ${response.status}${message ? `: ${message}` : ""}`);
      return {
        sport,
        status: "error",
        events: [],
        message: message || `The ${sport} provider returned HTTP ${response.status}.`,
      };
    }

    const hasApiSportsResponse = Array.isArray(data.response);
    const hasVolleyballLegacyResponse =
      sport === "volleyball" && Number(data.success) === 1 && Array.isArray(data.result);
    if (!hasApiSportsResponse && !hasVolleyballLegacyResponse) {
      return {
        sport,
        status: "error",
        events: [],
        message: `The ${sport} provider returned an unexpected response format.`,
      };
    }

    let responseItems: unknown[] = [];
    if (Array.isArray(data.response)) responseItems = data.response;
    else if (hasVolleyballLegacyResponse && Array.isArray(data.result)) responseItems = data.result;
    const liveItems = responseItems.filter((item) =>
      includeCompleted
        ? sport === "volleyball" && isCompletedVolleyballGame(item)
        : isLiveGame(sport, item)
    );
    return {
      sport,
      status: "ready",
      events: liveItems.map((item, index) => apiSportsEvent(sport, item, index)),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "The provider request failed.";
    console.warn(`${sport} live data unavailable:`, message);
    return { sport, status: "error", events: [], message: `Live ${sport} data is temporarily unavailable.` };
  }
}

// Single-game detail for the non-football sports: full status, venue and the
// per-period scores (quarters, sets, innings) each provider game carries.
// The live lists fall back to ESPN when the API-Sports account is suspended,
// so the detail lookup follows the same chain — otherwise every ESPN-sourced
// game id would be sent to a provider that has never heard of it.
async function getSportGameDetail(searchParams: URLSearchParams): Promise<Response> {
  const noStore = { "Cache-Control": "no-store" };
  const sport = searchParams.get("sport") as LiveSport | null;
  const id = searchParams.get("id") || "";
  const source = searchParams.get("source") || "";
  const notFound = (message: string) => Response.json(
    { response: null, status: "not_found", message, updatedAt: null },
    { status: 404, headers: noStore }
  );
  if (!sport || !LIVE_SPORTS.includes(sport) || !/^\d+$/.test(id)) {
    return Response.json({ response: null, status: "invalid_request", updatedAt: null }, { status: 400, headers: noStore });
  }

  if (source === "espn") {
    const detail = await espnSportGameDetail(sport, id);
    return detail
      ? Response.json({ response: detail, status: "ok", updatedAt: new Date().toISOString() }, { headers: noStore })
      : notFound("This game's provider does not publish a per-game detail feed.");
  }

  const config = API_SPORTS_CONFIG[sport];
  if (!config) {
    return Response.json({ response: null, status: "unsupported", updatedAt: null, message: "No live-data provider is configured for this sport." }, { status: 501, headers: noStore });
  }

  const cacheKey = `${sport}:${source || "api-sports"}:${id}`;
  const okDetail = (detail: unknown) => {
    gameDetailCache.set(cacheKey, { response: detail, expiresAt: Date.now() + 45_000 });
    return Response.json({ response: detail, status: "ok", updatedAt: new Date().toISOString() }, { headers: noStore });
  };
  const cached = gameDetailCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json({ response: cached.response, status: "ok", updatedAt: new Date().toISOString() }, { headers: noStore });
  }

  const apiKey = apiSportsKey(config.keyName);
  if (!apiKey) {
    const espnDetail = await espnSportGameDetail(sport, id);
    if (espnDetail) return okDetail(espnDetail);
    return Response.json({ response: null, status: "unconfigured", updatedAt: null }, { status: 503, headers: noStore });
  }

  try {
    const url = new URL(`${config.host}/games`);
    url.searchParams.set("id", id);
    // Fetch the box score alongside the game so opening a match costs one
    // round-trip rather than two. Player stats are optional on every provider.
    const [response, statRows] = await Promise.all([
      fetch(url, {
        headers: { "x-apisports-key": apiKey },
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      }),
      fetchPlayerStats(sport, apiKey, id),
    ]);
    const data = record(await response.json());
    const message = errorMessage(data, apiKey);
    if (!response.ok || message) {
      // A suspended account or exhausted quota should not hide a game ESPN
      // can describe perfectly well.
      const espnDetail = await espnSportGameDetail(sport, id);
      if (espnDetail) return okDetail(espnDetail);
      return Response.json({ response: null, status: "error", message: message || `The ${sport} detail provider returned HTTP ${response.status}.`, updatedAt: null }, { status: 502, headers: noStore });
    }
    const game = Array.isArray(data.response) ? data.response[0] ?? null : null;
    if (!game) {
      const espnDetail = await espnSportGameDetail(sport, id);
      if (espnDetail) return okDetail(espnDetail);
      return notFound("No detailed feed is available for this game.");
    }
    const playerTeams = playerBoxScores(sport, statRows, record(game));
    const detail = playerTeams.length > 0
      ? { ...record(game), playerStats: playerTeams }
      : game;
    return okDetail(detail);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The provider request failed.";
    console.warn(`${sport} game detail unavailable:`, message);
    const espnDetail = await espnSportGameDetail(sport, id);
    if (espnDetail) return okDetail(espnDetail);
    return Response.json({ response: null, status: "error", message: `${sport} match details are temporarily unavailable.`, updatedAt: null }, { status: 502, headers: noStore });
  }
}

async function getVolleyballResults(request: Request): Promise<Response> {
  const refresh = new URL(request.url).searchParams.has("refresh");
  if (!refresh && volleyballResultsCache && volleyballResultsCache.expiresAt > Date.now()) {
    return Response.json(
      { response: volleyballResultsCache.feed.events, status: volleyballResultsCache.feed.status, updatedAt: volleyballResultsCache.updatedAt },
      { headers: VOLLEYBALL_RESULTS_CACHE_HEADERS }
    );
  }

  const config = API_SPORTS_CONFIG.volleyball;
  if (!config) {
    return Response.json(
      { response: [], status: "error", message: "No volleyball results provider is configured.", updatedAt: null },
      { status: 503, headers: VOLLEYBALL_RESULTS_CACHE_HEADERS }
    );
  }

  const dates = Array.from({ length: 7 }, (_, daysAgo) =>
    new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
  );
  const feeds = await Promise.all(dates.map((date) => getApiSportsFeed("volleyball", config, date, true)));
  const failedFeed = feeds.find((feed) => feed.status === "error" || feed.status === "unconfigured");
  if (failedFeed) {
    return Response.json(
      {
        response: [],
        status: failedFeed.status,
        message: failedFeed.message,
        updatedAt: null,
      },
      { status: failedFeed.status === "error" ? 502 : 503, headers: VOLLEYBALL_RESULTS_CACHE_HEADERS }
    );
  }

  const results = feeds
    .flatMap((feed) => feed.events)
    .sort((first, second) => Date.parse(second.date || "") - Date.parse(first.date || ""));

  const response = Response.json(
    { response: results, status: "ok", updatedAt: new Date().toISOString() },
    { headers: VOLLEYBALL_RESULTS_CACHE_HEADERS }
  );
  volleyballResultsCache = {
    feed: { sport: "volleyball", status: "ready", events: results },
    updatedAt: new Date().toISOString(),
    expiresAt: Date.now() + 30 * 60 * 1000,
  };
  return response;
}

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get("view") === "volleyball-results") {
    return getVolleyballResults(request);
  }
  if (new URL(request.url).searchParams.get("view") === "detail") {
    return getSportGameDetail(new URL(request.url).searchParams);
  }

  const feeds = await Promise.all(LIVE_SPORTS.map(async (sport) => {
    if (sport === "football") {
      return {
        sport,
        status: "ready",
        events: [],
        message: "Football live scores are served by /api/matches.",
      } satisfies LiveSportFeed;
    }
    const config = API_SPORTS_CONFIG[sport];
    if (!config) {
      return { sport, status: "unsupported", events: [], message: "No live-data provider is configured for this sport." } satisfies LiveSportFeed;
    }
    const feed = await getApiSportsFeed(sport, config);
    // The shared API-Sports account can be suspended or out of quota; ESPN's
    // keyless feed keeps basketball/NBA, NFL and MLB live until it recovers.
    if ((feed.status === "error" || feed.status === "unconfigured") && espnSupportedSport(sport)) {
      const espnEvents = await espnLiveSportEvents(sport);
      return {
        sport,
        status: "ready",
        events: espnEvents.sort(compareEventsByPriority),
        // An empty slate still reads as "ready" — the fallback proved the
        // provider is reachable, so the paid outage should not surface here.
        message: espnEvents.length
          ? "Live data is being served from the ESPN fallback while the paid provider is unavailable."
          : "No games are live right now.",
      } satisfies LiveSportFeed;
    }
    return feed;
  }));

  const headers = new URL(request.url).searchParams.has("refresh")
    ? { "Cache-Control": "no-store" }
    : CACHE_HEADERS;
  return Response.json({ feeds, updatedAt: new Date().toISOString() }, { headers });
}
