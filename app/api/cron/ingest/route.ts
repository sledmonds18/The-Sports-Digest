import { runAutomatedIngestion } from "../../../components/lib/automatedIngestionEngine";
import { ghanaNewsStore } from "../../../components/lib/ghanaNewsStore";
import {
  isEditorialRequestAuthorized,
  unauthorizedResponse,
} from "../../../components/lib/editorialAuth";

/**
 * Automated discovery cron.
 *
 * Authorised by either:
 * - CRON_SECRET (bearer token / ?secret=) as configured on Vercel, or
 * - the editorial passkey, so the newsroom can trigger a scan manually.
 *
 * Every discovered story is filed as "pending". Nothing is published here.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    const expectedSecret = process.env.CRON_SECRET;
    const bearerToken = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "");

    const authorizedByCron =
      !!expectedSecret &&
      (secret === expectedSecret || bearerToken === expectedSecret);
    const authorizedByEditor = isEditorialRequestAuthorized(request);

    if (!authorizedByCron && !authorizedByEditor) {
      return unauthorizedResponse(
        "Unauthorized cron trigger. Set CRON_SECRET in the Vercel project, or call from the editorial desk."
      );
    }

    const report = await runAutomatedIngestion();
    const ingestResult = ghanaNewsStore.addIngestedArticles(
      report.discoveredStories
    );

    return Response.json(
      {
        success: true,
        message: `Automated ingestion complete. ${ingestResult.added} new stories placed in editorial queue awaiting approval.`,
        newStoriesQueued: ingestResult.added,
        duplicatesSkipped: ingestResult.skippedDuplicates,
        staleSkipped: report.staleSkipped,
        queueFull: ingestResult.queueFull,
        sourcesMonitored: report.sourcesChecked.length,
        sourceHealth: report.sourceHealth,
        coverageMatrix: report.coverage,
        uncoveredSports: report.uncoveredSports,
        timestamp: report.fetchedAt,
        durationMs: report.durationMs,
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
