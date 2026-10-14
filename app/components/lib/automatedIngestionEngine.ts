import {
  GhanaSportArticle,
  SportCategory,
} from "./ghanaSportsData";

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  defaultSport?: Exclude<SportCategory, "All Sports">;
}

export const MONITORED_FEED_SOURCES: FeedSource[] = [
  {
    id: "gnews-ghana-sports",
    name: "Google News — Ghana Sports Feed",
    url: "https://news.google.com/rss/search?q=Ghana+sports+boxing+athletics+football&hl=en-GH&gl=GH&ceid=GH:en",
  },
  {
    id: "graphic-sports",
    name: "Graphic Online Sports",
    url: "https://www.graphic.com.gh/sports/sports-news.html?type=rss",
  },
];

// Categorization keywords for automatic sport classification
const SPORT_KEYWORD_RULES: Record<
  Exclude<SportCategory, "All Sports">,
  string[]
> = {
  Boxing: [
    "boxing",
    "boxer",
    "bukom",
    "bout",
    "ring",
    "punch",
    "featherweight",
    "heavyweight",
    "wbo",
    "gba",
    "azumah",
    "clottey",
    "dogboe",
    "gloves",
  ],
  Athletics: [
    "athletics",
    "sprint",
    "relay",
    "100m",
    "200m",
    "400m",
    "gaa",
    "javelin",
    "hurdle",
    "track and field",
    "marathon",
    "long jump",
  ],
  Armwrestling: [
    "armwrestling",
    "arm wrestling",
    "golden arms",
    "puller",
    "pulling",
    "gaf",
    "asibey",
  ],
  Basketball: [
    "basketball",
    "abl",
    "nba",
    "braves",
    "hoop",
    "sprite ball",
    "reformers",
    "dribble",
    "cantonments court",
  ],
  Hockey: [
    "hockey",
    "sapholda",
    "stick",
    "theodosia okoh",
    "gaha",
    "ex-chequers",
    "trustees",
  ],
  Volleyball: [
    "volleyball",
    "beach volleyball",
    "gva",
    "spike",
    "cavb",
    "laboma",
    "jump-float",
  ],
  "Combat & Others": [
    "judo",
    "table tennis",
    "taekwondo",
    "karate",
    "tennis",
    "swimming",
    "rugby",
    "para-sports",
    "emporium",
  ],
  Football: [
    "football",
    "soccer",
    "gpl",
    "black stars",
    "black queens",
    "hearts of oak",
    "kotoko",
    "samartex",
    "caf",
    "fifa",
    "premier league",
    "ghana fa",
    "gfa",
  ],
};

/**
 * Classifies an incoming sports news text into one of the 8 Ghanaian sports disciplines
 */
export function classifySportCategory(
  title: string,
  content: string = "",
  defaultSport?: Exclude<SportCategory, "All Sports">
): Exclude<SportCategory, "All Sports"> {
  const combined = `${title} ${content}`.toLowerCase();

  for (const [sport, keywords] of Object.entries(SPORT_KEYWORD_RULES)) {
    const isMatch = keywords.some((kw) => combined.includes(kw));
    if (isMatch) {
      return sport as Exclude<SportCategory, "All Sports">;
    }
  }

  return defaultSport || "Football";
}

/**
 * Parses raw RSS/Atom XML text safely without external library dependencies
 */
function parseRssXml(
  xmlText: string,
  sourceName: string
): Array<{
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image?: string;
}> {
  const items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
    image?: string;
  }> = [];

  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const matches = xmlText.match(itemRegex) || [];

  for (const rawItem of matches.slice(0, 10)) {
    const titleMatch = rawItem.match(
      /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i
    );
    const linkMatch = rawItem.match(
      /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i
    );
    const descMatch = rawItem.match(
      /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i
    );
    const dateMatch = rawItem.match(
      /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/i
    );
    const imageMatch =
      rawItem.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
      rawItem.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
      rawItem.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
      rawItem.match(/<img[^>]+src=["']([^"']+)["']/i);

    const title = titleMatch ? titleMatch[1].trim() : "";
    const link = linkMatch ? linkMatch[1].trim() : "";
    const description = descMatch
      ? descMatch[1].replace(/<[^>]+>/g, "").trim()
      : "";
    const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
    const image = imageMatch ? imageMatch[1].trim() : undefined;

    if (title && title.length > 5) {
      items.push({ title, link, description, pubDate, image });
    }
  }

  return items;
}

/**
 * Follows an article URL in the background to extract the original publication's lead photo (og:image / twitter:image)
 */
export async function extractArticleOgImage(
  articleUrl: string
): Promise<string | undefined> {
  if (!articleUrl || !articleUrl.startsWith("http")) return undefined;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(articleUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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

/**
 * Main automated ingestion function that queries feeds, extracts items,
 * classifies them, and formats them into pending stories awaiting editorial review.
 */
export async function runAutomatedIngestion(): Promise<{
  success: boolean;
  discoveredStories: GhanaSportArticle[];
  sourcesChecked: string[];
}> {
  const discoveredStories: GhanaSportArticle[] = [];
  const sourcesChecked: string[] = [];

  for (const source of MONITORED_FEED_SOURCES) {
    sourcesChecked.push(source.name);

    try {
      // Abort after 4.5s to keep crons fast
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(source.url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "TheSportsDigest-Bot/2.0 (Automated Sports Wire Ingestion; editorial@thesportsdigest.com)",
        },
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        const parsedItems = parseRssXml(text, source.name);

        const itemsToProcess = parsedItems.slice(0, 6);
        for (const item of itemsToProcess) {
          const category = classifySportCategory(
            item.title,
            item.description,
            source.defaultSport
          );
          const slug = `wire-${category.toLowerCase()}-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;

          // Scrape the authentic article image (og:image) if RSS item lacked one
          let resolvedImage = item.image;
          if (!resolvedImage && item.link) {
            resolvedImage = await extractArticleOgImage(item.link);
          }

          discoveredStories.push({
            id: `gha-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            title: `[AUTOMATED DISCOVERY] ${item.title}`,
            slug,
            category,
            status: "pending",
            author: `Automated Wire Crawler · ${source.name}`,
            publishedAt: "Pending Editorial Approval",
            readTime: "3 min",
            image: resolvedImage,
            excerpt:
              item.description.slice(0, 160) ||
              `Automated sports discovery captured from ${source.name}. Awaiting primary source editorial verification.`,
            content: [
              `This breaking sports report was automatically discovered from ${source.name} on ${new Date().toLocaleDateString()}.`,
              item.description ||
                "Further factual verification is underway by The Sports Digest newsroom.",
              "Under our editorial policy, this story will not go live until verified by the editor-in-chief.",
            ],
            discoverySource: {
              type: "automated_wire",
              sourceName: source.name,
              sourceUrl: item.link || source.url,
              discoveredAt: new Date().toISOString(),
              rawSnippet: item.description,
            },
            editorialVerification: {
              verifiedBy: "Pending Verification",
              verifiedAt: "",
              factChecked: false,
              sourceVerified: false,
              editorialNotes: `Automated detection from ${source.name}. Corroborate claims with match commissioner or federation before publishing.`,
            },
          });
        }
      }
    } catch {
      // Live endpoint unreachable or sandbox offline - seamlessly continue
    }
  }

  return {
    success: true,
    discoveredStories,
    sourcesChecked,
  };
}
