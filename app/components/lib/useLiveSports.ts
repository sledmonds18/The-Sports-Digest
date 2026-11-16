"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LIVE_SPORTS,
  compareEventsByPriority,
  type LiveSport,
  type LiveSportEvent,
  type LiveSportFeed,
  type LiveSportStatus,
} from "./liveSportsData";

type LiveSportsSnapshot = {
  events: LiveSportEvent[];
  feeds: Record<LiveSport, LiveSportFeed>;
  updatedAt: string | null;
};

function makeInitialFeeds(): Record<LiveSport, LiveSportFeed> {
  return {
    football: { sport: "football", status: "unconfigured", events: [] },
    basketball: { sport: "basketball", status: "unconfigured", events: [] },
    baseball: { sport: "baseball", status: "unconfigured", events: [] },
    nba: { sport: "nba", status: "unconfigured", events: [] },
    nfl: { sport: "nfl", status: "unconfigured", events: [] },
    volleyball: { sport: "volleyball", status: "unconfigured", events: [] },
    handball: { sport: "handball", status: "unconfigured", events: [] },
  };
}

const initialFeeds = makeInitialFeeds();

const loadingSnapshot: LiveSportsSnapshot = {
  events: [],
  feeds: makeInitialFeeds(),
  updatedAt: null,
};

let cachedSnapshot: LiveSportsSnapshot | null = null;
let cachedAt = 0;
let requestInFlight: Promise<LiveSportsSnapshot> | null = null;

function footballEvents(matches: unknown[]): LiveSportEvent[] {
  return matches.map((value, index) => {
    const match = value as {
      fixture?: { id?: number; date?: string; status?: { elapsed?: number | null; short?: string } };
      league?: { name?: string; country?: string };
      teams?: { home?: { name?: string; logo?: string }; away?: { name?: string; logo?: string } };
      goals?: { home?: number | null; away?: number | null };
    };
    return {
      id: String(match.fixture?.id ?? `football-${index}`),
      sport: "football",
      competition: [match.league?.name, match.league?.country].filter(Boolean).join(" · ") || "Football",
      participants: [match.teams?.home?.name || "Home", match.teams?.away?.name || "Away"],
      logos: [match.teams?.home?.logo, match.teams?.away?.logo],
      score: `${match.goals?.home ?? 0} - ${match.goals?.away ?? 0}`,
      status: match.fixture?.status?.elapsed != null
        ? `${match.fixture.status.elapsed}′`
        : match.fixture?.status?.short || "Live",
      date: match.fixture?.date,
    };
  });
}

async function loadSnapshot(force = false): Promise<LiveSportsSnapshot> {
  if (!force && cachedSnapshot && Date.now() - cachedAt < 60_000) return cachedSnapshot;
  if (requestInFlight) return requestInFlight;

  requestInFlight = Promise.all([
    fetch(force ? `/api/live-sports?refresh=${Date.now()}` : "/api/live-sports", { cache: "no-store" }),
    fetch("/api/matches", { cache: "no-store" }),
  ])
    .then(async ([sportsResponse, footballResponse]) => {
      const [sportsData, footballData] = await Promise.all([
        sportsResponse.json(),
        footballResponse.json(),
      ]);
      if (!sportsResponse.ok || !Array.isArray(sportsData.feeds)) {
        throw new Error("Live sports could not be refreshed.");
      }

      const feeds = { ...initialFeeds };
      for (const feed of sportsData.feeds as LiveSportFeed[]) {
        if (LIVE_SPORTS.includes(feed.sport)) feeds[feed.sport] = feed;
      }

      if (!footballResponse.ok || footballData.status === "error") {
        // A transient provider hiccup (rate limit, timeout) should not blank the
        // football slate — keep the last known matches for up to ten minutes.
        const previousFootball = cachedSnapshot?.feeds.football;
        const keepPrevious =
          !!previousFootball &&
          previousFootball.events.length > 0 &&
          Date.now() - cachedAt < 10 * 60_000;
        feeds.football = {
          sport: "football",
          status: "error",
          events: keepPrevious ? previousFootball.events : [],
          message: "Live football data is temporarily unavailable.",
        };
      } else {
        const events = Array.isArray(footballData.response)
          ? footballEvents(footballData.response)
          : [];
        feeds.football = {
          sport: "football",
          status: footballData.status === "unconfigured" ? "unconfigured" : "ready",
          events,
          message: footballData.status === "unconfigured"
            ? "Add the shared API-Sports key to the server environment."
            : undefined,
        };
      }

      // Serious competitions first within each sport; sports stay grouped in
      // LIVE_SPORTS order, so football always leads the merged feed.
      const snapshot = {
        feeds,
        events: LIVE_SPORTS.flatMap((sport) =>
          [...feeds[sport].events].sort(compareEventsByPriority)
        ),
        updatedAt: sportsData.updatedAt || footballData.updatedAt || null,
      };
      cachedSnapshot = snapshot;
      cachedAt = Date.now();
      return snapshot;
    })
    .catch((error) => {
      console.warn("Live sports unavailable:", error);
      return cachedSnapshot || loadingSnapshot;
    })
    .finally(() => {
      requestInFlight = null;
    });

  return requestInFlight;
}

export function useLiveSports() {
  const [snapshot, setSnapshot] = useState<LiveSportsSnapshot>(cachedSnapshot || loadingSnapshot);
  const [status, setStatus] = useState<LiveSportStatus | "loading">(
    cachedSnapshot ? "ready" : "loading"
  );
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async (automatic = false) => {
    if (!automatic) setRefreshing(true);
    const nextSnapshot = await loadSnapshot(!automatic);
    setSnapshot(nextSnapshot);
    setStatus(nextSnapshot === loadingSnapshot ? "error" : "ready");
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void refresh(true);
    const interval = window.setInterval(() => void refresh(true), 20 * 60_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return { ...snapshot, status, refreshing, refresh };
}
