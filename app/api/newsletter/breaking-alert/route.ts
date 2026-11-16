import { Resend } from "resend";
import {
  isEditorialRequestAuthorized,
  unauthorizedResponse,
} from "../../../components/lib/editorialAuth";
import { subscriberStore } from "../../../components/lib/subscriberStore";
import { getResendAudienceEmails } from "../../../components/lib/resendContacts";

/** Resend's batch endpoint accepts at most 100 emails per call. */
const RESEND_BATCH_LIMIT = 100;

/**
 * Resend's shared testing sender (onboarding@resend.dev) may only deliver to
 * the Resend account owner's own inbox, so every real recipient is rejected
 * with "Invalid 'to' field". Once thesportsdigest.com is verified in Resend,
 * set RESEND_FROM_EMAIL (e.g. "The Sports Digest <bulletin@thesportsdigest.com>")
 * in .env.local and on Vercel to unlock dispatch to real subscribers.
 */
const DEFAULT_FROM = "The Sports Digest <onboarding@resend.dev>";

/**
 * Optional monetization slot. The newsroom may attach a paying sponsor to a
 * dispatch; when present it renders as a clearly-labelled block inside the
 * bulletin. Name is required to avoid a dangling "Sponsored by" line.
 */
interface BulletinSponsor {
  name: string;
  line: string;
  url: string;
}

function parseSponsor(input: unknown): BulletinSponsor | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim().slice(0, 80) : "";
  if (!name) return null;
  const line = typeof raw.line === "string" ? raw.line.trim().slice(0, 140) : "";
  const url = typeof raw.url === "string" ? raw.url.trim().slice(0, 300) : "";
  return { name, line, url };
}

function buildSponsorBlock(sponsor: BulletinSponsor | null): string {
  if (!sponsor) return "";
  return `
━ SPONSORED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This bulletin is brought to you by ${sponsor.name}${sponsor.line ? ` — ${sponsor.line}` : ""}
${sponsor.url || ""}
`;
}

/**
 * Placeholder domains people type into signup boxes (and that Resend refuses
 * outright). Filtering them here keeps one junk signup from failing a batch.
 */
const BLOCKED_RECIPIENT_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "domain.com",
  "yourdomain.com",
  "email.com",
]);

function isDeliverableRecipient(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return domain !== "" && !BLOCKED_RECIPIENT_DOMAINS.has(domain);
}

/**
 * Last-resort fan-out used when a whole batch was rejected. Sends one email
 * per call and counts only the ones Resend actually accepted, so a single
 * bad address on the roster degrades into a skip rather than a failure.
 */
async function sendIndividually(
  resend: Resend,
  batch: Array<{ from: string; to: string[]; subject: string; text: string }>,
  batchErrors: string[]
): Promise<number> {
  let delivered = 0;
  for (const email of batch) {
    const result = await resend.emails.send(email);
    if (result.error) {
      batchErrors.push(
        `${email.to[0]}: ${result.error.message || "Rejected by Resend."}`
      );
      continue;
    }
    delivered += 1;
  }
  return delivered;
}

export async function POST(request: Request) {
  // Dispatching a bulletin reaches subscribers. It is a publishing action, so
  // it stays behind the newsroom gate like every other live change.
  if (!isEditorialRequestAuthorized(request)) {
    return unauthorizedResponse(
      "Only the editorial desk may dispatch a breaking bulletin."
    );
  }

  try {
    const body = await request.json();
    const { title, excerpt, category, author, slug } = body;

    if (!title) {
      return Response.json(
        { success: false, error: "Article title is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "RESEND_API_KEY not configured in .env.local",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const emailSubject = `🚨 BREAKING [${category || "Ghana Sports"}]: ${title}`;

    const sponsor = parseSponsor(body?.sponsor);
    const sponsorBlock = buildSponsorBlock(sponsor);

    const textContent = `
THE SPORTS DIGEST — BREAKING SPORTS BULLETIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${title}

Category: ${category}
Reported by: ${author || "The Sports Digest Accra Desk"}

Summary:
${excerpt}

Read full verified coverage at:
https://thesportsdigest.com/ghana-sports-news/${slug || ""}
${sponsorBlock}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsible Sports Journalism · Accra, Ghana
    `;

    // The durable roster lives in Resend Contacts — the local subscriber
    // store is ephemeral on serverless, so dispatching from it alone would
    // reach nobody on production. Union both sources (Resend first) and
    // dedupe case-insensitively so a subscriber present on both sides gets
    // exactly one copy.
    const [resendEmails, localEmails] = await Promise.all([
      getResendAudienceEmails(),
      Promise.resolve(
        subscriberStore.getActiveSubscribers().map((s) => s.email)
      ),
    ]);
    const roster = Array.from(
      new Set(
        [...resendEmails, ...localEmails].map((email) => email.toLowerCase())
      )
    );

    // If the roster is still empty, fall back to the newsroom inbox so the
    // dispatch is never a silent no-op.
    const fallbackRecipient = process.env.CONTACT_EMAIL || "";
    const recipients = roster.length > 0 ? roster : [fallbackRecipient];

    let delivered = 0;
    const batchErrors: string[] = [];
    const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

    for (let i = 0; i < recipients.length; i += RESEND_BATCH_LIMIT) {
      const batch = recipients
        .slice(i, i + RESEND_BATCH_LIMIT)
        .filter(isDeliverableRecipient)
        .map((to) => ({
          from,
          to: [to],
          subject: emailSubject,
          text: textContent,
        }));

      if (batch.length === 0) continue;

      const result = await resend.batch.send(batch);
      if (result.error) {
        // Resend rejects the WHOLE batch when even one recipient is invalid
        // (e.g. a placeholder address that slipped past signup validation).
        // Fall back to one-by-one sends so the deliverable readers still
        // receive the bulletin instead of the entire dispatch failing.
        const individual = await sendIndividually(resend, batch, batchErrors);
        delivered += individual;
        continue;
      }
      delivered += batch.length;
    }

    if (delivered === 0) {
      return Response.json(
        {
          success: false,
          error: batchErrors[0] || "Failed to dispatch email alert.",
        },
        { status: 502 }
      );
    }

    const subscriberTotal = roster.length;
    let notice =
      subscriberTotal > 0
        ? `Breaking bulletin dispatched to ${delivered} subscriber${delivered === 1 ? "" : "s"}.`
        : "No active subscribers yet — bulletin sent to the newsroom inbox instead.";

    if (subscriberTotal > 0 && delivered < subscriberTotal) {
      const refused = subscriberTotal - delivered;
      notice += ` ${refused} recipient${refused === 1 ? " was" : "s were"} refused by Resend: ${
        batchErrors.slice(0, 3).join(" · ") || "no detail returned."
      }${
        DEFAULT_FROM === from
          ? " Tip: verify a sending domain in Resend and set RESEND_FROM_EMAIL to deliver to all subscribers."
          : ""
      }`;
    }

    // Persist the dispatch so the newsroom panel can report the reach.
    subscriberStore.recordDispatch(
      delivered,
      subscriberTotal,
      title
    );

    return Response.json(
      {
        success: true,
        message: notice,
        subscribersReached: delivered,
        subscriberCount: subscriberTotal,
        sponsoredBy: sponsor?.name || null,
        rosterSources: {
          resendContacts: resendEmails.length,
          localStore: localEmails.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Breaking alert error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to dispatch breaking alert.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
