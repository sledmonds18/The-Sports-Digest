"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";

type LeagueOption = { id: number; name: string };
type LeagueSeason = { year: number; current?: boolean; coverage?: { standings?: boolean } };
type StandingRow = {
  rank: number;
  team: { id: number; name: string; logo?: string };
  points: number;
  goalsDiff: number;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  form?: string | null;
  group?: string | null;
  description?: string | null;
};
type StandingsGroup = { league?: { name?: string; country?: string; logo?: string; season?: number; standings?: StandingRow[][] } };
type PageStatus = "loading" | "ready" | "unconfigured" | "error";

// API-Football league IDs are stable between seasons. Season values are the
// starting year used by the provider, including calendar-year MLS seasons.
const LEAGUES: LeagueOption[] = [
  { id: 233, name: "Ghana Premier League" },
  { id: 39, name: "Premier League" },
  { id: 2, name: "UEFA Champions League" },
  { id: 140, name: "La Liga" },
  { id: 78, name: "Bundesliga" },
  { id: 135, name: "Serie A" },
  { id: 61, name: "Ligue 1" },
  { id: 253, name: "MLS" },
];

function TeamCrest({ team }: { team: StandingRow["team"] }) {
  const [failed, setFailed] = useState(false);
  return team.logo && !failed
    ? <img src={team.logo} alt="" onError={() => setFailed(true)} className="h-7 w-7 shrink-0 object-contain" />
    : <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[9px] font-black text-gray-300">{team.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>;
}

