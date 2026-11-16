"use client";

import SportsDeskFooter from "./SportsDeskFooter";
import { useLiveSports } from "./lib/useLiveSports";

export default function LiveVolleyballPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const { feeds, status, updatedAt, refreshing, refresh } = useLiveSports();
  const feed = feeds.volleyball;
  const matches = feed.events.filter((event) => event.sport === "volleyball");
  const unavailable = feed.status === "error" || (status === "error" && matches.length === 0);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Live Volleyball</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">
                Live scores from volleyball competitions, updated automatically.
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
              {matches.length} live {matches.length === 1 ? "match" : "matches"}
            </span>
            {updatedAt && (
              <span>Updated {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            )}
            {status === "error" && <span className="text-amber-300">Could not refresh live scores.</span>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Live now</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Match scores</h2>
        </div>

        {status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">
            Loading live scores…
          </div>
        ) : unavailable ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">Live scores are temporarily unavailable</h3>
            <p className="mt-2 text-sm text-gray-400">Please try refreshing in a moment.</p>
          </div>
        ) : feed.status === "unconfigured" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">Live scores aren’t connected yet</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Add your API Sports key as the server environment variable <code className="text-gray-200">API_VOLLEYBALL_KEY</code>.
              The live centre will show matches once the volleyball feed is connected.
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">No volleyball matches are live right now</h3>
            <p className="mt-2 text-sm text-gray-400">Check back when matches are underway.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((match) => (
              <article key={match.id} className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Volleyball</p>
                    <p className="mt-1 text-xs font-bold text-gray-300">{match.competition}</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    {match.status} · Live
                  </span>
                </div>
                <div className="py-6 text-center">
                  <p className="text-sm font-bold text-white sm:text-base">{match.participants.join(" vs ")}</p>
                  <p className="mt-3 text-3xl font-black tabular-nums text-white">{match.score}</p>
                  {match.location && <p className="mt-3 text-xs text-gray-500">{match.location}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <SportsDeskFooter
        desk="Live Volleyball Centre"
        description="Live volleyball scores and match updates."
        onNavigate={onNavigate}
      />
    </main>
  );
}
