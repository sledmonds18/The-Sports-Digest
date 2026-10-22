import {
  GhanaSportArticle,
  SportCategory,
  DiscoverySourceType,
} from "./ghanaSportsData";
import {
  FeedSource,
  SourceTier,
  SportDiscipline,
  SportCoverageEntry,
  GHANA_FEED_REGISTRY,
  getEnabledSources,
  getCoverageMatrix,
  getUncoveredSports,
} from "./ghanaFeedRegistry";

export type { FeedSource, SourceTier, SportDiscipline } from "./ghanaFeedRegistry";

/** Backwards-compatible alias for the monitored source list. */
export const MONITORED_FEED_SOURCES: FeedSource[] = GHANA_FEED_REGISTRY;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const FEED_TIMEOUT_MS = 10000;
const IMAGE_TIMEOUT_MS = 3500;
const FEED_CONCURRENCY = 4;
const IMAGE_CONCURRENCY = 3;
const MAX_IMAGE_EXTRACTIONS_PER_RUN = 8;
const DEFAULT_MAX_ITEMS_PER_SOURCE = 8;
const DEFAULT_MAX_AGE_HOURS = 96;

const SPORT_DISCIPLINES: SportDiscipline[] = [
  "Football",
  "Boxing",
  "Athletics",
  "Basketball",
  "Armwrestling",
  "Hockey",
  "Volleyball",
  "Combat & Others",
];

/**
 * Keyword rules for automatic sport classification.
 *
 * Rules are evaluated as whole words so short tokens such as "gaf" or "gpl"
 * cannot be triggered by an unrelated word that merely contains them.
 * Order of this object is also the tie-break order: the more specific
 * disciplines win a tie and football acts as the catch-all.
 */
const SPORT_KEYWORD_RULES: Record<SportDiscipline, string[]> = {
  Boxing: [
    "boxing",
    "boxer",
    "boxers",
    "bukom",
    "bout",
    "punch",
    "featherweight",
    "bantamweight",
    "super bantamweight",
    "middleweight",
    "heavyweight",
    "lightweight",
    "wbo",
    "gba",
    "iba africa",
    "azumah",
    "clottey",
    "dogboe",
    "gloves",
    "undercard",
    "knockout",
  ],
  Armwrestling: [
    "armwrestling",
    "arm wrestling",
    "armwrestler",
    "golden arms",
    "puller",
    "pullers",
    "pulling",
    "gaf",
    "asibey",
    "armwrestling federation",
  ],
  Athletics: [
    "athletics",
    "athletic",
    "sprint",
    "sprints",
    "relay",
    "100m",
    "200m",
    "400m",
    "800m",
    "javelin",
    "shot put",
    "hurdle",
    "hurdles",
    "track and field",
    "marathon",
    "long jump",
    "triple jump",
    "high jump",
    "cross country",
    "national trials",
    "gaa",
  ],
  Basketball: [
    "basketball",
    "abl",
    "nba",
    "braves",
    "hoop",
    "hoops",
    "dunk",
    "dribble",
    "sprite ball",
    "reformers",
    "cantonments court",
    "fiba",
  ],
  Hockey: [
    "hockey",
    "sapholda",
    "hockey stick",
    "theodosia okoh",
    "gaha",
    "ex chequers",
    "trustees hockey",
    "hockey club",
  ],
  Volleyball: [
    "volleyball",
    "beach volleyball",
    "gva",
    "spike",
    "cavb",
    "laboma",
    "jump float",
    "setter",
    "blocker",
  ],
  "Combat & Others": [
    "judo",
    "judoka",
    "table tennis",
    "taekwondo",
    "karate",
    "tennis",
    "swimming",
    "rugby",
    "para sports",
    "para-sports",
    "badminton",
    "scuba",
    "cycling",
    "sports festival",
  ],
  Football: [
    "football",
    "soccer",
    "gpl",
    "gfa",
    "ghana fa",
    "black stars",
    "black queens",
    "black maidens",
    "black starlets",
    "black satellites",
    "hearts of oak",
    "kotoko",
    "asante kotoko",
    "samartex",
    "caf",
    "fifa",
    "premier league",
    "ghana football association",
    "dreams fc",
    "nations fc",
    "koranteng",
    "medeama",
    "berekum city",
    "aduana stars",
    "legon cities",
  ],
};

