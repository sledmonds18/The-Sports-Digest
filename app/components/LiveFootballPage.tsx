"use client";

import { useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";
import { useLiveMatches } from "./lib/useLiveMatches";
import type { LiveMatch } from "./lib/useLiveMatches";

function TeamMark({ name, logo }: { name: string; logo?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  return logo && !imageFailed ? (
    <img src={logo} alt="" onError={() => setImageFailed(true)} className="h-10 w-10 object-contain" />
  ) : (
    <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-black text-gray-300">
      {name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
    </span>
  );
}

function MatchScoreCard({ match }: { match: LiveMatch }) {
  const minute = match.fixture.status.elapsed;
  const status = match.fixture.status.short;
  const timeLabel = minute != null ? `${minute}′` : status;
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          {match.league.logo && <img src={match.league.logo} alt="" className="h-5 w-5 object-contain" />}
          <span>{match.league.name}</span>
          {match.league.country && <span className="text-gray-600">· {match.league.country}</span>}
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          {timeLabel} · Live
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-6">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamMark name={match.teams.home.name} logo={match.teams.home.logo} />
          <span className="text-sm font-bold text-white sm:text-base">{match.teams.home.name}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-2xl font-black tabular-nums text-white sm:text-3xl">
          <span>{match.goals.home ?? 0}</span><span className="text-gray-600">:</span><span>{match.goals.away ?? 0}</span>
        </div>
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamMark name={match.teams.away.name} logo={match.teams.away.logo} />
          <span className="text-sm font-bold text-white sm:text-base">{match.teams.away.name}</span>
        </div>
      </div>

      {(match.fixture.venue?.name || match.fixture.venue?.city) && (
        <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">
          {[match.fixture.venue.name, match.fixture.venue.city].filter(Boolean).join(" · ")}
        </p>
      )}
    </article>
  );
}

export default function LiveFootballPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { matches, status, updatedAt, refreshing, refresh } = useLiveMatches();
  const [competition, setCompetition] = useState("All competitions");
  const competitions = useMemo(() => ["All competitions", ...Array.from(new Set(matches.map((match) => match.league.name))).sort()], [matches]);
  const visibleMatches = useMemo(() => competition === "All competitions" ? matches : matches.filter((match) => match.league.name === competition), [competition, matches]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Live Football</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">Live scores from Ghana and football competitions around the world, updated automatically every 30 seconds.</p>
            </div>
            <button type="button" onClick={() => void refresh()} disabled={refreshing} className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500 disabled:opacity-60">
              {refreshing ? "Refreshing…" : "Refresh scores"}
            </button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-300"><span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />{matches.length} live {matches.length === 1 ? "match" : "matches"}</span>
            {updatedAt && <span>Updated {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
            {status === "error" && <span className="text-amber-300">Could not refresh live scores.</span>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Live now</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Match scores</h2>
          </div>
          {matches.length > 0 && (
            <label className="flex items-center gap-3 text-xs font-bold text-gray-400">
              Competition
              <select value={competition} onChange={(event) => setCompetition(event.target.value)} className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white">
                {competitions.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
          )}
        </div>

        {status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading live scores…</div>
        ) : status === "unconfigured" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">Live scores aren’t connected yet</h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add your API Sports key as the server environment variable <code className="text-gray-200">API_SPORTS_KEY</code> in your local environment and Vercel. This page will then show verified live match data.</p>
          </div>
        ) : status === "error" && matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">Live scores are temporarily unavailable</h3>
            <p className="mt-2 text-sm text-gray-400">Please try refreshing in a moment.</p>
          </div>
        ) : visibleMatches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">No matches are live right now</h3>
            <p className="mt-2 text-sm text-gray-400">The live centre checks again automatically. Check back when matches are underway.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">{visibleMatches.map((match) => <MatchScoreCard key={match.fixture.id} match={match} />)}</div>
        )}
      </section>

      <SportsDeskFooter desk="Live Football Centre" description="Live football scores and match updates from Ghana and around the world." onNavigate={onNavigate} />
    </main>
  );
}
