"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";
import type { LiveMatch } from "./lib/useLiveMatches";

type FixturesStatus = "loading" | "ready" | "unconfigured" | "error";

function TeamBadge({ name, logo }: { name: string; logo?: string }) {
  const [failed, setFailed] = useState(false);
  return logo && !failed
    ? <img src={logo} alt="" onError={() => setFailed(true)} className="h-9 w-9 object-contain" />
    : <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-gray-300">{name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</span>;
}

function FixtureCard({ match }: { match: LiveMatch }) {
  const kickoff = new Date(match.fixture.date);
  const time = kickoff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const matchDate = kickoff.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  const status = match.fixture.status.short;
  const statusLabel = status === "PST" ? "Postponed" : status === "CANC" ? "Cancelled" : time;

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
          {match.league.logo && <img src={match.league.logo} alt="" className="h-5 w-5 object-contain" />}
          <span>{match.league.name}</span>
          {match.league.country && <span className="text-gray-600">· {match.league.country}</span>}
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-300">{matchDate} · {statusLabel}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-5">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamBadge name={match.teams.home.name} logo={match.teams.home.logo} />
          <span className="text-sm font-bold text-white sm:text-base">{match.teams.home.name}</span>
        </div>
        <span className="rounded-lg border border-white/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-gray-300">vs</span>
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <TeamBadge name={match.teams.away.name} logo={match.teams.away.logo} />
          <span className="text-sm font-bold text-white sm:text-base">{match.teams.away.name}</span>
        </div>
      </div>
      {match.fixture.venue?.name && <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">{match.fixture.venue.name}{match.fixture.venue.city ? ` · ${match.fixture.venue.city}` : ""}</p>}
    </article>
  );
}

export default function FixturesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [status, setStatus] = useState<FixturesStatus>("loading");
  const [competition, setCompetition] = useState("All competitions");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/matches?view=fixtures", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.status === "error") throw new Error("Fixtures unavailable.");
        setMatches(Array.isArray(data.response) ? data.response : []);
        setStatus(data.status === "unconfigured" ? "unconfigured" : "ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, []);

  const upcoming = useMemo(() => matches
    .filter((match) => new Date(match.fixture.date).getTime() >= Date.now() && ["NS", "TBD", "PST", "CANC"].includes(match.fixture.status.short))
    .sort((first, second) => new Date(first.fixture.date).getTime() - new Date(second.fixture.date).getTime()), [matches]);
  const competitions = useMemo(() => ["All competitions", ...Array.from(new Set(upcoming.map((match) => match.league.name))).sort(),], [upcoming]);
  const visibleFixtures = competition === "All competitions" ? upcoming : upcoming.filter((match) => match.league.name === competition);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Football Fixtures</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">See upcoming matches from Ghana and football competitions around the world for the next seven days.</p>
          <button type="button" onClick={() => onNavigate("live")} className="mt-6 rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500 hover:bg-red-600">Go to Live Football <span aria-hidden="true">→</span></button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Coming up</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Next seven days</h2></div>
          {upcoming.length > 0 && <label className="flex items-center gap-3 text-xs font-bold text-gray-400">Competition<select value={competition} onChange={(event) => setCompetition(event.target.value)} className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white">{competitions.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>}
        </div>

        {status === "loading" ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading upcoming fixtures…</div>
        ) : status === "unconfigured" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Fixtures aren’t connected yet</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add the server environment variable <code className="text-gray-200">API_SPORTS_KEY</code> locally and in Vercel to load real fixtures.</p></div>
        ) : status === "error" ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Fixtures are temporarily unavailable</h3><p className="mt-2 text-sm text-gray-400">Please try again later.</p></div>
        ) : visibleFixtures.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">No upcoming fixtures found</h3><p className="mt-2 text-sm text-gray-400">There are no scheduled matches in the provider feed for the next seven days.</p></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">{visibleFixtures.map((match) => <FixtureCard key={match.fixture.id} match={match} />)}</div>
        )}
      </section>

      <SportsDeskFooter desk="Football Fixtures Desk" description="Upcoming football match schedules from Ghana and around the world." onNavigate={onNavigate} />
    </main>
  );
}
