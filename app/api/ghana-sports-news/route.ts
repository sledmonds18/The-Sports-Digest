import { ghanaNewsStore } from "../../components/lib/ghanaNewsStore";
import {
  runAutomatedIngestion,
  checkAllFeeds,
  slugify,
} from "../../components/lib/automatedIngestionEngine";
import {
  isEditorialRequestAuthorized,
  unauthorizedResponse,
} from "../../components/lib/editorialAuth";
import {
  GHANA_SPORTS_CATEGORIES,
  DiscoverySourceType,
} from "../../components/lib/ghanaSportsData";
import { getCoverageMatrix } from "../../components/lib/ghanaFeedRegistry";
import { extractArticleOgImage } from "../../components/lib/automatedIngestionEngine";

const MUTATING_ACTIONS = [
  "approve",
  "update",
  "reject",
  "reset",
  "ingest_wire",
  "run_crawler",
  "submit_story",
  "check_feeds",
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "approved";
    const categoryParam = searchParams.get("category") || "All Sports";

    // Publishing policy: only approved stories are public. Everything else
    // (pending queue, rejected, drafts) is newsroom-only.
    if (statusParam !== "approved" && !isEditorialRequestAuthorized(request)) {
      return unauthorizedResponse(
        "Only approved stories are public. Editorial authorisation is required for the verification queue."
      );
    }

    const filtered = ghanaNewsStore.getArticles(statusParam, categoryParam);
    const counts = ghanaNewsStore.getCounts();

    return Response.json(
      {
        success: true,
        data: filtered,
        counts,
        coverageMatrix: getCoverageMatrix(),
        categories: GHANA_SPORTS_CATEGORIES,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch Ghana sports articles." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, articleId, editorName, notes } = body;

    if (!action || !MUTATING_ACTIONS.includes(action)) {
      return Response.json(
        { success: false, message: "Invalid action." },
        { status: 400 }
      );
    }

    // Every publish-affecting action must come from the newsroom.
    if (!isEditorialRequestAuthorized(request)) {
      return unauthorizedResponse();
    }

    // Action: Reset newsroom to clean seed state
    if (action === "reset") {
      const resetArticles = ghanaNewsStore.resetStore();
      return Response.json(
        {
          success: true,
          message: "Newsroom reset to clean verified seed state.",
          data: resetArticles,
        },
        { status: 200 }
      );
    }

    // Action: Editorial Approval
    if (action === "approve" && articleId) {
      const updated = ghanaNewsStore.approveArticle(
        articleId,
        editorName || "Shem Bravon Lamptey (Editor-in-Chief)",
        notes || "Verified by Sports Digest Editorial Desk before publication.",
        body.updates
      );

      if (!updated) {
        return Response.json(
          { success: false, message: "Article not found." },
          { status: 404 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Article approved and published live.",
          article: updated,
        },
        { status: 200 }
      );
    }

    // Action: Update Article Details (Image, Title, Excerpt, etc.)
    if (action === "update" && articleId && body.updates) {
      const updated = ghanaNewsStore.updateArticle(articleId, body.updates);
      if (!updated) {
        return Response.json(
          { success: false, message: "Article not found." },
          { status: 404 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Article details and image updated successfully.",
          article: updated,
        },
        { status: 200 }
      );
    }

    // Action: Editorial Rejection
    if (action === "reject" && articleId) {
      const success = ghanaNewsStore.rejectArticle(articleId);
      if (!success) {
        return Response.json(
          { success: false, message: "Article not found." },
          { status: 404 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Article rejected and removed from publishing queue.",
        },
        { status: 200 }
      );
    }

    // Action: Manual story filing (the editorial half of hybrid collection)
    if (action === "submit_story") {
      const title = String(body.title || "").trim();
      const excerpt = String(body.excerpt || "").trim();
      const category = body.category as string;

      if (!title || !excerpt) {
        return Response.json(
          {
            success: false,
            message: "A headline and an excerpt are required to file a story.",
          },
          { status: 400 }
        );
      }

      if (!GHANA_SPORTS_CATEGORIES.includes(category as never)) {
        return Response.json(
          { success: false, message: "Unknown sport category." },
          { status: 400 }
        );
      }

      const rawContent = Array.isArray(body.content)
        ? body.content
        : String(body.content || "")
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean);

      const discoveryType = (body.discoveryType ||
        "field_correspondent") as DiscoverySourceType;
      const image = body.image
        ? String(body.image).trim()
        : category === "Transfers" && body.sourceUrl
          ? await extractArticleOgImage(String(body.sourceUrl).trim())
          : undefined;

      const filed = ghanaNewsStore.addEditorialSubmission({
        id: `gha-desk-${slugify(title)}-${Date.now().toString(36)}`,
        title,
        slug: `${slugify(title)}-${Date.now().toString(36)}`,
        category: category as never,
        status: "pending",
        author: String(body.author || "Sports Digest News Desk").trim(),
        publishedAt: "Pending Editorial Approval",
        readTime: String(body.readTime || "3 min").trim(),
        image,
        excerpt,
        content:
          rawContent.length > 0
            ? rawContent
            : [
                excerpt,
                "Filed by The Sports Digest newsroom. Awaiting editor verification.",
              ],
        discoverySource: {
          type: discoveryType,
          sourceName: String(
            body.sourceName || "Sports Digest News Desk"
          ).trim(),
          sourceUrl: body.sourceUrl ? String(body.sourceUrl).trim() : undefined,
          discoveredAt: new Date().toISOString(),
        },
        editorialVerification: {
          verifiedBy: "Pending Verification",
          verifiedAt: "",
          factChecked: false,
          sourceVerified: false,
          editorialNotes: String(
            body.editorialNotes ||
              "Manually filed by the newsroom. Verify against a primary source before publishing."
          ),
        },
        ...(category === "Transfers" ? {
          transferStatus: body.transferStatus === "confirmed" ? "confirmed" as const : "reported" as const,
          transferType: body.transferType || undefined,
          playerName: String(body.playerName || "").trim() || undefined,
          fromClub: String(body.fromClub || "").trim() || undefined,
          toClub: String(body.toClub || "").trim() || undefined,
          transferFee: String(body.transferFee || "").trim() || undefined,
          transferWindow: String(body.transferWindow || "").trim() || undefined,
        } : {}),
      });

      if (!filed) {
        return Response.json(
          {
            success: false,
            message:
              "Story could not be filed: duplicate source link or a full verification queue.",
          },
          { status: 409 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Story filed into the verification queue.",
          article: filed,
          counts: ghanaNewsStore.getCounts(),
        },
        { status: 201 }
      );
    }

    // Action: Automated Discovery Wire Ingestion (Triggers crawler scan)
    if (action === "ingest_wire" || action === "run_crawler") {
      const report = await runAutomatedIngestion();
      const ingestResult = ghanaNewsStore.addIngestedArticles(
        report.discoveredStories
      );

      return Response.json(
        {
          success: true,
          message: `Automated crawler scanned ${report.sourcesChecked.length} sources and queued ${ingestResult.added} new stories.`,
          newStoriesQueued: ingestResult.added,
          duplicatesSkipped: ingestResult.skippedDuplicates,
          staleSkipped: report.staleSkipped,
          queueFull: ingestResult.queueFull,
          sourceHealth: report.sourceHealth,
          coverageMatrix: report.coverage,
          uncoveredSports: report.uncoveredSports,
          durationMs: report.durationMs,
          counts: ghanaNewsStore.getCounts(),
        },
        { status: 201 }
      );
    }

    // Action: Feed health check (no stories created)
    if (action === "check_feeds") {
      const sourceHealth = await checkAllFeeds();
      return Response.json(
        {
          success: true,
          message: `Checked ${sourceHealth.length} monitored sources.`,
          sourceHealth,
          coverageMatrix: getCoverageMatrix(),
        },
        { status: 200 }
      );
    }

    return Response.json(
      { success: false, message: "Invalid action." },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to process request.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
