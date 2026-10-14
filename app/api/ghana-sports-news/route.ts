import { ghanaNewsStore } from "../../components/lib/ghanaNewsStore";
import { runAutomatedIngestion } from "../../components/lib/automatedIngestionEngine";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status") || "approved";
    const categoryParam = searchParams.get("category") || "All Sports";

    const filtered = ghanaNewsStore.getArticles(statusParam, categoryParam);
    const counts = ghanaNewsStore.getCounts();

    return Response.json(
      {
        success: true,
        data: filtered,
        counts,
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

    // Action: Automated Discovery Wire Ingestion (Triggers crawler scan)
    if (action === "ingest_wire" || action === "run_crawler") {
      const { discoveredStories, sourcesChecked } = await runAutomatedIngestion();
      const countAdded = ghanaNewsStore.addIngestedArticles(discoveredStories);

      return Response.json(
        {
          success: true,
          message: `Automated crawler scanned ${sourcesChecked.length} sources and discovered ${countAdded} new stories.`,
          newStoriesQueued: countAdded,
          article: discoveredStories[0],
          counts: ghanaNewsStore.getCounts(),
        },
        { status: 201 }
      );
    }

    return Response.json(
      { success: false, message: "Invalid action." },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to process request." },
      { status: 500 }
    );
  }
}
