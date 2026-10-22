import { Resend } from "resend";
import {
  isEditorialRequestAuthorized,
  unauthorizedResponse,
} from "../../../components/lib/editorialAuth";

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
    const recipient = process.env.CONTACT_EMAIL || "sylvesteredmonds18@gmail.com";

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

    const textContent = `
THE SPORTS DIGEST — BREAKING SPORTS BULLETIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${title}

Category: ${category}
Reported by: ${author || "The Sports Digest Accra Desk"}

Summary:
${excerpt}

Read full verified coverage at:
https://thesportsdigest.com/ghana-sports-news/${slug || ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Responsible Sports Journalism · Accra, Ghana
    `;

    const { data, error } = await resend.emails.send({
      from: "The Sports Digest <onboarding@resend.dev>",
      to: [recipient],
      subject: emailSubject,
      text: textContent,
    });

    if (error) {
      console.warn("Resend email dispatch error:", error);
      return Response.json(
        {
          success: false,
          error: error.message || "Failed to dispatch email alert.",
        },
        { status: 502 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Breaking news email dispatch sent successfully!",
        data,
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
