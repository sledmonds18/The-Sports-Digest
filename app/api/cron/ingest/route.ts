import { runAutomatedIngestion } from "../../../components/lib/automatedIngestionEngine";
import { ghanaNewsStore } from "../../../components/lib/ghanaNewsStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Vercel sends CRON_SECRET as a bearer token to scheduled functions.
    const expectedSecret = process.env.CRON_SECRET;
    const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (expectedSecret && secret !== expectedSecret && bearerToken !== expectedSecret) {
      return Response.json(
        { success: false, error: "Unauthorized cron trigger." },
        { status: 401 }
      );
    }

    const { discoveredStories, sourcesChecked } = await runAutomatedIngestion();

    // Enforce publishing policy: Add discovered stories directly into PENDING queue
    const countAdded = ghanaNewsStore.addIngestedArticles(discoveredStories);

    return Response.json(
      {
        success: true,
        message: `Automated ingestion complete. ${countAdded} new stories placed in editorial queue awaiting approval.`,
        newStoriesQueued: countAdded,
        sourcesMonitored: sourcesChecked.length,
        timestamp: new Date().toISOString(),
        currentQueueStatus: ghanaNewsStore.getCounts(),
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Automated news ingestion failed.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
