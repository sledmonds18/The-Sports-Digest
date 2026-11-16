"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";
import TeamCrest from "./TeamCrest";
import LiveEventDetail from "./LiveEventDetail";
import {
  LIVE_SPORTS,
  LIVE_SPORT_ICONS,
  LIVE_SPORT_LABELS,
  type LiveSport,
  type LiveSportEvent,
} from "./lib/liveSportsData";
import { useLiveSports } from "./lib/useLiveSports";

function LiveEventCard({
  event,
  onOpen,
}: {
  event: ReturnType<typeof useLiveSports>["events"][number];
  onOpen: (event: LiveSportEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      className="block w-full cursor-pointer rounded-2xl border border-white/10 bg-zinc-950 p-5 text-left transition hover:border-red-500/50 sm:p-6"
      title="Open match details"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
            {LIVE_SPORT_ICONS[event.sport]} {LIVE_SPORT_LABELS[event.sport]}
          </p>
          <p className="mt-1 text-xs font-bold text-gray-300">{event.competition}</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          {event.status}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamCrest name={event.participants[0]} logo={event.logos?.[0]} className="h-11 w-11" />
          <span className="text-sm font-bold text-white sm:text-base">{event.participants[0]}</span>
        </div>
        <p className="rounded-xl bg-white/5 px-4 py-3 text-3xl font-black tabular-nums text-white">{event.score}</p>
        {event.participants[1] ? (
          <div className="flex min-w-0 flex-col items-center gap-3 text-center">
            <TeamCrest name={event.participants[1]} logo={event.logos?.[1]} className="h-11 w-11" />
            <span className="text-sm font-bold text-white sm:text-base">{event.participants[1]}</span>
          </div>
        ) : (
          <span />
        )}
      </div>
      {event.location && <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">{event.location}</p>}
      <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Match details <span aria-hidden="true">→</span>
      </p>
    </button>
  );
}

export default function LiveSportsPage({
  onNavigate,
  initialSport,
}: {
  onNavigate: (page: string) => void;
  initialSport?: LiveSport;
}) {
  const { events, feeds, status, updatedAt, refreshing, refresh } = useLiveSports();
  const [selectedSport, setSelectedSport] = useState<LiveSport | "all">(initialSport || "all");
  const [selectedEvent, setSelectedEvent] = useState<LiveSportEvent | null>(null);
  useEffect(() => {
    setSelectedSport(initialSport || "all");
  }, [initialSport]);
  const visibleEvents = useMemo(
    () => events.filter((event) => selectedSport === "all" || event.sport === selectedSport),
    [events, selectedSport]
  );
  const title = selectedSport === "all" ? "Live Sports" : `Live ${LIVE_SPORT_LABELS[selectedSport]}`;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-300">
                Live scores and event updates from football, basketball, baseball, NBA, NFL, volleyball and handball.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={refreshing}
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500 disabled:opacity-60"
            >
              {refreshing ? "Refreshing…" : "Refresh scores"}
            </button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              {visibleEvents.length} live {visibleEvents.length === 1 ? "event" : "events"}
            </span>
            {updatedAt && <span>Updated {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
            <span>Automatic refresh every 20 minutes</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2" aria-label="Filter live events by sport">
          <button
            type="button"
            onClick={() => setSelectedSport("all")}
            aria-pressed={selectedSport === "all"}
            className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider ${selectedSport === "all" ? "border-red-500 bg-red-600 text-white" : "border-white/15 text-gray-300 hover:border-red-500"}`}
          >
            All Sports
          </button>
          {LIVE_SPORTS.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => setSelectedSport(sport)}
              aria-pressed={selectedSport === sport}
              className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider ${selectedSport === sport ? "border-red-500 bg-red-600 text-white" : "border-white/15 text-gray-300 hover:border-red-500"}`}
            >
              {LIVE_SPORT_ICONS[sport]} {LIVE_SPORT_LABELS[sport]}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {visibleEvents.length > 0 ? (
            selectedSport === "all" ? (
              LIVE_SPORTS.map((sport) => {
                const sportEvents = feeds[sport].events;
                if (sportEvents.length === 0) return null;
                return (
                  <div key={sport} className="mt-10 first:mt-0">
                    <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-red-400">
                      <span aria-hidden="true" className="text-base">{LIVE_SPORT_ICONS[sport]}</span>
                      Live {LIVE_SPORT_LABELS[sport]}
                      <span className="text-gray-500">· {sportEvents.length}</span>
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {sportEvents.map((event) => <LiveEventCard key={`${event.sport}-${event.id}`} event={event} onOpen={setSelectedEvent} />)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visibleEvents.map((event) => <LiveEventCard key={`${event.sport}-${event.id}`} event={event} onOpen={setSelectedEvent} />)}
              </div>
            )
          ) : status === "loading" ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading live scores…</div>
          ) : selectedSport !== "all" && feeds[selectedSport].status === "unsupported" ? (
            <div className="rounded-2xl border border-dashed border-amber-500/30 bg-zinc-950 p-10 text-center">
              <h2 className="text-lg font-bold">{LIVE_SPORT_LABELS[selectedSport]} live data is not connected</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">{feeds[selectedSport].message}</p>
            </div>
          ) : selectedSport !== "all" && feeds[selectedSport].status === "error" ? (
            <div className="rounded-2xl border border-dashed border-red-500/30 bg-zinc-950 p-10 text-center">
              <h2 className="text-lg font-bold">{LIVE_SPORT_LABELS[selectedSport]} data is temporarily unavailable</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">{feeds[selectedSport].message}</p>
            </div>
          ) : selectedSport !== "all" && feeds[selectedSport].status === "unconfigured" ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
              <h2 className="text-lg font-bold">{LIVE_SPORT_LABELS[selectedSport]} scores are not connected yet</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add the shared API-Sports key as <code className="text-gray-200">API_SPORTS_KEY</code> in the server environment and confirm the sport is active on your plan.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
              <h2 className="text-lg font-bold">No live events are available right now</h2>
              <p className="mt-2 text-sm text-gray-400">The live centre checks again automatically. Check back when events are underway.</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Feed status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {LIVE_SPORTS.map((sport) => (
              <span
                key={sport}
                title={feeds[sport].message || `${feeds[sport].events.length} live events`}
                className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  feeds[sport].status === "ready"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : feeds[sport].status === "unsupported"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                      : feeds[sport].status === "error"
                        ? "border-red-500/30 bg-red-500/10 text-red-300"
                        : "border-white/10 bg-white/5 text-gray-400"
                }`}
              >
                {LIVE_SPORT_LABELS[sport]} · {feeds[sport].status === "ready" ? `${feeds[sport].events.length} live` : feeds[sport].status}
              </span>
            ))}
          </div>
        </div>
      </section>

      <LiveEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <SportsDeskFooter desk="Live Sports Centre" description="Live sports scores and event updates from Ghana and around the world." onNavigate={onNavigate} />
    </main>
  );
}
