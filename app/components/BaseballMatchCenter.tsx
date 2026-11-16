"use client";

import { useEffect, useMemo, useState } from "react";
import SportsDeskFooter from "./SportsDeskFooter";

type BaseballView = "fixtures" | "results" | "standings";
type PageStatus = "loading" | "ready" | "unconfigured" | "season_unavailable" | "error";
type BaseballTeam = { id?: number; name?: string; logo?: string };
type BaseballGame = {
  id?: number;
  date?: string;
  week?: string | number;
  status?: string | { short?: string; long?: string };
  teams?: { home?: BaseballTeam; away?: BaseballTeam };
  scores?: {
    home?: { total?: number | null; hits?: number | null; innings?: Record<string, number | null> };
    away?: { total?: number | null; hits?: number | null; innings?: Record<string, number | null> };
  };
  league?: { name?: string };
  venue?: { name?: string; city?: string };
};
type Standing = {
  rank?: number;
  group: string;
  team: BaseballTeam;
  played?: number;
  wins?: number;
  losses?: number;
  winPercentage?: string;
  runsFor?: number;
  runsAgainst?: number;
  form?: string;
};

function readName(value: unknown): string {
  if (typeof value === "string") return value;
  return value !== null && typeof value === "object" && "name" in value && typeof value.name === "string"
    ? value.name
    : "";
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function readRows(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value !== null && typeof value === "object" && "response" in value && Array.isArray(value.response)) {
    return value.response;
  }
  return [];
}