/** Escapes a keyword and anchors it on word boundaries. */
function keywordPattern(keyword: string): RegExp {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i");
}

const COMPILED_RULES = (Object.entries(SPORT_KEYWORD_RULES) as Array<
  [SportDiscipline, string[]]
>).map(([sport, keywords]) => ({
  sport,
  patterns: keywords.map((keyword) => ({
    keyword,
    pattern: keywordPattern(keyword),
  })),
}));

/**
 * Classifies an incoming sports news text into one of the Ghanaian disciplines.
 * Titles weigh three times heavier than body copy so a headline mention wins.
 */
export function classifySportCategory(
  title: string,
  content: string = "",
  defaultSport?: SportDiscipline
): SportDiscipline {
  const headline = (title || "").toLowerCase();
  const body = (content || "").toLowerCase();

  let bestSport: SportDiscipline | null = null;
  let bestScore = 0;

  for (const { sport, patterns } of COMPILED_RULES) {
    let score = 0;
    for (const { pattern } of patterns) {
      if (pattern.test(headline)) score += 3;
      else if (pattern.test(body)) score += 1;
    }

    // A dedicated feed for a discipline is a strong prior: +2 to that sport.
    if (defaultSport && sport === defaultSport) score += 2;

    if (score > bestScore) {
      bestScore = score;
      bestSport = sport;
    }
  }

  if (bestSport && bestScore > 0) return bestSport;
  return defaultSport || "Football";
}

/** Lower-cases, strips publisher suffixes and punctuation for duplicate detection. */
export function normalizeHeadline(title: string): string {
  return (title || "")
    .replace(/\s+[-–—|]\s+[^-–—|]{3,40}$/u, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Removes the trailing " - Publisher" that syndicated feeds append to
 * headlines (Google News does this for every item). Only the known publisher
 * name is stripped, so a legitimate hyphenated headline is never damaged.
 */
export function stripPublisherSuffix(title: string, publisher?: string): string {
  if (!title || !publisher) return title;
  const suffix = new RegExp(
    `\\s+[-–—|]\\s+${publisher.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`,
    "i"
  );
  return title.replace(suffix, "").trim() || title;
}

/** Builds a URL-safe slug from a headline. */
export function slugify(title: string): string {
  const slug = (title || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return slug || "ghana-sports-story";
}

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&#x2019;/g, "'")
    .replace(/&#8211;|&#x2013;/g, "-")
    .replace(/&#8212;|&#x2014;/g, "-")
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)));
}

function stripHtml(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

export interface ParsedFeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image?: string;
  publisher?: string;
}

function firstMatch(block: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match && match[1]) return match[1].trim();
  }
  return undefined;
}

/**
 * Parses raw RSS 2.0 / Atom XML safely without external dependencies.
 * Handles the tags actually used by Ghanaian sports desks plus the Google
 * News wire format (which nests the originating publisher in <source>).
 */
