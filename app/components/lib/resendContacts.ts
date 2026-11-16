import { Resend } from "resend";

/**
 * Resend Contacts mirror for the digest subscriber list.
 *
 * The local subscriber store persists to data/subscribers.json, which is
 * read-only-and-therefore-ephemeral on Vercel serverless. Every signup is
 * mirrored into Resend's Contacts API so the roster survives cold starts
 * regardless of where the process runs. Contacts are account-level entities:
 * they persist without a segment, but RESEND_SEGMENT_ID attaches them to one
 * for future broadcast tooling.
 *
 * Nothing here may break the visitor-facing signup: a sync failure is logged
 * and reported to the caller, never thrown.
 */

export interface ContactSyncResult {
  synced: boolean;
  /** Why the sync did not happen, for server logs / newsroom diagnostics. */
  reason?: string;
}

let cachedClient: Resend | null | undefined;

function getClient(): Resend | null {
  if (cachedClient === undefined) {
    const apiKey = process.env.RESEND_API_KEY;
    cachedClient = apiKey ? new Resend(apiKey) : null;
  }
  return cachedClient;
}

function getSegmentId(): string | undefined {
  const id = process.env.RESEND_SEGMENT_ID?.trim();
  return id || undefined;
}

function isAlreadyExists(message: string): boolean {
  return /already exists|conflict|duplicate/i.test(message);
}

/**
 * Create (or re-activate) the contact on Resend. `unsubscribed` false is the
 * normal signup path; a returning subscriber who previously opted out arrives
 * here too, so the flag is mirrored rather than assumed.
 */
export async function addContactToDigestList(
  email: string,
  unsubscribed = false
): Promise<ContactSyncResult> {
  const resend = getClient();
  if (!resend) {
    return { synced: false, reason: "RESEND_API_KEY is not configured" };
  }

  const segmentId = getSegmentId();
  try {
    const { error } = await resend.contacts.create({
      email,
      unsubscribed,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });

    if (error) {
      // Signing up twice is a success locally (idempotent) and on Resend.
      if (isAlreadyExists(error.message)) {
        return { synced: true };
      }
      return { synced: false, reason: error.message };
    }

    return { synced: true };
  } catch (err) {
    return {
      synced: false,
      reason: err instanceof Error ? err.message : "Unknown Resend error",
    };
  }
}

/**
 * Mirror an opt-out. Resend contacts carry their own `unsubscribed` flag, so
 * the newsletter list stays compliant even if the local store is lost.
 */
export async function markContactUnsubscribed(
  email: string
): Promise<ContactSyncResult> {
  const resend = getClient();
  if (!resend) {
    return { synced: false, reason: "RESEND_API_KEY is not configured" };
  }

  try {
    const { error } = await resend.contacts.update({
      email,
      unsubscribed: true,
    });

    if (error) {
      // A contact who signed up before mirroring was added may not exist
      // remotely; nothing to mark, but record why for diagnostics.
      return { synced: false, reason: error.message };
    }

    return { synced: true };
  } catch (err) {
    return {
      synced: false,
      reason: err instanceof Error ? err.message : "Unknown Resend error",
    };
  }
}

/**
 * The durable roster: every Resend contact who has not opted out. This is the
 * source of truth for bulletin dispatch, because the local subscriber store
 * is ephemeral on serverless hosts — Resend always has the real list. Pages
 * through the full set (100 per call) so a large list is never truncated.
 * Returns an empty array on any failure; the caller falls back to the local
 * store so a Resend outage degrades instead of blocking dispatch.
 */
export async function getResendAudienceEmails(): Promise<string[]> {
  const resend = getClient();
  if (!resend) {
    return [];
  }

  const emails: string[] = [];
  try {
    let after: string | undefined;
    // The roster is bounded in practice, but the loop only continues while
    // Resend reports more pages, so it always terminates.
    for (let page = 0; page < 50; page += 1) {
      const { data, error } = await resend.contacts.list({
        limit: 100,
        ...(after ? { after } : {}),
      });

      if (error) {
        console.warn("Resend contact list failed:", error.message);
        break;
      }

      for (const contact of data.data) {
        if (contact.email && !contact.unsubscribed) {
          emails.push(contact.email);
        }
      }

      if (!data.has_more) break;
      after = data.data[data.data.length - 1]?.id;
    }
  } catch (err) {
    console.warn(
      "Resend contact list threw:",
      err instanceof Error ? err.message : err
    );
  }

  return emails;
}