function normalizeGame(value: unknown): BaseballGame | null {
  if (value === null || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const game = row.game !== null && typeof row.game === "object"
    ? row.game as Record<string, unknown>
    : row;
  const teams = row.teams !== null && typeof row.teams === "object"
    ? row.teams as BaseballGame["teams"]
    : undefined;
  const dateValue = game.date;
  const date = typeof dateValue === "string"
    ? dateValue
    : dateValue !== null && typeof dateValue === "object" && "timestamp" in dateValue && typeof dateValue.timestamp === "number"
      ? new Date(dateValue.timestamp * 1000).toISOString()
      : undefined;
  if (!date || !teams?.home?.name || !teams.away?.name) return null;

  return {
    id: typeof game.id === "number" ? game.id : undefined,
    date,
    status: typeof game.status === "string" || (game.status !== null && typeof game.status === "object")
      ? game.status as BaseballGame["status"]
      : undefined,
    teams,
    scores: row.scores !== null && typeof row.scores === "object"
      ? row.scores as BaseballGame["scores"]
      : undefined,
    league: row.league !== null && typeof row.league === "object"
      ? row.league as BaseballGame["league"]
      : undefined,
    venue: game.venue !== null && typeof game.venue === "object"
      ? game.venue as BaseballGame["venue"]
      : undefined,
  };
}

function flattenStandings(value: unknown, inheritedGroup = "", output: Standing[] = []): Standing[] {
  if (Array.isArray(value)) {
    for (const item of value) flattenStandings(item, inheritedGroup, output);
    return output;
  }
  if (value === null || typeof value !== "object") return output;

  const row = value as Record<string, unknown>;
  const team = row.team !== null && typeof row.team === "object"
    ? row.team as BaseballTeam
    : undefined;
  const games = row.games !== null && typeof row.games === "object"
    ? row.games as Record<string, unknown>
    : {};
  const wins = games.win !== null && typeof games.win === "object"
    ? games.win as Record<string, unknown>
    : {};
  const losses = games.lose !== null && typeof games.lose === "object"
    ? games.lose as Record<string, unknown>
    : {};
  const points = row.points !== null && typeof row.points === "object"
    ? row.points as Record<string, unknown>
    : {};
  const group = readName(row.group) || inheritedGroup;

  if (team?.name) {
    output.push({
      rank: readNumber(row.position),
      group,
      team,
      played: readNumber(games.played),
      wins: readNumber(wins.total),
      losses: readNumber(losses.total),
      winPercentage: typeof wins.percentage === "string" ? wins.percentage : undefined,
      runsFor: readNumber(points.for),
      runsAgainst: readNumber(points.against),
      form: typeof row.form === "string" ? row.form : undefined,
    });
    return output;
  }

  for (const [key, nested] of Object.entries(row)) {
    flattenStandings(nested, readName({ name: key }) || group, output);
  }
  return output;
}

function teamInitials(name: string) {
  return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function TeamBadge({ team }: { team?: BaseballTeam }) {
  const [failed, setFailed] = useState(false);
  const name = team?.name || "Team";
  return team?.logo && !failed
    ? <img src={team.logo} alt="" onError={() => setFailed(true)} className="h-9 w-9 shrink-0 object-contain" />
    : <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-gray-300">{teamInitials(name)}</span>;
}

function gameStatus(game: BaseballGame): string {
  return typeof game.status === "string" ? game.status : game.status?.long || game.status?.short || "";
}

function isFinished(game: BaseballGame): boolean {
  return /(final|finished|complete|ended|^ft$)/i.test(gameStatus(game));
}

function isInProgress(game: BaseballGame): boolean {
  return /(live|progress|inning|^in$)/i.test(gameStatus(game));
}

function GameCard({ game, showScore }: { game: BaseballGame; showScore: boolean }) {
  const date = game.date ? new Date(game.date) : null;
  const validDate = date && !Number.isNaN(date.getTime()) ? date : null;
  const home = game.teams?.home || {};
  const away = game.teams?.away || {};

  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <p className="text-xs font-bold text-gray-300">{game.league?.name || "Major League Baseball"}</p>
        <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-300">
          {validDate ? validDate.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "Date TBC"}
          {validDate ? ` · ${validDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
          {showScore ? ` · ${gameStatus(game) || "Final"}` : ""}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-6 sm:gap-5">
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge team={home} /><span className="text-sm font-bold text-white sm:text-base">{home.name || "Home"}</span></div>
        {showScore
          ? <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-2xl font-black tabular-nums text-white sm:text-3xl"><span>{game.scores?.home?.total ?? "–"}</span><span className="text-gray-600">:</span><span>{game.scores?.away?.total ?? "–"}</span></div>
          : <span className="rounded-lg border border-white/10 px-4 py-2 text-sm font-black uppercase tracking-wider text-gray-300">vs</span>}
        <div className="flex min-w-0 flex-col items-center gap-3 text-center"><TeamBadge team={away} /><span className="text-sm font-bold text-white sm:text-base">{away.name || "Away"}</span></div>
      </div>
      {game.venue?.name && <p className="border-t border-white/10 pt-3 text-center text-xs text-gray-500">{game.venue.name}{game.venue.city ? ` · ${game.venue.city}` : ""}</p>}
    </article>
  );
}

function MatchCenterHeader({
  title,
  description,
  onNavigate,
}: {
  title: string;
  description: string;
  onNavigate: (page: string) => void;
}) {
  return (
    <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Match Centre</p>
        <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => onNavigate("live-baseball")} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500">Live Baseball <span aria-hidden="true">→</span></button>
          <button type="button" onClick={() => onNavigate("mlb")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">MLB <span aria-hidden="true">→</span></button>
          <button type="button" onClick={() => onNavigate("baseball-fixtures")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">Fixtures</button>
          <button type="button" onClick={() => onNavigate("baseball-results")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">Results</button>
          <button type="button" onClick={() => onNavigate("baseball-standings")} className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500">Standings</button>
        </div>
      </div>
    </section>
  );
}

function DataState({ status, kind, message }: { status: PageStatus; kind: BaseballView; message: string }) {
  if (status === "loading") return <div className="rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading MLB {kind}…</div>;
  if (status === "unconfigured") return <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">MLB data isn’t connected yet</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">Add <code className="text-gray-200">API_BASEBALL_KEY</code> or <code className="text-gray-200">API_SPORTS_KEY</code> to the server environment.</p></div>;
  if (status === "season_unavailable") return <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-10 text-center"><h3 className="text-lg font-bold">MLB {kind} are not available for this season</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-300">{message} Choose an available season above, or check Live Baseball for current game coverage.</p></div>;
  return <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">MLB {kind} are temporarily unavailable</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">{message || `The data provider could not return these ${kind}. Please try again later.`}</p></div>;
}

export default function BaseballMatchCenter({
  section,
  onNavigate,
}: {
  section: "baseball-fixtures" | "baseball-results" | "baseball-standings";
  onNavigate: (page: string) => void;
}) {
  const [items, setItems] = useState<unknown[]>([]);
  const [status, setStatus] = useState<PageStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const currentSeason = new Date().getUTCFullYear();
  const [season, setSeason] = useState(currentSeason);
  const seasons = Array.from({ length: 5 }, (_, index) => currentSeason - index);
  const kind: BaseballView = section === "baseball-fixtures" ? "fixtures" : section === "baseball-results" ? "results" : "standings";
  const title = kind === "fixtures" ? "MLB Fixtures" : kind === "results" ? "MLB Results" : "MLB Standings";

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(`/api/baseball?view=${kind}&season=${season}`, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (data.status === "unconfigured") {
          setItems([]);
          setStatus("unconfigured");
          return;
        }
        if (data.status === "season_unavailable") {
          setItems([]);
          setErrorMessage(data.message || "The configured API plan does not include this MLB season.");
          setStatus("season_unavailable");
          return;
        }
        if (!response.ok || data.status === "error") {
          setErrorMessage(data.message || `MLB ${kind} unavailable.`);
          throw new Error(data.message || `MLB ${kind} unavailable.`);
        }
        setItems(readRows(data.response));
        setErrorMessage("");
        setUpdatedAt(typeof data.updatedAt === "string" ? data.updatedAt : null);
        setStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(`MLB ${kind} could not be loaded:`, error);
        if (error instanceof Error) setErrorMessage(error.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [kind, season]);

  const games = useMemo(
    () => items.map(normalizeGame).filter((game): game is BaseballGame => game !== null),
    [items]
  );
  const standings = useMemo(() => flattenStandings(items).sort((first, second) => {
    const group = first.group.localeCompare(second.group);
    if (group !== 0) return group;
    return (first.rank ?? Number.MAX_SAFE_INTEGER) - (second.rank ?? Number.MAX_SAFE_INTEGER);
  }), [items]);
  const now = Date.now();
  const recent = now - 7 * 24 * 60 * 60 * 1000;
  const nextWeek = now + 7 * 24 * 60 * 60 * 1000;
  const filteredGames = games
    .filter((game) => {
      const time = Date.parse(game.date || "");
      if (!Number.isFinite(time)) return false;
      return kind === "fixtures"
        ? time >= now && time <= nextWeek && !isFinished(game) && !isInProgress(game)
        : time >= recent && time < now && isFinished(game);
    })
    .sort((first, second) => kind === "fixtures"
      ? Date.parse(first.date || "") - Date.parse(second.date || "")
      : Date.parse(second.date || "") - Date.parse(first.date || ""));

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <MatchCenterHeader
        title={title}
        description={kind === "fixtures"
          ? "Upcoming MLB games for the next seven days, with game times and matchups."
          : kind === "results"
            ? "Final MLB scores from games played during the past seven days."
            : "Track American League and National League team records across the MLB season."}
        onNavigate={onNavigate}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">{kind === "fixtures" ? "Coming up" : kind === "results" ? "Final scores" : "League table"}</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">{kind === "fixtures" ? "Next seven days" : kind === "results" ? "Last seven days" : `MLB ${season} season`}</h2>
          </div>
          <label className="flex items-center gap-3 text-xs font-bold text-gray-400">
            Season
            <select value={season} onChange={(event) => setSeason(Number(event.target.value))} className="rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white">
              {seasons.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </label>
        </div>

        {status !== "ready" ? <DataState status={status} kind={kind} message={errorMessage} />
          : kind === "standings" ? standings.length === 0
            ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">MLB standings are not available</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-gray-400">The provider did not return a standings table for the {season} season.</p></div>
            : <div className="space-y-8">
              {Array.from(new Set(standings.map((row) => row.group || "MLB"))).map((group) => {
                const rows = standings.filter((row) => (row.group || "MLB") === group);
                return <section key={group} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  <h3 className="border-b border-white/10 px-5 py-4 text-lg font-black">{group}</h3>
                  <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-white/[0.04] text-[10px] uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-3">Pos</th><th className="px-4 py-3">Team</th><th className="px-3 py-3 text-center">W</th><th className="px-3 py-3 text-center">L</th><th className="px-3 py-3 text-center">PCT</th><th className="px-3 py-3 text-center">RF</th><th className="px-3 py-3 text-center">RA</th><th className="px-4 py-3">Form</th></tr></thead>
                    <tbody className="divide-y divide-white/[0.06]">{rows.map((row, index) => <tr key={`${group}-${row.team.id || row.team.name}`} className="transition hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-bold text-gray-400">{row.rank || index + 1}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><TeamBadge team={row.team} /><span className="font-bold text-white">{row.team.name}</span></div></td>
                      <td className="px-3 py-3 text-center text-gray-300">{row.wins ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.losses ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.winPercentage ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.runsFor ?? "—"}</td><td className="px-3 py-3 text-center text-gray-300">{row.runsAgainst ?? "—"}</td>
                      <td className="px-4 py-3"><div className="flex gap-1">{(row.form || "").slice(-5).split("").map((result, formIndex) => <span key={`${row.team.id}-${formIndex}`} title={result} className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-black ${result === "W" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>{result}</span>)}</div></td>
                    </tr>)}</tbody>
                  </table></div>
                </section>;
              })}
            </div>
          : filteredGames.length === 0
            ? <div className="rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">No MLB {kind} found</h3><p className="mt-2 text-sm text-gray-400">There are no MLB {kind} in the provider feed for the selected date range.</p></div>
            : <div className="grid gap-4 md:grid-cols-2">{filteredGames.map((game) => <GameCard key={`${game.id}-${game.date}`} game={game} showScore={kind === "results"} />)}</div>}
        {status === "ready" && updatedAt && <p className="mt-4 text-right text-xs text-gray-600">Data supplied by API-Sports · Updated {new Date(updatedAt).toLocaleString()}</p>}
      </section>
      <SportsDeskFooter desk={`MLB ${title.replace("MLB ", "")} Desk`} description={`${title} and standings from the Major League Baseball season.`} onNavigate={onNavigate} />
    </main>
  );
}
