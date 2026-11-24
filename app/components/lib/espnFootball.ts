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
    rsa: "South Africa", egy: "Egypt", ind: "India", col: "Colombia", per: "Peru",
    bol: "Bolivia", uru: "Uruguay", chi: "Chile", par: "Paraguay", ecu: "Ecuador",
    ven: "Venezuela", jpn: "Japan", kor: "South Korea", aus: "Australia",
    uefa: "Europe", fifa: "World",
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
// ESPN event id → league label, so a detail lookup still shows the real
// competition when the summary payload omits its `leagues` block.
const eventLeagueById = new Map<string, { name: string; country: string }>();
// Normalised team pair → ESPN event id, recorded from every scoreboard event
// (live or not). Livescore flags matches in play earlier than ESPN, so the
// live list keeps Livescore's fresher score but borrows ESPN's id for detail.
const eventIdByPair = new Map<string, string>();
// Every indexed event, so a pair whose spelling differs between providers can
// still be matched. Livescore says "Uniao de Leiria" where ESPN says "Uniao
// Leiria", and "Daejeon Citizen" where ESPN says "Daejeon Hana Citizen FC".
const indexedEvents = new Map<string, { id: string; home: string; away: string }>();

function pairKey(home: string, away: string): string {
  const norm = (name: string) => foldTeamName(name).replace(/[^a-z0-9]/g, "");
  return `${norm(home)}|${norm(away)}`;
}

function indexEvent(id: string, home: string, away: string): void {
  eventIdByPair.set(pairKey(home, away), id);
  indexedEvents.set(id, { id, home, away });
}

// ─── Fuzzy team matching ────────────────────────────────────────────────────
//
// Club names drift between providers ("FC", "AFC", "de", "St" vs "Saint"…), so
// exact keys miss fixtures ESPN actually carries. Matching is token-based and
// deliberately conservative: both sides must be fully covered, with at most
// two extra words on one side. Age/sex markers must agree exactly, otherwise
// ESPN's senior Bodo/Glimt side would stand in for a Livescore U19 fixture.

const CLUB_STOPWORDS = new Set([
  "fc", "cf", "afc", "sc", "ac", "as", "ss", "ssc", "cd", "ud", "sv", "fk", "bk",
  "if", "ff", "sk", "nk", "hk", "cs", "ca", "cp", "sl", "club", "calcio", "the",
  // Club designators that differ between providers ("Hertha Berlin" vs
  // "Hertha BSC", "Genk" vs "KRC Genk").
  "bsc", "vfl", "vfb", "tsg", "fsv", "bvb", "ogc", "osc", "losc", "rsc",
  "kaa", "krc", "kv", "tsv", "spvgg", "ssv",
  // Name particles ("Uniao de Leiria" vs "Uniao Leiria").
  "de", "do", "da", "dos", "das", "del", "la", "le", "les", "el",
]);

const NAME_ALIASES: Array<[RegExp, string]> = [
  [/\bgimnasia lp\b/g, "gimnasia la plata"],
  [/\bpsg\b/g, "paris saint germain"],
  [/\bqpr\b/g, "queens park rangers"],
  [/\bwolves\b/g, "wolverhampton wanderers"],
  [/\bgladbach\b/g, "monchengladbach"],
  [/\binter\b/g, "internazionale"],
];

const TOKEN_ALIASES: Record<string, string> = {
  utd: "united",
  st: "saint",
  ath: "athletic",
  intl: "international",
  man: "manchester",
  nottm: "nottingham",
  sheff: "sheffield",
  wed: "wednesday",
  spurs: "tottenham",
  koln: "cologne",
  brom: "bromwich",
};

const LEVEL_MARKERS = /\b(?:u\s?1[5-9]|u\s?2[0-3]|under\s?\d{2}|youth|academy|reserves?|res|b|ii|women|womens|ladies|fem(?:enil)?|primavera)\b/g;

// Letters NFD does not decompose into an ASCII base ("Bodø/Glimt" would
// otherwise tokenise as "bod glimt" and miss ESPN's "Bodo/Glimt").
const SPECIAL_LETTERS: Record<string, string> = {
  "ø": "o", "æ": "ae", "ß": "ss", "ł": "l", "đ": "d", "ð": "d", "þ": "th",
};

function foldTeamName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[øæßłđðþ]/g, (letter) => SPECIAL_LETTERS[letter] ?? letter)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function levelMarkers(name: string): string {
  return Array.from(foldTeamName(name).matchAll(LEVEL_MARKERS), (match) => match[0].replace(/\s+/g, ""))
    .sort()
    .join(",");
}

