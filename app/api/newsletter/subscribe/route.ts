import {
  isEditorialRequestAuthorized,
  unauthorizedResponse,
} from "../../../components/lib/editorialAuth";
import { subscriberStore } from "../../../components/lib/subscriberStore";
import {
  addContactToDigestList,
  markContactUnsubscribed,
} from "../../../components/lib/resendContacts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Placeholder domains people type to test the box. Resend refuses them at
 * dispatch time, so keeping them off the roster is kinder to everyone.
 */
const BLOCKED_SIGNUP_DOMAINS = [
  "example.com",
  "example.org",
  "example.net",
  "test.com",
  "domain.com",
  "yourdomain.com",
  "email.com",
];

/**
 * Newsroom view of the digest list: aggregate counts and the last bulletin's
 * reach. Never returns subscriber email addresses. Gated like every other
 * newsroom read panel.
 */
export async function GET(request: Request) {
  if (!isEditorialRequestAuthorized(request)) {
    return unauthorizedResponse(
      "Only the editorial desk may view subscriber statistics."
    );
  }

  return Response.json({
    success: true,
    counts: subscriberStore.getCounts(),
  });
}

/**
 * Public signup endpoint for the "Never Miss a Story" boxes.
 * Anyone may add themselves; only an email is collected and no verification
 * queue is involved, so this deliberately sits outside the newsroom gate.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    const domain = email.split("@")[1]?.toLowerCase() || "";
    if (!EMAIL_PATTERN.test(email) || email.length > 320) {
      return Response.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    if (BLOCKED_SIGNUP_DOMAINS.includes(domain)) {
      return Response.json(
        {
          success: false,
          error: "Please sign up with your real email address.",
        },
        { status: 400 }
      );
    }

    const result = subscriberStore.subscribe(email);

    // Mirror the signup into Resend Contacts so the roster survives the
    // ephemeral filesystem of a serverless deployment. A sync miss never
    // blocks the signup itself; it is logged and reported.
    const sync = await addContactToDigestList(email, false);
    if (!sync.synced) {
      console.warn(
        `Resend contact mirror failed for ${email}:`,
        sync.reason
      );
    }

    return Response.json({
      success: true,
      added: result.added,
      reactivated: result.reactivated,
      totalActive: result.totalActive,
      audienceSynced: sync.synced,
      message:
        result.reactivated || result.added
          ? "Subscribed! Your first digest arrives soon."
          : "You are already on the digest list.",
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return Response.json(
      {
        success: false,
        error: "Subscription could not be saved. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * Public opt-out endpoint. Newsletters that trap subscribers are flagged as
 * spam, so leaving the list must be as easy as joining it.
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!EMAIL_PATTERN.test(email)) {
      return Response.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const removed = subscriberStore.unsubscribe(email);

    // Keep Resend's own opt-out flag in step with the local store.
    const sync = await markContactUnsubscribed(email);
    if (!sync.synced) {
      console.warn(`Resend unsubscribe mirror failed for ${email}:`, sync.reason);
    }

    return Response.json({ success: true, removed });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return Response.json(
      { success: false, error: "Unsubscribe could not be processed." },
      { status: 500 }
    );
  }
}
