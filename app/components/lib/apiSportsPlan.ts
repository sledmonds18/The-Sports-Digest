// API-Sports answers a blocked season with a plan error such as:
// "Free plans do not have access to this season, try from 2022 to 2024."
// Parse it so the site can explain the limitation instead of showing a generic
// provider failure.

export type PlanSeasonLimit = { firstSeason: number; lastSeason: number };

export function getPlanSeasonLimit(message: string): PlanSeasonLimit | null {
  const match = message.match(/free plans do not have access to this season,\s*try from\s+(\d{4})\s+to\s+(\d{4})/i);
  if (!match) return null;
  const firstSeason = Number(match[1]);
  const lastSeason = Number(match[2]);
  return firstSeason <= lastSeason ? { firstSeason, lastSeason } : null;
}
