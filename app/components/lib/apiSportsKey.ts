// Single source of truth for the API-Sports credential.
//
// One API-Sports account covers every product the site subscribes to, so
// API_SPORTS_KEY wins over the per-sport variables. Rotating the shared value
// therefore replaces the key used by football, basketball, baseball, the NBA,
// the NFL, volleyball and handball in one step, even if an old sport-specific
// variable is still present in .env.local or Vercel.
//
// The per-sport variables are only read when the shared key is absent, which
// keeps them useful as a last-resort override without letting a stale key
// silently win.

const PLACEHOLDER = "your_api_sports_key";

export function apiSportsKey(sportKeyName?: string): string | undefined {
  const environment = process.env as Record<string, string | undefined>;
  for (const name of ["API_SPORTS_KEY", sportKeyName]) {
    if (!name) continue;
    const value = environment[name]?.trim();
    if (value && value !== PLACEHOLDER) return value;
  }
  return undefined;
}
