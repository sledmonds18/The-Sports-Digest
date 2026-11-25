// FotMob's public match-details provider for football. Used as the last
// detail fallback when ESPN cannot resolve a match: Azadegan League and other
// lower-tier leagues, plus Livescore fixtures without an ESPN twin.
//
// FotMob's detail payload uses a different shape than our internal one, so
// `fotmobMatchDetail` returns a normalised fixture-style object that the
// existing detail panel renders without changes.

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function records(value: unknown): JsonRecord[] {
  return Array.isArray(value)
    ? value.filter((item): item is JsonRecord =>
        item !== null && typeof item === "object" && !Array.isArray(item)) as JsonRecord[]
    : [];
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

const UA_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Origin: "https://www.fotmob.com",
  Referer: "https://www.fotmob.com/",
};

const SUGGEST_ROOT = "https://apigw.fotmob.com/searchapi/suggest";
const DETAIL_ROOT = "https://www.fotmob.com/api/data/matchDetails";
const TIMEOUT_MS = 10000;
const TTL_MS = 10 * 60_000;

export interface FotmobSuggestion {
  matchId: string;
  home: string;
  away: string;
  league: string;
  country: string;
  matchDate: string;
  statusId: number | null;
}

const suggestCache = new Map<string, { expiresAt: number; value: FotmobSuggestion[] }>();
const detailCache = new Map<string, { expiresAt: number; value: JsonRecord | null }>();

async function safeFetch(url: string): Promise<Response> {
  return fetch(url, { headers: UA_HEADERS, signal: AbortSignal.timeout(TIMEOUT_MS) });
}

/** Best-effort suggestion lookup used to find a match id from a team pair. */
export async function fotmobSuggest(term: string, limit = 5): Promise<FotmobSuggestion[]> {
  const key = term.trim().toLowerCase();
  if (!key) return [];
  const cached = suggestCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const suggestions: FotmobSuggestion[] = [];
  try {
    const response = await safeFetch(`${SUGGEST_ROOT}?term=${encodeURIComponent(term)}&lang=en`);
    if (response.ok) {
      const body = await response.json();
      for (const group of records(body.matchSuggest)) {
        for (const option of records(group.options)) {
          const payload = record(option.payload);
          const matchId = text(payload.id);
          const home = text(payload.homeName) || text(payload.homeTeamName);
          const away = text(payload.awayName) || text(payload.awayTeamName);
          if (!matchId || !home || !away) continue;
          suggestions.push({
            matchId,
            home,
            away,
            league: text(payload.leagueName),
            country: text(payload.countryCode) || text(payload.countryName) || "",
            matchDate: text(payload.matchDate),
            statusId: payload.statusId != null ? Number(payload.statusId) : null,
          });
          if (suggestions.length >= limit) break;
        }
        if (suggestions.length >= limit) break;
      }
    }
  } catch (error) {
    console.warn("FotMob suggest failed:", error instanceof Error ? error.message : error);
  }
  suggestCache.set(key, { expiresAt: Date.now() + TTL_MS, value: suggestions });
  return suggestions;
}

/** First suggestion for a team pair, ignoring case and non-alphanumeric text. */
function normName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function namesSimilar(a: string, b: string): boolean {
  if (!a || !b) return false;
  const left = normName(a);
  const right = normName(b);
  return left === right || left.includes(right) || right.includes(left);
}

function matchesPair(suggestion: FotmobSuggestion, home: string, away: string): boolean {
  return (
    namesSimilar(suggestion.home, home) && namesSimilar(suggestion.away, away)
  ) || (
    namesSimilar(suggestion.home, away) && namesSimilar(suggestion.away, home)
  );
}

/** Resolve a FotMob match id from a team pair, trying FotMob's finicky search. */
export async function fotmobMatchIdForTeams(home: string, away: string): Promise<string | null> {
  if (!home || !away) return null;
  const terms = [`${home} ${away}`, `${away} ${home}`, home, away, `${home} vs ${away}`];
  for (const term of terms) {
    const suggestion = (await fotmobSuggest(term)).find((entry) => matchesPair(entry, home, away));
    if (suggestion) return suggestion.matchId;
  }
  return null;
}

export async function fotmobDetailFromTeams(
  home: string,
  away: string,
): Promise<JsonRecord | null> {
  const matchId = await fotmobMatchIdForTeams(home, away);
  if (!matchId) return null;
  return fotmobMatchDetail(matchId);
}

export async function fotmobMatchDetail(matchId: string): Promise<JsonRecord | null> {
  const cached = detailCache.get(matchId);
  if (cached && cached.expiresAt > Date.now()) return cached.value;
  let value: JsonRecord | null = null;
  try {
    const response = await safeFetch(`${DETAIL_ROOT}?matchId=${encodeURIComponent(matchId)}`);
    if (response.ok) {
      const body = await response.json();
      value = normalizeFotmobDetail(body, matchId);
    }
  } catch (error) {
    console.warn(`FotMob match detail failed (${matchId}):`, error instanceof Error ? error.message : error);
  }
  detailCache.set(matchId, { expiresAt: Date.now() + TTL_MS, value });
  return value;
}

