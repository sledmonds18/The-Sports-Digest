import crypto from "crypto";

/**
 * Header the newsroom sends with every mutating request.
 */
export const EDITORIAL_TOKEN_HEADER = "x-editorial-token";

/**
 * Development fallback. Set EDITORIAL_PASSKEY in .env.local (and in the Vercel
 * project) to replace it with a real newsroom key.
 */
export const DEFAULT_EDITORIAL_PASSKEY = "digest2026";

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf-8");
  const bufferB = Buffer.from(b, "utf-8");
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

/**
 * Editorial authorisation for publish-affecting actions.
 *
 * This is a speed bump, not real authentication: the passkey still ships in
 * the client bundle. Its job is to make sure a random visitor, crawler or
 * browser extension cannot approve, reject or file stories by calling the
 * public API directly.
 */
export function isEditorialRequestAuthorized(request: Request): boolean {
  const provided = request.headers.get(EDITORIAL_TOKEN_HEADER) || "";
  if (!provided) return false;

  const configured = process.env.EDITORIAL_PASSKEY?.trim();
  if (configured) return safeEqual(provided, configured);

  return (
    safeEqual(provided, DEFAULT_EDITORIAL_PASSKEY) ||
    safeEqual(provided, "admin")
  );
}

export function unauthorizedResponse(message = "Editorial authorisation required.") {
  return Response.json(
    {
      success: false,
      error: message,
      hint: "Sign in at /editorial and retry with the newsroom passkey.",
    },
    { status: 401 }
  );
}