export function parseFeedXml(xmlText: string): ParsedFeedItem[] {
  const items: ParsedFeedItem[] = [];
  const blocks = [
    ...(xmlText.match(/<item[\s\S]*?<\/item>/gi) || []),
    ...(xmlText.match(/<entry[\s\S]*?<\/entry>/gi) || []),
  ];

  for (const raw of blocks) {
    const titleRaw = firstMatch(raw, [
      /<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i,
    ]);
    const linkRaw =
      firstMatch(raw, [/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i]) ||
      firstMatch(raw, [/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i]);

    const descriptionRaw = firstMatch(raw, [
      /<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i,
      /<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i,
      /<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i,
    ]);

    const dateRaw = firstMatch(raw, [
      /<pubDate[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i,
      /<published[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/published>/i,
      /<updated[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/updated>/i,
      /<dc:date[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/dc:date>/i,
    ]);

    const imageRaw = firstMatch(raw, [
      /<media:content[^>]+url=["']([^"']+)["']/i,
      /<media:thumbnail[^>]+url=["']([^"']+)["']/i,
      /<enclosure[^>]+url=["']([^"']+)["']/i,
      /<image[^>]+src=["']([^"']+)["']/i,
      /<content:encoded[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i,
    ]);

    // Google News nests the originating publisher in <source url="...">Name</source>
    const publisherRaw = firstMatch(raw, [
      /<source[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/source>/i,
    ]);

    const title = titleRaw ? stripHtml(titleRaw) : "";
    const link = linkRaw ? decodeEntities(linkRaw) : "";
    const description = descriptionRaw ? stripHtml(descriptionRaw) : "";

    if (!title || title.length < 8) continue;

    items.push({
      title,
      link,
      description,
      pubDate: dateRaw ? decodeEntities(dateRaw) : "",
      image: imageRaw ? decodeEntities(imageRaw) : undefined,
      publisher: publisherRaw ? stripHtml(publisherRaw) : undefined,
    });
  }

  return items;
}

/**
 * Follows an article URL in the background to extract the publication's lead
 * photo (og:image / twitter:image).
 */
export async function extractArticleOgImage(
  articleUrl: string
): Promise<string | undefined> {
  if (!articleUrl || !articleUrl.startsWith("http")) return undefined;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

    const res = await fetch(articleUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return undefined;
    const html = await res.text();

    const ogMatch =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
      ) ||
      html.match(
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
      );

    if (ogMatch && ogMatch[1]) {
      const foundUrl = ogMatch[1].trim();
      if (foundUrl.startsWith("http://") || foundUrl.startsWith("https://")) {
        return foundUrl;
      }
    }
  } catch {
    // Ignore timeout and network errors
  }
  return undefined;
}

export type SourceHealthStatus =
  | "ok"
  | "empty"
  | "http_error"
  | "unreachable"
  | "invalid_feed";

export interface SourceHealthReport {
  id: string;
  name: string;
  publisher: string;
  tier: SourceTier;
  url: string;
  status: SourceHealthStatus;
  httpStatus?: number;
  itemsFound: number;
  itemsFresh: number;
  itemsQueued: number;
  durationMs: number;
  message?: string;
}

export interface IngestionReport {
  success: boolean;
  fetchedAt: string;
  discoveredStories: GhanaSportArticle[];
  sourcesChecked: string[];
  sourceHealth: SourceHealthReport[];
  duplicatesSkipped: number;
  staleSkipped: number;
  coverage: SportCoverageEntry[];
  uncoveredSports: SportDiscipline[];
  durationMs: number;
}

export interface IngestionOptions {
  /** Only ingest from these source ids. Defaults to every enabled source. */
  sources?: FeedSource[];
  /** Ignore items older than this many hours. */
  maxAgeHours?: number;
  /** Maximum items pulled per source. */
  maxItemsPerSource?: number;
  /** Set false to skip og:image scraping (fast, deterministic runs). */
  extractImages?: boolean;
}

/** Runs tasks with a bounded number of parallel workers. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function run(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  const runners = Array.from(
    { length: Math.min(limit, Math.max(items.length, 1)) },
    () => run()
  );
  await Promise.all(runners);
  return results;
}

function resolveMaxAgeHours(explicit?: number): number {
  if (typeof explicit === "number" && explicit > 0) return explicit;
  const fromEnv = Number(process.env.INGEST_MAX_AGE_HOURS);
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv;
  return DEFAULT_MAX_AGE_HOURS;
}

function isFresh(pubDate: string, maxAgeHours: number): boolean {
  if (!pubDate) return true; // Undated items are kept; the editor can reject them.
  const parsed = Date.parse(pubDate);
  if (Number.isNaN(parsed)) return true;
  const ageHours = (Date.now() - parsed) / (1000 * 60 * 60);
  return ageHours <= maxAgeHours;
}

/**
 * Verifies that a single source is reachable and returning a usable feed.
 * Used by the newsroom "Check feeds" button.
 *
 * A source that times out is retried once: Ghanaian newsroom hosts are often
 * slow on their first request and a single timeout is not proof of a dead feed.
 */
export async function checkFeedHealth(
  source: FeedSource
): Promise<SourceHealthReport> {
  const first = await fetchSourceOnce(source);
  if (first.status !== "unreachable") return first;

  const retry = await fetchSourceOnce(source);
  if (retry.status !== "unreachable") {
    return { ...retry, message: `${retry.message ?? "OK"} (succeeded on retry)` };
  }
  return first;
}

async function fetchSourceOnce(
  source: FeedSource
): Promise<SourceHealthReport> {
  const startedAt = Date.now();
  const base: SourceHealthReport = {
    id: source.id,
    name: source.name,
    publisher: source.publisher,
    tier: source.tier,
    url: source.url,
    status: "unreachable",
    itemsFound: 0,
    itemsFresh: 0,
    itemsQueued: 0,
    durationMs: 0,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
    const response = await fetch(source.url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return {
        ...base,
        status: "http_error",
        httpStatus: response.status,
        durationMs: Date.now() - startedAt,
        message: `HTTP ${response.status}`,
      };
    }

    const body = await response.text();
    if (!/<rss|<feed[\s>]/i.test(body.slice(0, 3000))) {
      return {
        ...base,
        status: "invalid_feed",
        httpStatus: response.status,
        durationMs: Date.now() - startedAt,
        message: "Response was HTML, not RSS/Atom.",
      };
    }

    const items = parseFeedXml(body);
    return {
      ...base,
      status: items.length > 0 ? "ok" : "empty",
      httpStatus: response.status,
      itemsFound: items.length,
      itemsFresh: items.length,
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      ...base,
      durationMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/** Checks every monitored source and returns a health report per source. */
export async function checkAllFeeds(): Promise<SourceHealthReport[]> {
  const sources = getEnabledSources();
  return mapWithConcurrency(sources, FEED_CONCURRENCY, (source) =>
    checkFeedHealth(source)
  );
}

/**
 * Main automated ingestion function: queries every monitored feed, extracts
 * fresh items, classifies them by sport, and formats them into pending
 * stories awaiting editorial review.
 *
 * Nothing here publishes. Every returned article has status "pending".
 */
export async function runAutomatedIngestion(
  options: IngestionOptions = {}
): Promise<IngestionReport> {
  const startedAt = Date.now();
  const sources = options.sources?.length
    ? options.sources
    : getEnabledSources();
  const maxAgeHours = resolveMaxAgeHours(options.maxAgeHours);
  const maxItemsPerSource = options.maxItemsPerSource ?? DEFAULT_MAX_ITEMS_PER_SOURCE;
  const shouldExtractImages = options.extractImages !== false;

  const discoveredStories: GhanaSportArticle[] = [];
  const sourceHealth: SourceHealthReport[] = [];
  const seenNormalized = new Set<string>();
  let duplicatesSkipped = 0;
  let staleSkipped = 0;

  const results = await mapWithConcurrency(sources, FEED_CONCURRENCY, async (source) => {
    const sourceStartedAt = Date.now();
    const health: SourceHealthReport = {
      id: source.id,
      name: source.name,
      publisher: source.publisher,
      tier: source.tier,
      url: source.url,
      status: "unreachable",
      itemsFound: 0,
      itemsFresh: 0,
      itemsQueued: 0,
      durationMs: 0,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS);
      const response = await fetch(source.url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent": USER_AGENT,
          Accept:
            "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
        },
      });
      clearTimeout(timeout);

      if (!response.ok) {
        health.status = "http_error";
        health.httpStatus = response.status;
        health.durationMs = Date.now() - sourceStartedAt;
        health.message = `HTTP ${response.status}`;
        return { health, items: [] as ParsedFeedItem[] };
      }

      const body = await response.text();
      if (!/<rss|<feed[\s>]/i.test(body.slice(0, 3000))) {
        health.status = "invalid_feed";
        health.httpStatus = response.status;
        health.durationMs = Date.now() - sourceStartedAt;
        health.message = "Response was HTML, not RSS/Atom.";
        return { health, items: [] as ParsedFeedItem[] };
      }

      const allItems = parseFeedXml(body);
      health.itemsFound = allItems.length;

      const freshItems = allItems.filter((item) => {
        const fresh = isFresh(item.pubDate, maxAgeHours);
        if (!fresh) staleSkipped += 1;
        return fresh;
      });
      health.itemsFresh = freshItems.length;

      if (allItems.length === 0) health.status = "empty";
      else if (freshItems.length === 0) {
        health.status = "empty";
        health.message = "All items older than the freshness window.";
      } else health.status = "ok";

      health.durationMs = Date.now() - sourceStartedAt;
      return {
        health,
        items: freshItems.slice(0, maxItemsPerSource),
      };
    } catch (error) {
      health.status = "unreachable";
      health.durationMs = Date.now() - sourceStartedAt;
      health.message = error instanceof Error ? error.message : "Unknown error";
      return { health, items: [] as ParsedFeedItem[] };
    }
  });

  for (const { health, items } of results) {
    sourceHealth.push(health);
    if (items.length === 0) continue;

    const source = sources.find((entry) => entry.id === health.id);
    if (!source) continue;

    for (const item of items) {
      const normalized = normalizeHeadline(item.title);
      if (!normalized || seenNormalized.has(normalized)) {
        duplicatesSkipped += 1;
        continue;
      }
      seenNormalized.add(normalized);

      const category = classifySportCategory(
        item.title,
        item.description,
        source.defaultSport
      );
      const slug = slugify(item.title);
      const discoveredAt = new Date().toISOString();
      const publisher = item.publisher || source.publisher;
      const cleanTitle = stripPublisherSuffix(item.title, publisher);

      discoveredStories.push({
        id: `gha-auto-${slug}-${Date.now().toString(36)}`,
        title: cleanTitle,
        slug: `${slug}-${Date.now().toString(36)}`,
        category,
        status: "pending",
        author: `Wire Desk · ${publisher}`,
        publishedAt: "Pending Editorial Approval",
        readTime: "3 min",
        image: item.image,
        excerpt:
          item.description.slice(0, 200) ||
          `Discovered via ${publisher}. Awaiting primary-source editorial verification.`,
        content: [
          item.description ||
            `Automated discovery captured this lead from ${publisher}. Further factual verification is underway by The Sports Digest newsroom.`,
          `Origin: ${publisher} (${source.name}). Retrieved ${new Date().toLocaleDateString()}.`,
          "Under our editorial policy, this story will not go live until it is verified and approved by the Editor-in-Chief.",
        ],
        discoverySource: {
          type: "automated_wire" as DiscoverySourceType,
          sourceName: publisher,
          sourceUrl: item.link || source.url,
          discoveredAt,
          rawSnippet: item.description,
        },
        editorialVerification: {
          verifiedBy: "Pending Verification",
          verifiedAt: "",
          factChecked: false,
          sourceVerified: false,
          editorialNotes: `Automated detection via ${source.name} (${source.tier.replace("_", " ")}). Corroborate with the federation, match commissioner or club before publishing.`,
        },
      });

      health.itemsQueued += 1;
    }
  }

  // Scrape authentic lead photos for stories that arrived without one.
  if (shouldExtractImages && discoveredStories.length > 0) {
    const needsImage = discoveredStories
      .filter((article) => !article.image && article.discoverySource.sourceUrl)
      .slice(0, MAX_IMAGE_EXTRACTIONS_PER_RUN);

    await mapWithConcurrency(needsImage, IMAGE_CONCURRENCY, async (article) => {
      const resolved = await extractArticleOgImage(
        article.discoverySource.sourceUrl || ""
      );
      if (resolved) article.image = resolved;
    });
  }

  return {
    success: true,
    fetchedAt: new Date().toISOString(),
    discoveredStories,
    sourcesChecked: sourceHealth.map((health) => health.name),
    sourceHealth,
    duplicatesSkipped,
    staleSkipped,
    coverage: getCoverageMatrix(),
    uncoveredSports: getUncoveredSports(),
    durationMs: Date.now() - startedAt,
  };
}

/**
 * Convenience helper for the newsroom: the sports that currently have no
 * monitored source, so an editor knows exactly where coverage is thin.
 */
export function getSportsWithoutArticles(
  articles: GhanaSportArticle[]
): SportDiscipline[] {
  const covered = new Set(
    articles
      .filter((article) => article.status === "approved")
      .map((article) => article.category as SportDiscipline)
  );
  return SPORT_DISCIPLINES.filter((sport) => !covered.has(sport));
}
