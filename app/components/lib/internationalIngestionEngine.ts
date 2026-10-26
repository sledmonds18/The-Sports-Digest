import { extractArticleOgImage, parseFeedXml, slugify, stripPublisherSuffix } from "./automatedIngestionEngine";
import { INTERNATIONAL_FEED_REGISTRY } from "./internationalFeedRegistry";
import type { InternationalSportArticle } from "./internationalSportsData";

type FeedHealth = {
  id: string; name: string; publisher: string; category: string; tier: string; status: string;
  httpStatus?: number; itemsFound: number; itemsFresh: number; itemsQueued: number;
  durationMs: number; message?: string;
};

export async function runInternationalIngestion() {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const results = await Promise.all(INTERNATIONAL_FEED_REGISTRY.filter((item) => item.enabled).map(async (source) => {
    const start = Date.now();
    const health: FeedHealth = { id: source.id, name: source.name, publisher: source.publisher, category: source.category, tier: source.tier, status: "error", itemsFound: 0, itemsFresh: 0, itemsQueued: 0, durationMs: 0 };
    const discoveredStories: InternationalSportArticle[] = [];
    try {
      const response = await fetch(source.url, { headers: { "User-Agent": "TheSportsDigest/1.0 (+https://thesportsdigest.com)" }, signal: AbortSignal.timeout(10000), cache: "no-store" });
      health.httpStatus = response.status;
      if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
      const entries = parseFeedXml(await response.text());
      health.itemsFound = entries.length;
      health.status = entries.length ? "ok" : "empty";
      for (const entry of entries.slice(0, 8)) {
        const date = entry.pubDate ? new Date(entry.pubDate) : new Date();
        if (!Number.isNaN(date.getTime()) && date.getTime() < cutoff) continue;
        health.itemsFresh++;
        const id = `${source.id}-${slugify(entry.title)}-${date.getTime().toString(36)}`;
        const cleanTitle = stripPublisherSuffix(entry.title, entry.publisher || source.publisher);
        const discoveredAt = new Date().toISOString();
        discoveredStories.push({
          id, title: cleanTitle, slug: `${slugify(cleanTitle)}-${date.getTime().toString(36)}`, category: source.category, status: "pending", author: `International Wire Desk · ${entry.publisher || source.publisher}`, publishedAt: "Pending Editorial Approval", readTime: "3 min", image: entry.image,
          ...(source.category === "Transfers" ? { transferStatus: "reported" as const } : {}),
          excerpt: entry.description.slice(0, 220) || `News lead discovered from ${entry.publisher || source.publisher}. Verify against official sources before publishing.`,
          content: [entry.description || "Automated news lead awaiting editorial research.", `Source: ${entry.publisher || source.publisher}.`, "This story remains unpublished until an editor verifies and approves it."],
          discoverySource: { type: "automated_wire", sourceName: entry.publisher || source.publisher, sourceUrl: entry.link || source.url, discoveredAt, rawSnippet: entry.description },
          editorialVerification: { verifiedBy: "Pending Verification", verifiedAt: "", factChecked: false, sourceVerified: false, editorialNotes: `Discovered from ${source.name}. Verify claims with the relevant league, federation, club or primary source before approval.` },
        });
        health.itemsQueued++;
      }
    } catch (error) {
      health.status = "error";
      health.message = error instanceof Error ? error.message : "Feed request failed";
    }
    health.durationMs = Date.now() - start;
    return { health, discoveredStories };
  }));

  const sourceHealth = results.map((result) => result.health);
  const discoveredStories = results.flatMap((result) => result.discoveredStories);
  // Google News RSS links lead to a generic JavaScript redirect page, not the
  // publisher's article. Scraping its og:image can assign the same unrelated
  // thumbnail to many stories, so only fetch metadata from direct article URLs.
  const missingImages = discoveredStories.filter((article) => {
    if (article.image || !article.discoverySource.sourceUrl) return false;
    try {
      return new URL(article.discoverySource.sourceUrl).hostname !== "news.google.com";
    } catch {
      return false;
    }
  }).slice(0, 8);
  await Promise.all(missingImages.map(async (article) => {
    article.image = await extractArticleOgImage(article.discoverySource.sourceUrl || "");
  }));
  return { discoveredStories, sourceHealth, sourcesChecked: sourceHealth.length, staleSkipped: sourceHealth.reduce((sum, entry) => sum + entry.itemsFound - entry.itemsFresh, 0), fetchedAt: new Date().toISOString() };
}
