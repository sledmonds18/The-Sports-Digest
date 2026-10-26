import { internationalNewsStore } from "../../components/lib/internationalNewsStore";
import { runInternationalIngestion } from "../../components/lib/internationalIngestionEngine";
import { INTERNATIONAL_FEED_REGISTRY } from "../../components/lib/internationalFeedRegistry";
import { INTERNATIONAL_SPORTS_CATEGORIES } from "../../components/lib/internationalSportsData";
import { isEditorialRequestAuthorized, unauthorizedResponse } from "../../components/lib/editorialAuth";
import { extractArticleOgImage, slugify, stripHtml } from "../../components/lib/automatedIngestionEngine";
import type { InternationalSportArticle } from "../../components/lib/internationalSportsData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "approved";
  if (status !== "approved" && !isEditorialRequestAuthorized(request)) return unauthorizedResponse("Editorial authorisation is required for this queue.");
  const articles = internationalNewsStore.getArticles(status, searchParams.get("category") || "All International").map((article) => ({
    ...article,
    excerpt: stripHtml(article.excerpt) || article.title,
    content: article.content.map(stripHtml),
    discoverySource: {
      ...article.discoverySource,
      rawSnippet: article.discoverySource.rawSnippet
        ? stripHtml(article.discoverySource.rawSnippet)
        : undefined,
    },
  }));
  return Response.json({ success: true, data: articles, counts: internationalNewsStore.getCounts(), categories: INTERNATIONAL_SPORTS_CATEGORIES, feeds: INTERNATIONAL_FEED_REGISTRY.map(({ id, name, publisher, category }) => ({ id, name, publisher, category })) });
}

export async function POST(request: Request) {
  if (!isEditorialRequestAuthorized(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const { action, articleId } = body;
    if (action === "reset") return Response.json({ success: true, data: internationalNewsStore.reset() });
    if (action === "run_crawler" || action === "ingest_wire") {
      const report = await runInternationalIngestion();
      const result = internationalNewsStore.addMany(report.discoveredStories);
      return Response.json({ success: true, ...report, ...result, sourceHealth: report.sourceHealth, counts: internationalNewsStore.getCounts() });
    }
    if (action === "check_feeds") {
      const report = await runInternationalIngestion();
      return Response.json({ success: true, sourceHealth: report.sourceHealth });
    }
    if (action === "approve" && articleId) {
      const article = internationalNewsStore.approve(articleId, body.editorName || "Sports Digest Editor", body.notes || "Verified by the International Editorial Desk.", body.updates);
      return article ? Response.json({ success: true, article }) : Response.json({ success: false, message: "Article not found." }, { status: 404 });
    }
    if (action === "update" && articleId && body.updates) {
      const article = internationalNewsStore.update(articleId, body.updates);
      return article ? Response.json({ success: true, article }) : Response.json({ success: false, message: "Article not found." }, { status: 404 });
    }
    if (action === "reject" && articleId) return internationalNewsStore.reject(articleId) ? Response.json({ success: true }) : Response.json({ success: false, message: "Article not found." }, { status: 404 });
    if (action === "submit_story") {
      if (!String(body.title || "").trim() || !String(body.excerpt || "").trim()) return Response.json({ success: false, message: "A headline and excerpt are required." }, { status: 400 });
      if (!INTERNATIONAL_SPORTS_CATEGORIES.slice(1).includes(body.category)) return Response.json({ success: false, message: "Choose an international category." }, { status: 400 });
      const title = String(body.title).trim();
      const dateId = Date.now().toString(36);
      const image = body.image || (body.category === "Transfers" && body.sourceUrl ? await extractArticleOgImage(String(body.sourceUrl).trim()) : undefined);
      const article: InternationalSportArticle = {
        id: `int-desk-${slugify(title)}-${dateId}`, title, slug: `${slugify(title)}-${dateId}`, category: body.category, status: "pending", author: String(body.author || "Sports Digest International Desk"), publishedAt: "Pending Editorial Approval", readTime: "3 min", image,
        excerpt: String(body.excerpt).trim(), content: Array.isArray(body.content) ? body.content : String(body.content || body.excerpt).split(/\n{2,}/).map((paragraph: string) => paragraph.trim()).filter(Boolean),
        discoverySource: { type: body.discoveryType || "field_correspondent", sourceName: String(body.sourceName || "Sports Digest International Desk"), sourceUrl: body.sourceUrl || undefined, discoveredAt: new Date().toISOString() },
        editorialVerification: { verifiedBy: "Pending Verification", verifiedAt: "", factChecked: false, sourceVerified: false, editorialNotes: "Manually filed. Verify with a primary source before approval." },
        ...(body.category === "Transfers" ? {
          transferStatus: body.transferStatus === "confirmed" ? "confirmed" as const : "reported" as const,
          transferType: body.transferType || undefined,
          playerName: String(body.playerName || "").trim() || undefined,
          fromClub: String(body.fromClub || "").trim() || undefined,
          toClub: String(body.toClub || "").trim() || undefined,
          transferFee: String(body.transferFee || "").trim() || undefined,
          transferWindow: String(body.transferWindow || "").trim() || undefined,
        } : {}),
      };
      const filed = internationalNewsStore.submit(article);
      return filed ? Response.json({ success: true, article: filed }) : Response.json({ success: false, message: "Duplicate story or the review queue is full." }, { status: 409 });
    }
    return Response.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, message: error instanceof Error ? error.message : "International news request failed." }, { status: 500 });
  }
}
