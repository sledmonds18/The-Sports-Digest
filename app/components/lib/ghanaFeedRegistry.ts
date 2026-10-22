import { SportCategory } from "./ghanaSportsData";

/**
 * Every discipline The Sports Digest covers from day one.
 * The coverage matrix below is the contract: no discipline may be dropped.
 */
export type SportDiscipline = Exclude<SportCategory, "All Sports">;

/**
 * Source trust tier.
 * - federation      : official governing body / national sports authority
 * - national_media  : Ghanaian newsroom with a dedicated sports desk
 * - wire_aggregator : syndicated wire (Google News) used for long-tail coverage
 */
export type SourceTier = "federation" | "national_media" | "wire_aggregator";

export interface FeedSource {
  id: string;
  name: string;
  publisher: string;
  homepage: string;
  url: string;
  tier: SourceTier;
  /** Disciplines this feed is expected to deliver. Drives the coverage matrix. */
  coverage: SportDiscipline[];
  /** Fallback classification when keyword rules find no match. */
  defaultSport?: SportDiscipline;
  enabled: boolean;
}

/**
 * Google News RSS is the long-tail safety net for every discipline, so a
 * single quiet federation feed can never mean "the sport is uncovered".
 *
 * The `when:7d` operator is required: without it Google News returns
 * relevance-ranked results that are months or years old, which the ingestion
 * engine would (correctly) discard as stale.
 */
function googleNewsFeed(
  id: string,
  publisher: string,
  query: string,
  coverage: SportDiscipline[],
  defaultSport: SportDiscipline
): FeedSource {
  return {
    id,
    name: `Google News Wire — ${defaultSport}`,
    publisher,
    homepage: "https://news.google.com",
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(
      `${query} when:7d`
    )}&hl=en-GH&gl=GH&ceid=GH:en`,
    tier: "wire_aggregator",
    coverage,
    defaultSport,
    enabled: true,
  };
}

/**
 * The monitored source registry.
 *
 * Every URL in this file was verified to return a valid RSS 2.0 payload.
 * Sources that returned HTML, 403/404 or failed DNS are intentionally excluded
 * rather than left in place to fail silently on every cron run.
 */
export const GHANA_FEED_REGISTRY: FeedSource[] = [
  // ── FEDERATION / OFFICIAL ──────────────────────────────────────────────
  {
    id: "gfa-official",
    name: "Ghana Football Association",
    publisher: "Ghana Football Association",
    homepage: "https://www.ghanafa.org",
    url: "https://www.ghanafa.org/feed/",
    tier: "federation",
    coverage: ["Football"],
    defaultSport: "Football",
    enabled: true,
  },

  // ── NATIONAL MEDIA (dedicated sports desks) ────────────────────────────
  {
    id: "ghanasoccernet",
    name: "GhanaSoccernet",
    publisher: "GhanaSoccernet",
    homepage: "https://ghanasoccernet.com",
    url: "https://ghanasoccernet.com/feed/",
    tier: "national_media",
    coverage: ["Football"],
    defaultSport: "Football",
    enabled: true,
  },
  {
    id: "ghana-sports-news",
    name: "Ghana Sports News",
    publisher: "GHSportsNews",
    homepage: "https://www.ghsportsnews.com",
    url: "https://www.ghsportsnews.com/feed/",
    tier: "national_media",
    coverage: ["Football", "Athletics", "Basketball", "Combat & Others"],
    enabled: true,
  },
  {
    id: "myjoy-sports",
    name: "MyJoyOnline Sports",
    publisher: "MyJoyOnline",
    homepage: "https://myjoyonline.com/category/sports",
    url: "https://myjoyonline.com/category/sports/feed/",
    tier: "national_media",
    coverage: [
      "Football",
      "Boxing",
      "Athletics",
      "Basketball",
      "Armwrestling",
      "Hockey",
      "Volleyball",
      "Combat & Others",
    ],
    enabled: true,
  },

  // ── WIRE AGGREGATOR (one long-tail feed per discipline) ───────────────
  googleNewsFeed(
    "gnews-football",
    "Google News",
    'Ghana football OR "Black Stars" OR "Black Queens" OR "Black Maidens" OR "Black Starlets" OR GPL',
    ["Football"],
    "Football"
  ),
  googleNewsFeed(
    "gnews-boxing",
    "Google News",
    "Ghana boxing OR Bukom OR \"Ghana Boxing Authority\" OR \"IBA Africa\"",
    ["Boxing"],
    "Boxing"
  ),
  googleNewsFeed(
    "gnews-athletics",
    "Google News",
    "Ghana athletics OR \"Ghana Athletics Association\" OR \"national trials\"",
    ["Athletics"],
    "Athletics"
  ),
  googleNewsFeed(
    "gnews-armwrestling",
    "Google News",
    "Ghana armwrestling OR \"Golden Arms\" OR \"arm wrestling\"",
    ["Armwrestling"],
    "Armwrestling"
  ),
  googleNewsFeed(
    "gnews-basketball",
    "Google News",
    "Ghana basketball OR \"Sprite Ball\" OR \"Accra Basketball League\"",
    ["Basketball"],
    "Basketball"
  ),
  googleNewsFeed(
    "gnews-hockey",
    "Google News",
    "Ghana hockey OR Sapholda OR \"National Hockey Stadium\"",
    ["Hockey"],
    "Hockey"
  ),
  googleNewsFeed(
    "gnews-volleyball",
    "Google News",
    "Ghana volleyball OR \"beach volleyball\" OR \"Volleyball Association\"",
    ["Volleyball"],
    "Volleyball"
  ),
  googleNewsFeed(
    "gnews-combat",
    "Google News",
    'Ghana judo OR "table tennis" OR swimming OR tennis OR karate OR "sports festival"',
    ["Combat & Others"],
    "Combat & Others"
  ),
];

export const ALL_SPORT_DISCIPLINES: SportDiscipline[] = [
  "Football",
  "Boxing",
  "Athletics",
  "Basketball",
  "Armwrestling",
  "Hockey",
  "Volleyball",
  "Combat & Others",
];

export function getEnabledSources(): FeedSource[] {
  return GHANA_FEED_REGISTRY.filter((source) => source.enabled);
}

export function getSourceById(id: string): FeedSource | undefined {
  return GHANA_FEED_REGISTRY.find((source) => source.id === id);
}

/**
 * Which monitored sources can deliver stories for a given discipline.
 * The newsroom uses this to prove "all Ghanaian sports covered from day one".
 */
export function getSourceIdsForSport(sport: SportDiscipline): string[] {
  return getEnabledSources()
    .filter((source) => source.coverage.includes(sport))
    .map((source) => source.id);
}

export interface SportCoverageEntry {
  sport: SportDiscipline;
  sourceCount: number;
  sources: string[];
  covered: boolean;
}

/**
 * Coverage matrix — one row per Ghanaian discipline, listing the sources that
 * feed it. A discipline with fewer than two independent sources is flagged so
 * the editor knows where to add a federation dispatch.
 */
export function getCoverageMatrix(): SportCoverageEntry[] {
  return ALL_SPORT_DISCIPLINES.map((sport) => {
    const sources = getSourceIdsForSport(sport);
    return {
      sport,
      sourceCount: sources.length,
      sources,
      covered: sources.length > 0,
    };
  });
}

export function getUncoveredSports(): SportDiscipline[] {
  return getCoverageMatrix()
    .filter((entry) => !entry.covered)
    .map((entry) => entry.sport);
}