function teamTokens(name: string): string[] {
  let folded = foldTeamName(name);
  for (const [pattern, replacement] of NAME_ALIASES) folded = folded.replace(pattern, replacement);
  return folded
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .map((token) => TOKEN_ALIASES[token] ?? token)
    .filter((token) => !CLUB_STOPWORDS.has(token));
}

// Small edit distance absorbs spelling drift ("Epitsentr" / "Epicentr") while
// staying far away from genuinely different clubs ("United" / "City").
function editDistance(first: string, second: string): number {
  if (first === second) return 0;
  if (Math.abs(first.length - second.length) > 2) return 3;
  const rows = Array.from({ length: first.length + 1 }, (_, index) => index);
  for (let column = 1; column <= second.length; column += 1) {
    let diagonal = rows[0];
    rows[0] = column;
    for (let row = 1; row <= first.length; row += 1) {
      const above = rows[row];
      rows[row] = Math.min(
        rows[row] + 1,
        rows[row - 1] + 1,
        diagonal + (first[row - 1] === second[column - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return rows[first.length];
}

function tokensMatch(first: string, second: string): boolean {
  if (first === second) return true;
  if (first.length < 5 || second.length < 5) return false;
  return editDistance(first, second) <= 2;
}

/** 0 = different clubs, 1 = same club. */
function teamSimilarity(first: string, second: string): number {
  if (levelMarkers(first) !== levelMarkers(second)) return 0;
  const left = teamTokens(first);
  const right = teamTokens(second);
  if (!left.length || !right.length) return 0;
  const leftCovered = left.filter((token) => right.some((other) => tokensMatch(token, other))).length;
  const rightCovered = right.filter((token) => left.some((other) => tokensMatch(token, other))).length;
  if (!leftCovered || !rightCovered) return 0;
  if (leftCovered === left.length && rightCovered === right.length) return 1;
  // One name is an abbreviated form of the other, e.g. "Daejeon Citizen" vs
  // "Daejeon Hana Citizen FC". Only accept a couple of extra words.
  const extra = Math.max(left.length, right.length) - Math.min(left.length, right.length);
  const covered = leftCovered === left.length || rightCovered === right.length;
  return covered && extra <= 2 ? 0.85 : 0;
}

function pairSimilarity(
  home: string,
  away: string,
  candidateHome: string,
  candidateAway: string,
): number {
  const direct = (teamSimilarity(home, candidateHome) + teamSimilarity(away, candidateAway)) / 2;
  const swapped = (teamSimilarity(home, candidateAway) + teamSimilarity(away, candidateHome)) / 2;
  return Math.max(direct, swapped);
}

/** ESPN event id for a team pair seen on the current scoreboards, if any. */
export function espnEventIdForTeams(home: string, away: string): string | null {
  if (!home || !away) return null;
  const exact = eventIdByPair.get(pairKey(home, away))
    ?? eventIdByPair.get(pairKey(away, home));
  if (exact) return exact;

  let best: { id: string; score: number } | null = null;
  let runnerUp = 0;
  for (const candidate of indexedEvents.values()) {
    const score = pairSimilarity(home, away, candidate.home, candidate.away);
    if (!best || score > best.score) {
      runnerUp = best?.score ?? 0;
      best = { id: candidate.id, score };
    } else if (score > runnerUp) {
      runnerUp = score;
    }
  }
  if (!best || best.score < 0.8) return null;
  // Two equally plausible fixtures means the pair is not distinctive enough.
  if (runnerUp >= best.score - 0.05) return null;
  return best.id;
}

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

// ESPN's "all" scoreboard covers one date across every soccer league it
// carries. It is the cheapest way to learn the ESPN id of a Livescore fixture
// from outside the priority slug list, so that fixture can borrow ESPN's
// detail feed (scorers, cards, line-ups, team stats).
const allDayCache = new Map<string, Cache<JsonRecord[]>>();
const ALL_DAY_TTL_MS = 20 * 60 * 1000;

async function allScoreboardDay(compactDate: string): Promise<JsonRecord[]> {
  const cached = allDayCache.get(compactDate);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  const board = await scoreboard("all", compactDate);
  const events = board?.events ?? [];
  for (const event of events) {
    const id = text(event.id);
    if (!id) continue;
    const competition = record(records(event.competitions)[0]);
    const home = competitorSide(competition, "home");
    const away = competitorSide(competition, "away");
    if (home.name && away.name) {
      indexEvent(id, text(home.name), text(away.name));
    }
  }
  allDayCache.set(compactDate, { value: events, expiresAt: Date.now() + ALL_DAY_TTL_MS });
  return events;
}

/** Index today's and yesterday's ESPN "all" scoreboards by team pair. */
export async function espnWarmTeamIndex(): Promise<void> {
  const now = Date.now();
  const days = [0, -1].map((offset) =>
    accraDateCompact(new Date(now + offset * 24 * 60 * 60 * 1000)));
  await Promise.all(days.map((day) => allScoreboardDay(day))).catch((error) => {
    console.warn("ESPN all-scoreboard index failed:", error instanceof Error ? error.message : error);
  });
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
    // Soccer scoreboards often only carry the crest array, not `logo`.
    logo: text(team.logo) || text(record(records(team.logos)[0]).href) || undefined,
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
  const id = text(event.id);
  const home = competitorSide(competition, "home");
  const away = competitorSide(competition, "away");
  eventSlugById.set(id, text(league.slug) || slug);
  if (id) eventLeagueById.set(id, { name: text(league.name, "Football"), country });
  if (id && home.name && away.name) {
    eventIdByPair.set(pairKey(text(home.name), text(away.name)), id);
  }
  return {
    provider: "espn",
    fixture: {
      id: Number(id) || 0,
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
    teams: { home, away },
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

// ESPN soccer summary type slugs → the event vocabulary the UI renders.
function keyEventType(type: JsonRecord): string {
  const slug = text(type.type).toLowerCase();
  const label = text(type.text).toLowerCase();
  if (slug === "substitution" || label.includes("substitution")) return "subst";
  if (slug === "var" || label.includes("var")) return "Var";
  if (slug.includes("yellowred") || (label.includes("yellow") && label.includes("red"))) return "Card";
  if (slug.includes("yellow") || slug.includes("red") || label.includes("card")) return "Card";
  if (slug === "penalty-missed" || slug.includes("missed")) return "Goal";
  if (slug.includes("goal") || label.includes("goal")) return "Goal";
  return text(type.text, "Event");
}

// ESPN camelCase statistic names → the labels shown in the stats table.
function statLabel(name: string): string {
  const known: Record<string, string> = {
    foulsCommitted: "Fouls",
    yellowCards: "Yellow cards",
    redCards: "Red cards",
    offsides: "Offsides",
    wonCorners: "Corners",
    saves: "Saves",
    possessionPct: "Possession %",
    totalShots: "Shots",
    shotsOnTarget: "Shots on target",
    accuratePasses: "Accurate passes",
    totalPasses: "Passes",
    passPct: "Pass %",
    totalTackles: "Tackles",
    interceptions: "Interceptions",
    effectiveClearance: "Clearances",
    blockedShots: "Blocked shots",
    accurateCrosses: "Accurate crosses",
    crossPct: "Cross %",
  };
  if (known[name]) return known[name];
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

async function fetchSummary(slug: string, eventId: string): Promise<JsonRecord | null> {
  try {
    const response = await fetch(`${SITE_API}/${slug}/summary?event=${eventId}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store",
    });
    if (!response.ok) return null;
    const body = record(await response.json().catch(() => null));
    return Object.keys(body).length > 0 ? body : null;
  } catch (error) {
    console.warn(`ESPN summary (${slug}/event ${eventId}) failed:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/** Best-effort fixture detail for an ESPN event id, or null when unknown. */
export async function espnFixtureDetail(detailId: string): Promise<JsonRecord | null> {
  if (!/^\d+$/.test(detailId)) return null;
  const cached = detailCache.get(detailId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  // The "all" summary resolves every competition ESPN carries, so a detail
  // request no longer depends on the league slug (or on state left behind by
  // the list request on the same serverless instance).
  const knownSlug = eventSlugById.get(detailId);
  const body = await fetchSummary("all", detailId)
    ?? (knownSlug ? await fetchSummary(knownSlug, detailId) : null);
  if (!body) return null;

  const header = record(body.header);
  const competition = record(records(header.competitions)[0]);
  if (records(competition.competitors).length === 0) return null;
  const status = statusShape(competition.status ? record(competition.status) : record(header.status));
  const gameInfo = record(body.gameInfo);
  const venue = record(gameInfo.venue);
  const boardLeague = record(records(body.leagues)[0]);
  const headerLeague = record(header.league);
  const knownLeague = eventLeagueById.get(detailId);
  const leagueSlug = text(headerLeague.slug) || knownSlug || "";
  const leagueName = text(headerLeague.name) || text(boardLeague.name) || knownLeague?.name || "Football";
  const leagueCountry = countryForSlug(leagueSlug) || knownLeague?.country || "";

  const events = records(body.keyEvents).map((event) => {
    const type = record(event.type);
    const clock = record(event.clock);
    const kind = keyEventType(type);
    // Soccer summaries name the people in `participants` (scorer + assist,
    // player booked, on + off for a substitution); `athletesInvolved` is the
    // shape used by a few other summaries.
    const people = records(event.participants)
      .map((participant) => text(record(record(participant).athlete).displayName))
      .filter(Boolean);
    const involved = records(event.athletesInvolved)
      .map((athlete) => text(record(athlete).displayName))
      .filter(Boolean);
    const names = people.length > 0 ? people : involved;
    return {
      time: { elapsed: parseInt(text(clock.displayValue), 10) || null, extra: null },
      type: kind,
      detail: kind === "subst" ? "" : text(type.text) || text(event.text),
      player: { name: names[0] || undefined },
      assist: { name: names[1] || undefined },
      team: { name: text(record(event.team).displayName) || undefined, logo: undefined },
    };
  });

  // Line-ups: shirt numbers, positions, starters and substitution flags. ESPN
  // carries these even for leagues where it has no per-player statistics.
  const lineups = records(body.rosters).map((entry) => {
    const players = records(entry.roster).map((player, index) => ({
      name: text(record(player.athlete).displayName, "Unknown"),
      jersey: text(player.jersey) || undefined,
      position: text(record(player.position).abbreviation) || undefined,
      starter: Boolean(player.starter),
      subbedIn: Boolean(player.subbedIn),
      subbedOut: Boolean(player.subbedOut),
      order: Number(text(player.formationPlace)) || index + 1,
    })).sort((first, second) =>
      Number(second.starter) - Number(first.starter) || first.order - second.order);
    return {
      team: text(record(entry.team).displayName),
      homeAway: text(entry.homeAway),
      formation: text(entry.formation) || undefined,
      players,
    };
  }).filter((lineup) => lineup.players.length > 0);

  // Player box scores: ESPN carries per-player goals, assists, cards, fouls,
  // shots and saves for most competitions. Emit them in the same "box score"
  // shape the client already renders for basketball/NBA/NFL, so football gets
  // the same per-player table without a second normalisation pass.
  const PLAYER_STAT_COLUMNS: Array<[string, string]> = [
    ["totalGoals", "G"],
    ["goalAssists", "A"],
    ["yellowCards", "YC"],
    ["redCards", "RC"],
    ["foulsCommitted", "Fouls"],
    ["foulsSuffered", "Fouls won"],
    ["totalShots", "Shots"],
    ["shotsOnTarget", "On target"],
    ["saves", "Saves"],
    ["offsides", "Offsides"],
  ];
  const playerStat = (player: JsonRecord, name: string): string => {
    const stat = records(player.stats).find((entry) => text(entry.name) === name);
    return stat ? text(stat.displayValue) || text(stat.value) : "";
  };
  const playerStats = records(body.rosters).flatMap((entry) => {
    const roster = records(entry.roster);
    if (!roster.some((player) => records(player.stats).length > 0)) return [];
    const players = roster
      .filter((player) =>
        Boolean(player.starter) ||
        Boolean(player.subbedIn) ||
        Number(playerStat(player, "appearances")) > 0)
      .map((player) => ({
        name: text(record(player.athlete).displayName, "Unknown"),
        starter: Boolean(player.starter),
        stats: PLAYER_STAT_COLUMNS.map(([key]) => playerStat(player, key) || "-"),
      }))
      .sort((first, second) => Number(second.starter) - Number(first.starter));
    if (players.length === 0) return [];
    return [{
      team: text(record(entry.team).displayName),
      groups: [{
        title: "Matchday squad",
        labels: PLAYER_STAT_COLUMNS.map(([, label]) => label),
        players,
      }],
    }];
  }).filter((group) => group.team);

  // Team statistics: fouls, cards, possession, shots, corners… (coverage
  // varies by competition; the big leagues carry the full set).
  const statistics = records(record(body.boxscore).teams).map((entry) => ({
    team: { name: text(record(entry.team).displayName) },
    statistics: records(entry.statistics).map((stat) => ({
      type: statLabel(text(stat.name)),
      value: text(stat.displayValue) || text(stat.value),
    })),
  })).filter((group) => group.statistics.length > 0);

  const fixture: JsonRecord = {
    provider: "espn",
    fixture: {
      id: Number(detailId),
      date: text(competition.date) || text(header.date),
      status,
      venue: text(venue.fullName)
        ? { name: text(venue.fullName), city: text(record(venue.address).city) || null }
        : undefined,
    },
    league: {
      id: Number(text(headerLeague.id)) || Number(text(boardLeague.id)) || 0,
      name: leagueName,
      country: leagueCountry,
      logo: text(record(records(headerLeague.logos)[0]).href)
        || text(record(records(boardLeague.logos)[0]).href)
        || undefined,
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
    statistics,
    lineups,
    playerStats,
  };
  detailCache.set(detailId, { value: fixture, expiresAt: Date.now() + 45_000 });
  return fixture;
}
