// Livescore.com football provider for /api/matches — the live-slate fallback.
//
// ESPN's soccer scoreboard is excellent for fixtures/results but flips its
// in-play state late (matches stayed "pre" ten minutes past kickoff), so the
// live view needs a source that reports in-play games immediately. Livescore's
// public date API needs no key and covers every league from the Premier League
// to CAF qualifiers, and it flags in-play games within seconds.
//
// Fixtures/results keep using ESPN (see espnFootball.ts); this module serves
// the default (live) view only. Shape notes: stage.Cnm is the competition or
// country, stage.Snm the league/stage, and event.T1/T2 are team *arrays*
// ({Nm, Img…}) in richer leagues but plain strings elsewhere. Eps is the
// status token ("NS", "45'+2'", "HT", "FT", "Postp."…).

import { competitionRank } from "./liveSportsData";

const LS_ROOT = "https://prod-public-api.livescore.com/v1/api/app/date/soccer";
const TIMEOUT_MS = 8000;

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

// Status tokens that mean "not actually in play".
const NOT_LIVE = new Set(["NS", "FT", "PT", "AWD", "WO", "Postp.", "Canc.", "Abd", "PP", "AU"]);

function statusShape(eps: string): { elapsed: number | null; short: string; long: string } {
  const upper = eps.trim();
  const minute = parseInt(upper, 10);
  if (/^\d/.test(upper) && Number.isFinite(minute)) {
    return { elapsed: minute, short: "LIVE", long: upper };
  }
  switch (upper) {
    case "NS": return { elapsed: null, short: "NS", long: "Not started" };
    case "HT": return { elapsed: null, short: "HT", long: "Halftime" };
    case "FT": return { elapsed: null, short: "FT", long: "Match finished" };
    case "AP":
    case "PEN": return { elapsed: null, short: "PEN", long: "Penalties" };
    case "PT":
    case "Postp.": return { elapsed: null, short: "PST", long: "Postponed" };
    case "Canc.": return { elapsed: null, short: "CANC", long: "Cancelled" };
    case "Abd": return { elapsed: null, short: "ABD", long: "Abandoned" };
    case "AWD": return { elapsed: null, short: "FT", long: "Awarded" };
    case "WO": return { elapsed: null, short: "WO", long: "Walkover" };
    default: return { elapsed: null, short: "LIVE", long: upper || "In play" };
  }
}

// Common Livescore country names (stage.Cnm when the stage is domestic).
const COUNTRY_NAMES = new Set([
  "England", "Spain", "Italy", "Germany", "France", "Netherlands", "Portugal",
  "Turkey", "Türkiye", "Scotland", "Wales", "Ireland", "Belgium", "Switzerland",
  "Austria", "Denmark", "Sweden", "Norway", "Finland", "Greece", "Croatia",
  "Serbia", "Romania", "Czechia", "Hungary", "Poland", "Ukraine", "Russia",
  "Israel", "Slovakia", "Slovenia", "Bulgaria", "USA", "Mexico", "Brazil",
  "Argentina", "Chile", "Colombia", "Peru", "Ecuador", "Uruguay", "Paraguay",
  "Bolivia", "Venezuela", "Costa Rica", "Honduras", "Guatemala", "Jamaica",
  "Saudi Arabia", "Qatar", "UAE", "Iran", "Iraq", "Japan", "South Korea",
  "China", "Australia", "India", "Indonesia", "Thailand", "Vietnam",
  "Morocco", "Egypt", "South Africa", "Nigeria", "Ghana", "Senegal",
  "Ivory Coast", "Algeria", "Tunisia", "Cameroon", "Kenya", "Tanzania",
  "Uganda", "Zambia", "Zimbabwe", "Angola", "Mozambique", "Ethiopia",
]);

function labelFor(stage: JsonRecord): { name: string; country: string } {
  const competition = text(stage.Cnm, "Football");
  const stageName = text(stage.Snm);
  if (COUNTRY_NAMES.has(competition)) {
    // Domestic: "England" + "Premier League" → "Premier League · England",
    // which lines up with the serious-first priority list.
    return { name: stageName || competition, country: competition };
  }
  return { name: competition, country: "" };
}

function accraCompact(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Accra", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date).replaceAll("-", "");
}

