"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LIVE_SPORTS,
  compareEventsByPriority,
  type LiveDetailSource,
  type LiveSport,
  type LiveSportEvent,
  type LiveSportFeed,
  type LiveSportStatus,
} from "./liveSportsData";

type FootballSnapshot = {
  events: LiveSportEvent[];
  status: LiveSportStatus;
  updatedAt: string | null;
  message?: string;
  fetchedAt: number;
};

type SportsSnapshot = {
  feeds: Record<LiveSport, LiveSportFeed>;
  updatedAt: string | null;
  fetchedAt: number;
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

// Football and the other sports are cached separately on purpose. The live bar
// is the first thing a mobile visitor sees, and it must not wait for the
// multi-sport sweep (basketball/NFL/volleyball can each spend seconds on a
// provider timeout). Each request updates the UI the moment it lands.
let cachedFootball: FootballSnapshot | null = null;
let cachedSports: SportsSnapshot | null = null;
let footballInFlight: Promise<FootballSnapshot> | null = null;
let sportsInFlight: Promise<SportsSnapshot> | null = null;

const FOOTBALL_TTL_MS = 25_000;
const SPORTS_TTL_MS = 60_000;
const KEEP_PREVIOUS_MS = 10 * 60_000;
const FOOTBALL_STORAGE_KEY = "tsd:live-football:v1";

// Repeat visits (common on phones) paint the last slate immediately instead of
// showing an empty bar while the API wakes up. The snapshot is revalidated by
// the normal fetch right after hydration.
function readStoredFootball(): FootballSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FOOTBALL_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as FootballSnapshot;
    if (!stored || !Array.isArray(stored.events)) return null;
    if (Date.now() - Number(stored.fetchedAt) > KEEP_PREVIOUS_MS) return null;
    return stored;
  } catch {
    return null;
  }
}

function storeFootball(snapshot: FootballSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FOOTBALL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Private mode or a full quota: caching is optional.
  }
}

function footballEvents(matches: unknown[]): LiveSportEvent[] {
  return matches.map((value, index) => {
    const match = value as {
      fixture?: { id?: number; date?: string; status?: { elapsed?: number | null; short?: string } };
      league?: { name?: string; country?: string };
      teams?: { home?: { name?: string; logo?: string }; away?: { name?: string; logo?: string } };
      goals?: { home?: number | null; away?: number | null };
      provider?: LiveDetailSource;
      detail?: { source?: LiveDetailSource; id?: string };
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
      source: match.provider,
      detail: match.detail?.source && match.detail?.id
        ? { source: match.detail.source, id: match.detail.id }
        : undefined,
    };
  });
}

async function getFootballSnapshot(force = false): Promise<FootballSnapshot> {
  if (!force && cachedFootball && Date.now() - cachedFootball.fetchedAt < FOOTBALL_TTL_MS) {
    return cachedFootball;
  }
  if (footballInFlight) return footballInFlight;

  const request = fetch("/api/matches", { cache: "no-store" })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok || data.status === "error") {
        throw new Error("Live football data is temporarily unavailable.");
      }
      const snapshot: FootballSnapshot = {
        events: Array.isArray(data.response) ? footballEvents(data.response) : [],
        status: data.status === "unconfigured" ? "unconfigured" : "ready",
        updatedAt: data.updatedAt || null,
        message: data.status === "unconfigured"
          ? "Add the shared API-Sports key to the server environment."
          : undefined,
        fetchedAt: Date.now(),
      };
      cachedFootball = snapshot;
      storeFootball(snapshot);
      return snapshot;
    })
    .catch((error) => {
      console.warn("Live matches unavailable:", error);
      // A transient provider hiccup should not blank the football slate — keep
      // the last known matches for up to ten minutes.
      const previous = cachedFootball;
      const keepPrevious =
        !!previous &&
        previous.events.length > 0 &&
        Date.now() - previous.fetchedAt < KEEP_PREVIOUS_MS;
      const snapshot: FootballSnapshot = {
        events: keepPrevious && previous ? previous.events : [],
        status: "error",
        updatedAt: previous?.updatedAt ?? null,
        message: "Live football data is temporarily unavailable.",
        fetchedAt: Date.now(),
      };
      return snapshot;
    })
    .finally(() => {
      footballInFlight = null;
    });

  footballInFlight = request;
  return request;
}

async function getSportsSnapshot(force = false): Promise<SportsSnapshot> {
  if (!force && cachedSports && Date.now() - cachedSports.fetchedAt < SPORTS_TTL_MS) {
    return cachedSports;
  }
  if (sportsInFlight) return sportsInFlight;

  const request = fetch(
    force ? `/api/live-sports?refresh=${Date.now()}` : "/api/live-sports",
    { cache: "no-store" },
  )
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.feeds)) {
        throw new Error("Live sports could not be refreshed.");
      }
      const feeds = { ...initialFeeds };
      for (const feed of data.feeds as LiveSportFeed[]) {
        if (LIVE_SPORTS.includes(feed.sport)) feeds[feed.sport] = feed;
      }
      const snapshot: SportsSnapshot = {
        feeds,
        updatedAt: data.updatedAt || null,
        fetchedAt: Date.now(),
      };
      cachedSports = snapshot;
      return snapshot;
    })
    .catch((error) => {
      console.warn("Live sports unavailable:", error);
      return cachedSports ?? {
        feeds: makeInitialFeeds(),
        updatedAt: null,
        fetchedAt: Date.now(),
      };
    })
    .finally(() => {
      sportsInFlight = null;
    });

  sportsInFlight = request;
  return request;
}

export function useLiveSports() {
  const [football, setFootball] = useState<FootballSnapshot | null>(cachedFootball);
  const [sports, setSports] = useState<SportsSnapshot | null>(cachedSports);
  const [status, setStatus] = useState<LiveSportStatus | "loading">(
    cachedFootball || cachedSports ? "ready" : "loading"
  );
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async (automatic = false) => {
    if (!automatic) setRefreshing(true);
    // Both requests start together, but each result is applied as soon as it
    // arrives. Football therefore renders even when a slower sport times out.
    const footballPromise = getFootballSnapshot(!automatic).then((snapshot) => {
      setFootball(snapshot);
      setStatus(snapshot.status === "error" ? "error" : "ready");
    });
    const sportsPromise = getSportsSnapshot(!automatic).then((snapshot) => {
      setSports(snapshot);
      setStatus("ready");
    });
    await Promise.allSettled([footballPromise, sportsPromise]);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!cachedFootball) {
      const stored = readStoredFootball();
      if (stored) {
        cachedFootball = stored;
        setFootball(stored);
        setStatus("ready");
      }
    }
    void refresh(true);
    // The live feeds refresh server-side every 20 minutes; keep the client in
    // step without polling hard enough to burn a free provider quota.
    const interval = window.setInterval(() => void refresh(true), 20 * 60_000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const feeds = useMemo(() => {
    const base = sports?.feeds ?? initialFeeds;
    return {
      ...base,
      football: {
        sport: "football" as const,
        status: football?.status ?? "ready",
        events: football?.events ?? [],
        message: football?.message,
      },
    };
  }, [sports, football]);

  // Serious competitions first within each sport; sports stay grouped in
  // LIVE_SPORTS order, so football always leads the merged feed.
  const events = useMemo(
    () => LIVE_SPORTS.flatMap((sport) =>
      [...feeds[sport].events].sort(compareEventsByPriority)
    ),
    [feeds]
  );

  return {
    events,
    feeds,
    status,
    updatedAt: sports?.updatedAt || football?.updatedAt || null,
    refreshing,
    refresh,
  };
}