export async function fotmobDetailById(matchId: string): Promise<JsonRecord | null> {
  return fotmobMatchDetail(matchId);
}

function parseTime(value: unknown): { elapsed: number | null; extra: string | null } {
  const str = text(value);
  if (!str) return { elapsed: null, extra: null };
  const parts = str.split("+").map((part) => part.trim()).filter(Boolean);
  const elapsed = Number(parts[0]);
  return {
    elapsed: Number.isFinite(elapsed) ? elapsed : null,
    extra: parts[1] ? `+${parts[1]}` : null,
  };
}

function nameOf(value: unknown): string {
  return text(record(value).name);
}

function toFotmobEvents(events: JsonRecord[], homeName: string, awayName: string, logos: string[]): JsonRecord[] {
  const out: JsonRecord[] = [];
  for (const event of events) {
    const type = text(event.type, "Match event");
    const detail = [
      type === "Goal" ? text(event.goalDescription) : "",
      type === "Card" ? [
        text(record(event.card).type),
        text(event.cardDescription),
        text(event.cardReason),
      ].filter(Boolean).join(" · ") : "",
      type === "Substitution" ? text(event.assistStr) : "",
    ].filter(Boolean).join(" · ");
    const time = parseTime(event.time);
    const playerName = nameOf(event.player);
    const teamName = text(event.isHome ? homeName : awayName);
    out.push({
      time: { elapsed: time.elapsed, extra: time.extra },
      type,
      detail,
      player: playerName ? { name: playerName } : {},
      team: teamName ? { name: teamName, logo: logos[event.isHome ? 0 : 1] || undefined } : {},
    });
  }
  return out;
}

function toFotmobLineups(side: JsonRecord | null | undefined): JsonRecord[] {
  if (!side) return [];
  const starters = records(side.starters).map((player, index) => ({
    name: text(player.name, "Unknown"),
    jersey: text(player.shirtNumber) || undefined,
    starter: true,
    order: text(player.shirtNumber) ? Number(text(player.shirtNumber)) : index + 1,
  }));
  const subs = records(side.subs).map((player) => ({
    name: text(player.name, "Unknown"),
    jersey: text(player.shirtNumber) || undefined,
    starter: false,
    subbedIn: records(record(player.performance).substitutionEvents).some((e) => text(e.type) === "subIn"),
    subbedOut: records(record(player.performance).substitutionEvents).some((e) => text(e.type) === "subOut"),
  }));
  return [{
    team: text(side.name),
    players: [...starters, ...subs],
  }];
}

function toFotmobPlayerStats(value: unknown): JsonRecord[] {
  return records(value).map((group) => ({
    team: text(record(group).teamName) || text(record(group).team) || "Unknown",
    players: records(record(group).players).map((player) => ({
      name: text(player.name, "Unknown"),
      starter: Boolean(player.starter),
      stats: records(player.stats).map((stat) => ({
        [text(stat.name, "")]: text(stat.value) || text(stat.displayValue) || "",
      })),
    })),
  }));
}

function normalizeFotmobDetail(body: unknown, matchId: string): JsonRecord {
  const root = record(body);
  const general = record(root.general);
  const header = record(root.header);
  const content = record(root.content);
  const headerTeams = records(header.teams);
  const homeTeam = headerTeams[0] ?? record(record(general.homeTeam));
  const awayTeam = headerTeams[1] ?? record(record(general.awayTeam));
  const status = record(header.status);
  const facts = record(content.matchFacts);
  const lineup = record(content.lineup);

  const homeName = text(homeTeam.name, "Home");
  const awayName = text(awayTeam.name, "Away");
  const logos = [homeTeam.imageUrl, awayTeam.imageUrl];

  const eventLogos = [text(homeTeam.imageUrl), text(awayTeam.imageUrl)];
  const events = toFotmobEvents(records(record(facts.events).events), homeName, awayName, eventLogos);
  const lineups = [
    ...toFotmobLineups(record(lineup.homeTeam)),
    ...toFotmobLineups(record(lineup.awayTeam)),
  ];

  const reason = record(status.reason);
  const hasReason = Boolean(reason.shortKey || reason.longKey);
  return {
    provider: "fotmob",
    fixture: {
      id: Number(matchId) || 0,
      date: text(general.matchTimeUTCDate),
      status: hasReason
        ? { elapsed: null, short: text(reason.shortKey, "Live"), long: text(reason.longKey, "") }
        : { elapsed: null, short: "LIVE", long: text(status.statusStr) || "In play" },
      venue: undefined,
    },
    league: {
      id: Number(general.leagueId) || 0,
      name: text(general.leagueName),
      country: text(general.countryCode),
      logo: undefined,
    },
    teams: {
      home: { id: Number(homeTeam.id) || 0, name: homeName, logo: logos[0] || undefined, winner: null },
      away: { id: Number(awayTeam.id) || 0, name: awayName, logo: logos[1] || undefined, winner: null },
    },
    goals: { home: Number(homeTeam.score), away: Number(awayTeam.score) },
    events,
    statistics: [],
    lineups,
    playerStats: toFotmobPlayerStats(content.playerStats),
  };
}