function isoFromEsd(esd: string): string {
  // Esd is YYYYMMDDHHMMSS in UTC.
  const match = esd.match(/^(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?/);
  if (!match) return "";
  const [, y, m, d, hh = "00", mm = "00", ss = "00"] = match;
  return `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
}

function teamSide(value: unknown, fallback: string): { name: string; logo?: string } {
  if (Array.isArray(value)) {
    const team = record(value[0]);
    const image = text(team.Img);
    return {
      name: text(team.Nm, fallback),
      logo: image ? `https://lsm-static-prod.livescore.com/medium/${image}` : undefined,
    };
  }
  return { name: text(value, fallback) };
}

function toApiFootballFixture(stage: JsonRecord, event: JsonRecord): JsonRecord {
  const status = statusShape(text(event.Eps, "NS"));
  const { name, country } = labelFor(stage);
  const home = teamSide(event.T1, "Home");
  const away = teamSide(event.T2, "Away");
  const score = (value: unknown): number | null => {
    const parsed = Number(text(value));
    return Number.isFinite(parsed) ? parsed : null;
  };
  return {
    fixture: {
      // Livescore ids are not provider lookups; prefix so they can never be
      // confused with API-Sports/Sportmonks ids in the detail route.
      id: Number(`9${text(event.Eid)}`) || 0,
      date: isoFromEsd(text(event.Esd)),
      status,
      venue: undefined,
    },
    league: { id: Number(text(stage.CompId)) || 0, name, country, logo: undefined },
    teams: {
      home: { id: Number(text(record(Array.isArray(event.T1) ? record(event.T1[0]) : {}).ID)) || 0, name: home.name, logo: home.logo, winner: null },
      away: { id: Number(text(record(Array.isArray(event.T2) ? record(event.T2[0]) : {}).ID)) || 0, name: away.name, logo: away.logo, winner: null },
    },
    goals: { home: score(event.Tr1), away: score(event.Tr2) },
    score: {
      halftime: { home: score(event.Trh1), away: score(event.Trh2) },
      fulltime: { home: null, away: null },
    },
  };
}

async function dayPage(compactDate: string): Promise<{ stage: JsonRecord; event: JsonRecord }[]> {
  try {
    const response = await fetch(`${LS_ROOT}/${compactDate}/0?MD=1`, {
      signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store",
    });
    if (!response.ok) return [];
    const body = record(await response.json().catch(() => null));
    const pairs: { stage: JsonRecord; event: JsonRecord }[] = [];
    for (const stage of records(body.Stages)) {
      for (const event of records(record(stage).Events)) {
        pairs.push({ stage: record(stage), event });
      }
    }
    return pairs;
  } catch (error) {
    console.warn(`Livescore day (${compactDate}) failed:`, error instanceof Error ? error.message : error);
    return [];
  }
}

let liveCache: Cache<JsonRecord[]> | null = null;
type Cache<T> = { expiresAt: number; value: T };

/** In-play football matches from the past two Accra days, serious-first. */
export async function lsLiveMatches(): Promise<JsonRecord[]> {
  if (liveCache && liveCache.expiresAt > Date.now()) return liveCache.value;
  // Yesterday is included so matches running past midnight UTC stay live.
  const days = [accraCompact(new Date(Date.now() - 24 * 60 * 60 * 1000)), accraCompact(new Date())];
  const pages = await Promise.all(days.map((day) => dayPage(day)));
  const seen = new Set<string>();
  const live: JsonRecord[] = [];
  for (const { stage, event } of pages.flat()) {
    const eps = text(event.Eps, "NS");
    if (NOT_LIVE.has(eps) || eps === "NS" || eps === "FT") continue;
    const id = text(event.Eid);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    live.push(toApiFootballFixture(stage, event));
  }
  const value = live.sort((first, second) => {
    const label = (fixture: JsonRecord) => {
      const league = record(fixture.league);
      return [text(league.name), text(league.country)].filter(Boolean).join(" · ");
    };
    const rankDiff = competitionRank(label(first)) - competitionRank(label(second));
    if (rankDiff !== 0) return rankDiff;
    return text(record(first.fixture).date).localeCompare(text(record(second.fixture).date));
  });
  liveCache = { value, expiresAt: Date.now() + 45_000 };
  return value;
}
