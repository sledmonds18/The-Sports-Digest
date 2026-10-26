"use client";

import { useCallback, useEffect, useState } from "react";

export interface LiveMatch {
  fixture: {
    id: number;
    date: string;
    status: { elapsed: number | null; short: string; long: string };
    venue?: { name?: string | null; city?: string | null };
  };
  league: { id: number; name: string; country: string; logo?: string };
  teams: {
    home: { name: string; logo?: string; winner?: boolean | null };
    away: { name: string; logo?: string; winner?: boolean | null };
  };
  goals: { home: number | null; away: number | null };
}

type LiveMatchesStatus = "loading" | "ready" | "unconfigured" | "error";
type LiveMatchesSnapshot = { matches: LiveMatch[]; status: LiveMatchesStatus; updatedAt: string | null };

let cachedSnapshot: LiveMatchesSnapshot | null = null;
let cachedAt = 0;
let requestInFlight: Promise<LiveMatchesSnapshot> | null = null;

async function getLiveMatchesSnapshot(force = false): Promise<LiveMatchesSnapshot> {
  if (!force && cachedSnapshot && Date.now() - cachedAt < 25_000) return cachedSnapshot;
  if (requestInFlight) return requestInFlight;
  requestInFlight = fetch("/api/matches", { cache: "no-store" })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok || data.status === "error") throw new Error("Live scores could not be refreshed.");
      const snapshot: LiveMatchesSnapshot = {
        matches: Array.isArray(data.response) ? data.response : [],
        status: data.status === "unconfigured" ? "unconfigured" : "ready",
        updatedAt: data.updatedAt || null,
      };
      cachedSnapshot = snapshot;
      cachedAt = Date.now();
      return snapshot;
    })
    .catch((error) => {
      console.warn("Live matches unavailable:", error);
      return { matches: cachedSnapshot?.matches || [], status: "error" as const, updatedAt: cachedSnapshot?.updatedAt || null };
    })
    .finally(() => { requestInFlight = null; });
  return requestInFlight;
}

export function useLiveMatches() {
  const [snapshot, setSnapshot] = useState<LiveMatchesSnapshot>(cachedSnapshot || { matches: [], status: "loading", updatedAt: null });
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async (isAutomatic = false) => {
    if (!isAutomatic) setRefreshing(true);
    const nextSnapshot = await getLiveMatchesSnapshot(!isAutomatic);
    setSnapshot(nextSnapshot);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void refresh(true);
    // The free football-data plan has a small daily quota; keep this in step
    // with the API route's 15-minute shared cache to avoid burning calls.
    const interval = window.setInterval(() => void refresh(true), 15 * 60_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return { ...snapshot, refreshing, refresh };
}