export default function StandingsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [leagueId, setLeagueId] = useState(LEAGUES[0].id);
  const [season, setSeason] = useState(2026);
  const [seasons, setSeasons] = useState<LeagueSeason[]>([]);
  const [seasonsStatus, setSeasonsStatus] = useState<PageStatus>("loading");
  const [groups, setGroups] = useState<StandingsGroup[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const league = LEAGUES.find((item) => item.id === leagueId) ?? LEAGUES[0];

  useEffect(() => {
    const controller = new AbortController();
    setSeasonsStatus("loading");
    fetch(`/api/matches?view=seasons&league=${leagueId}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.status === "error") throw new Error("Seasons unavailable");
        const available = (Array.isArray(data.response) ? data.response : []) as LeagueSeason[];
        setSeasons(available);
        const seasonsWithStandings = available.filter((item) => item.coverage?.standings !== false);
        const defaultSeason = seasonsWithStandings.find((item) => item.current) ?? seasonsWithStandings[0];
        if (defaultSeason) setSeason(defaultSeason.year);
        setSeasonsStatus(data.status === "unconfigured" ? "unconfigured" : "ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSeasonsStatus("error");
      });
    return () => controller.abort();
  }, [leagueId]);

  const seasonsWithStandings = seasons
    .filter((item) => item.coverage?.standings !== false)
    .sort((first, second) => second.year - first.year);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(`/api/matches?view=standings&league=${leagueId}&season=${season}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.status === "error") throw new Error("Standings unavailable");
        setGroups(Array.isArray(data.response) ? data.response : []);
        setUpdatedAt(data.updatedAt ?? null);
        setStatus(data.status === "unconfigured" ? "unconfigured" : "ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [leagueId, season]);

  const tables = useMemo(() => groups.flatMap((item) => {
    const nested = item.league?.standings ?? [];
    return nested.map((rows, index) => ({
      label: nested.length > 1 ? rows[0]?.group || `Group ${String.fromCharCode(65 + index)}` : item.league?.name || league.name,
      rows,
    }));
  }), [groups, league.name]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Football Standings</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">Follow the table, points and goal difference across Ghana and the major international competitions.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate("live")} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">Live Football <span aria-hidden="true">→</span></button>
            <button type="button" onClick={() => onNavigate("fixtures")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">Upcoming Fixtures <span aria-hidden="true">→</span></button>
            <button type="button" onClick={() => onNavigate("results")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">Recent Results <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">League table</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{league.name}</h2></div>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-3 text-xs font-bold text-gray-400">Competition
              <select value={leagueId} onChange={(event) => setLeagueId(Number(event.target.value))} className="max-w-[220px] rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white">
                {LEAGUES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 text-xs font-bold text-gray-400">Season
              <select value={season} disabled={seasonsStatus !== "ready" || seasonsWithStandings.length === 0} onChange={(event) => setSeason(Number(event.target.value))} className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white disabled:opacity-50">
                {seasonsStatus === "loading" ? <option value={season}>Loading seasons…</option> : seasonsStatus === "unconfigured" ? <option value={season}>API key required</option> : seasonsStatus === "error" ? <option value={season}>Couldn’t load seasons</option> : seasonsWithStandings.length === 0 ? <option value={season}>No seasons available</option> : seasonsWithStandings.map((item) => <option key={item.year} value={item.year}>{item.year}{leagueId === 253 ? "" : `/${String(item.year + 1).slice(-2)}`}{item.current ? " · Current" : ""}</option>)}
              </select>
            </label>
          </div>
        </div>

        {seasonsStatus === "error" && <p className="mb-5 text-sm text-amber-300">Couldn’t load seasons from the football data provider. Check that the API key is valid and the provider is responding, then refresh.</p>}

        {status === "loading" ? <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading the table…</div>
          : status === "unconfigured" ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Standings aren’t connected yet</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add the server environment variable <code className="text-gray-200">API_SPORTS_KEY</code> locally and in Vercel to load standings.</p></div>
          : status === "error" ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Standings are temporarily unavailable</h3><p className="mt-2 text-sm text-gray-400">Please try again later.</p></div>
          : tables.length === 0 || tables.every((table) => table.rows.length === 0) ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">No table available for this season</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">The provider has no standings published for {league.name} in {season}. Try another season or competition.</p></div>
          : <div className="space-y-8">{tables.map((table, tableIndex) => (
            <section key={`${table.label}-${tableIndex}`} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              {tables.length > 1 && <h3 className="border-b border-white/10 px-5 py-4 text-lg font-black">{table.label}</h3>}
              <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-white/[0.04] text-[10px] uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-3">Pos</th><th className="px-4 py-3">Club</th><th className="px-3 py-3 text-center">P</th><th className="px-3 py-3 text-center">W</th><th className="px-3 py-3 text-center">D</th><th className="px-3 py-3 text-center">L</th><th className="px-3 py-3 text-center">GF</th><th className="px-3 py-3 text-center">GA</th><th className="px-3 py-3 text-center">GD</th><th className="px-4 py-3 text-center">Pts</th><th className="px-4 py-3">Form</th></tr></thead>
                <tbody className="divide-y divide-white/[0.06]">{table.rows.map((row) => <tr key={row.team.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-bold text-gray-400">{row.rank}</td><td className="px-4 py-3"><div className="flex items-center gap-3"><TeamCrest team={row.team} /><span className="font-bold text-white">{row.team.name}</span></div></td>
                  <td className="px-3 py-3 text-center text-gray-300">{row.all.played}</td><td className="px-3 py-3 text-center text-gray-300">{row.all.win}</td><td className="px-3 py-3 text-center text-gray-300">{row.all.draw}</td><td className="px-3 py-3 text-center text-gray-300">{row.all.lose}</td><td className="px-3 py-3 text-center text-gray-300">{row.all.goals.for}</td><td className="px-3 py-3 text-center text-gray-300">{row.all.goals.against}</td><td className="px-3 py-3 text-center text-gray-300">{row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}</td><td className="px-4 py-3 text-center font-black text-white">{row.points}</td><td className="px-4 py-3"><div className="flex gap-1">{(row.form || "").slice(-5).split("").map((result, index) => <span key={`${row.team.id}-${index}`} title={result} className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-black ${result === "W" ? "bg-emerald-500/20 text-emerald-400" : result === "D" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{result}</span>)}</div></td>
                </tr>)}</tbody>
              </table></div>
            </section>
          ))}</div>}
        {status === "ready" && updatedAt && <p className="mt-4 text-right text-xs text-gray-600">Data supplied by API-Football · Updated {new Date(updatedAt).toLocaleString()}</p>}
      </section>
      <SportsDeskFooter desk="Football Standings Desk" description="League tables and team rankings from Ghana and international football." onNavigate={onNavigate} />
    </main>
  );
}
