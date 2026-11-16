"use client";

import { useState } from "react";
import { LIVE_SPORT_ICONS, LIVE_SPORT_LABELS, interleaveBySport, type LiveSportEvent } from "./lib/liveSportsData";
import { useLiveSports } from "./lib/useLiveSports";
import TeamCrest from "./TeamCrest";
import LiveEventDetail from "./LiveEventDetail";

export function LiveBar({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { events, status } = useLiveSports();
  const [selectedEvent, setSelectedEvent] = useState<LiveSportEvent | null>(null);
  // Mixed slate: football leads, but basketball/handball etc. keep their slots.
  const visibleEvents = interleaveBySport(events, 6);

  return (
    <section className="mx-auto max-w-7xl px-5 py-8 text-white sm:px-8 lg:px-10" aria-labelledby="live-sports-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-400">Match Centre · Ghana &amp; Worldwide</p>
          <h2 id="live-sports-heading" className="mt-2 text-2xl font-black sm:text-3xl">Live Sports</h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("live-sports")}
          className="rounded-lg border border-red-500/40 bg-red-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-red-500"
        >
          View all live events <span aria-hidden="true">→</span>
        </button>
      </div>

      {visibleEvents.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <button
              key={`${event.sport}-${event.id}`}
              type="button"
              onClick={() => setSelectedEvent(event)}
              className="block w-full cursor-pointer rounded-xl border border-white/10 bg-zinc-950 p-4 text-left transition hover:border-red-500/50"
              title="Open match details"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[10px] font-black uppercase tracking-widest text-red-400">
                  {LIVE_SPORT_ICONS[event.sport]} {LIVE_SPORT_LABELS[event.sport]} · {event.competition}
                </p>
                <span className="shrink-0 text-xs font-bold text-red-300">{event.status}</span>
              </div>
              <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <TeamCrest name={event.participants[0]} logo={event.logos?.[0]} className="h-7 w-7" />
                  <span className="truncate text-sm font-bold text-white">{event.participants[0]}</span>
                </div>
                <span className="font-black tabular-nums text-white">{event.score}</span>
                {event.participants[1] ? (
                  <div className="flex min-w-0 items-center justify-end gap-2">
                    <span className="truncate text-right text-sm font-bold text-white">{event.participants[1]}</span>
                    <TeamCrest name={event.participants[1]} logo={event.logos?.[1]} className="h-7 w-7" />
                  </div>
                ) : (
                  <span />
                )}
              </div>
              <p className="mt-3 border-t border-white/10 pt-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Match details <span aria-hidden="true">→</span>
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-white/10 bg-zinc-950 p-4 text-sm text-gray-400">
          {status === "loading" ? "Checking live scores…" : "No live events are available right now."}
        </p>
      )}

      <LiveEventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}
