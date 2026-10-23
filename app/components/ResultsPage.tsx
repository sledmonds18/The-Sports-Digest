"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";
import type { LiveMatch } from "./lib/useLiveMatches";

type ResultsStatus = "loading" | "ready" | "unconfigured" | "error";
const FINISHED_STATUSES = new Set(["FT", "AET", "PEN", "AWD", "WO"]);

function TeamBadge({ name, logo }: { name: string; logo?: string }) {
  const [failed, setFailed] = useState(false);
  return logo && !failed
    ? <img src={logo} alt="" onError={() => setFailed(true)} className="h-9 w-9 object-contain" />
    : <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-gray-300">{name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</span>;
}

function ResultCard({ match }: { match: LiveMatch }) {
  const date = new Date(match.fixture.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const status = match.fixture.status.short;
  const finalLabel = status === "AET" ? "After Extra Time" : status === "PEN" ? "Penalties" : "Full Time";
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          {match.league.logo && <img src={match.league.logo} alt="" className="h-5 w-5 object-contain" />}
          <span>{match.league.name}</span>
          {match.league.country && <span className="text-gray-600">· {match.league.country}</span>}
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400">{date} · {finalLabel}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-5">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge name={match.teams.home.name} logo={match.teams.home.logo} /><span className="text-sm font-bold text-white sm:text-base">{match.teams.home.name}</span></div>
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-2xl font-black tabular-nums text-white sm:text-3xl"><span>{match.goals.home ?? "–"}</span><span className="text-gray-600">:</span><span>{match.goals.away ?? "–"}</span></div>
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge name={match.teams.away.name} logo={match.teams.away.logo} /><span className="text-sm font-bold text-white sm:text-base">{match.teams.away.name}</span></div>
      </div>
      {match.fixture.venue?.name && <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">{match.fixture.venue.name}{match.fixture.venue.city ? ` · ${match.fixture.venue.city}` : ""}</p>}
    </article>
  );
}

export default function ResultsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [status, setStatus] = useState<ResultsStatus>("loading");
  const [competition, setCompetition] = useState("All competitions");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/matches?view=results", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.status === "error") throw new Error("Results unavailable.");
        setMatches(Array.isArray(data.response) ? data.response : []);
        setStatus(data.status === "unconfigured" ? "unconfigured" : "ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const completed = useMemo(() => matches
    .filter((match) => FINISHED_STATUSES.has(match.fixture.status.short))
    .sort((first, second) => new Date(second.fixture.date).getTime() - new Date(first.fixture.date).getTime()), [matches]);
  const competitions = useMemo(() => ["All competitions", ...Array.from(new Set(completed.map((match) => match.league.name))).sort()], [completed]);
  const visibleResults = competition === "All competitions" ? completed : completed.filter((match) => match.league.name === competition);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Football Results</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">Catch up on completed matches and final scores from Ghana and football competitions around the world.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate("live")} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">Live Football <span aria-hidden="true">→</span></button>
            <button type="button" onClick={() => onNavigate("fixtures")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">Upcoming Fixtures <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Final scores</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Last seven days</h2></div>
          {completed.length > 0 && <label className="flex items-center gap-3 text-xs font-bold text-gray-400">Competition<select value={competition} onChange={(event) => setCompetition(event.target.value)} className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white">{competitions.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>}
        </div>

        {status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading recent results…</div>
        ) : status === "unconfigured" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Results aren’t connected yet</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add the server environment variable <code className="text-gray-200">API_SPORTS_KEY</code> locally and in Vercel to load real match results.</p></div>
        ) : status === "error" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Results are temporarily unavailable</h3><p className="mt-2 text-sm text-gray-400">Please try again later.</p></div>
        ) : visibleResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">No completed matches found</h3><p className="mt-2 text-sm text-gray-400">There are no completed matches in the provider feed for the past seven days.</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">{visibleResults.map((match) => <ResultCard key={match.fixture.id} match={match} />)}</div>
        )}
      </section>

      <SportsDeskFooter desk="Football Results Desk" description="Final scores and completed football matches from Ghana and around the world." onNavigate={onNavigate} />
    </main>
  );
}
