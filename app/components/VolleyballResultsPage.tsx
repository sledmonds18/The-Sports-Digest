"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";
import type { LiveSportEvent } from "./lib/liveSportsData";

type ResultsStatus = "loading" | "ready" | "unconfigured" | "error";
const COMPLETED_STATUSES = new Set(["ft", "finished", "match finished", "final", "ended", "completed"]);

function isCompleted(event: LiveSportEvent): boolean {
  return COMPLETED_STATUSES.has(event.status.trim().toLowerCase());
}

function ResultCard({ event }: { event: LiveSportEvent }) {
  const date = event.date && !Number.isNaN(Date.parse(event.date))
    ? new Date(event.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    : "Recent match";
  const [home, away] = event.participants;

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          <span aria-hidden="true">🏐</span>
          <span>{event.competition}</span>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400">
          {date} · {event.status}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-5">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black text-gray-300">
            {home.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
          </span>
          <span className="text-sm font-bold text-white sm:text-base">{home}</span>
        </div>
        <div className="rounded-xl bg-white/5 px-4 py-3 text-center text-lg font-black tabular-nums text-white sm:text-xl">
          {event.score}
        </div>
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          {away ? (
            <>
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-black text-gray-300">
                {away.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <span className="text-sm font-bold text-white sm:text-base">{away}</span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-500">Opponent unavailable</span>
          )}
        </div>
      </div>
      {event.location && (
        <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">{event.location}</p>
      )}
    </article>
  );
}

export default function VolleyballResultsPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [events, setEvents] = useState<LiveSportEvent[]>([]);
  const [status, setStatus] = useState<ResultsStatus>("loading");
  const [competition, setCompetition] = useState("All competitions");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/live-sports?view=volleyball-results", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (data.status === "unconfigured") {
          setStatus("unconfigured");
          return;
        }
        if (!response.ok || data.status === "error") {
          throw new Error("Volleyball results are unavailable.");
        }
        setEvents(Array.isArray(data.response) ? data.response : []);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const completed = useMemo(
    () => events
      .filter((event) => event.sport === "volleyball" && isCompleted(event))
      .sort((first, second) => Date.parse(second.date || "") - Date.parse(first.date || "")),
    [events]
  );
  const competitions = useMemo(
    () => ["All competitions", ...Array.from(new Set(completed.map((event) => event.competition))).sort()],
    [completed]
  );
  const visibleResults = competition === "All competitions"
    ? completed
    : completed.filter((event) => event.competition === competition);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Volleyball Results</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">
            Catch up on completed matches and final scores from volleyball competitions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("live-volleyball")}
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Live Volleyball <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Final scores</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Last seven days</h2>
          </div>
          {completed.length > 0 && (
            <label className="flex items-center gap-3 text-xs font-bold text-gray-400">
              Competition
              <select
                value={competition}
                onChange={(event) => setCompetition(event.target.value)}
                className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              >
                {competitions.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
          )}
        </div>

        {status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">
            Loading recent results…
          </div>
        ) : status === "unconfigured" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">Results aren’t connected yet</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Add the server environment variable <code className="text-gray-200">API_VOLLEYBALL_KEY</code> locally and in Vercel to load real match results.
            </p>
          </div>
        ) : status === "error" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">Results are temporarily unavailable</h3>
            <p className="mt-2 text-sm text-gray-400">Please try again later.</p>
          </div>
        ) : visibleResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">No completed matches found</h3>
            <p className="mt-2 text-sm text-gray-400">There are no completed volleyball matches in the provider feed for the past seven days.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visibleResults.map((event) => <ResultCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      <SportsDeskFooter
        desk="Volleyball Results Desk"
        description="Final scores and completed volleyball matches from Ghana and around the world."
        onNavigate={onNavigate}
      />
    </main>
  );
}
