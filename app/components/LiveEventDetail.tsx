"use client";

import { useCallback, useEffect, useState } from "react";
import TeamCrest from "./TeamCrest";
import {
  LIVE_SPORT_ICONS,
  LIVE_SPORT_LABELS,
  type LiveSportEvent,
} from "./lib/liveSportsData";

type JsonRecord = Record<string, unknown>;
type DetailStatus = "loading" | "ready" | "error" | "unavailable";

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function valueAt(value: unknown, ...keys: string[]): unknown {
  let current = value;
  for (const key of keys) current = record(current)[key];
  return current;
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function asRecordArray(value: unknown): JsonRecord[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function eventIcon(type: string, detail: string): string {
  const lower = detail.toLowerCase();
  if (type === "Goal") {
    if (lower.includes("missed")) return "❌";
    return "⚽";
  }
  if (type === "Card") return lower.includes("red") ? "🟥" : "🟨";
  if (type === "subst") return "🔁";
  if (type === "Var") return "📺";
  if (/kickoff|delay|half ?time|full ?time|end (regular|extra)|start/i.test(type)) return "⏱";
  return "•";
}

const GENERIC_DETAILS = /^(normal goal|yellow card|red card|substitution \d+)$/i;

function periodLabel(key: string): string {
  const quarter = key.match(/^quarter_(\d+)$/);
  if (quarter) return `Q${quarter[1]}`;
  if (/^(over_?time|ot)$/.test(key)) return "OT";
  if (/^penalt/.test(key)) return "PEN";
  const number = key.match(/^(\d+)$/);
  if (number) return `P${number[1]}`;
  return key.replace(/_/g, " ").toUpperCase();
}

function formatKickoff(date?: string, time?: string): string {
  if (date) {
    const parsed = Date.parse(date);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleString([], {
        weekday: "short", day: "numeric", month: "short",
        hour: "2-digit", minute: "2-digit",
      });
    }
  }
  return [date, time].filter(Boolean).join(" ") || "";
}

function ScoreHeader({
  homeName, homeLogo, awayName, awayLogo, score, statusLabel,
}: {
  homeName: string; homeLogo?: string;
  awayName: string; awayLogo?: string;
  score: string; statusLabel: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-black p-4 sm:gap-6">
      <div className="flex min-w-0 flex-col items-center gap-2 text-center">
        <TeamCrest name={homeName} logo={homeLogo} className="h-12 w-12" />
        <span className="text-sm font-bold text-white sm:text-base">{homeName}</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="rounded-xl bg-white/5 px-4 py-2 text-3xl font-black tabular-nums text-white sm:text-4xl">{score}</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          {statusLabel}
        </span>
      </div>
      <div className="flex min-w-0 flex-col items-center gap-2 text-center">
        <TeamCrest name={awayName} logo={awayLogo} className="h-12 w-12" />
        <span className="text-sm font-bold text-white sm:text-base">{awayName}</span>
      </div>
    </div>
  );
}

type StatRow = { label: string; home: string; away: string };

function TeamStatsTable({
  homeName, homeLogo, awayName, awayLogo, rows,
}: {
  homeName: string; homeLogo?: string;
  awayName: string; awayLogo?: string;
  rows: StatRow[];
}) {
  if (rows.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Team stats</h3>
      <div className="mt-2 rounded-xl border border-white/10">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <TeamCrest name={homeName} logo={homeLogo} className="h-5 w-5" />
            <span className="truncate text-xs font-bold text-white">{homeName}</span>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-2">
            <span className="truncate text-right text-xs font-bold text-white">{awayName}</span>
            <TeamCrest name={awayName} logo={awayLogo} className="h-5 w-5" />
          </div>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 border-b border-white/5 px-4 py-2 text-center last:border-0">
            <span className="text-sm font-black tabular-nums text-white">{row.home}</span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{row.label}</span>
            <span className="text-sm font-black tabular-nums text-white">{row.away}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

type PlayerRow = { name: string; starter: boolean; stats: string[] };
type PlayerGroup = { title: string; labels: string[]; players: PlayerRow[] };
type TeamBoxScore = { team: string; groups: PlayerGroup[] };

const FOOTBALL_PLAYER_LABELS = [
  "Min", "G", "A", "YC", "RC", "Fouls", "Fouls won", "Shots", "On target", "Saves", "Rating",
];

// API-Football returns one entry per team, with a player and a statistics
// object. Convert it to the same box-score shape ESPN uses for the other
// sports, so the existing player table can render goals, cards and fouls.
// ESPN's football detail already emits that shape, so it passes straight
// through when the API-Football conversion finds nothing.
function footballPlayerBoxScores(value: unknown): TeamBoxScore[] {
  const boxes: TeamBoxScore[] = [];
  for (const teamEntry of asRecordArray(value)) {
    const team = text(valueAt(teamEntry, "team", "name"));
    if (!team) continue;
    const players: PlayerRow[] = [];
    for (const entry of asRecordArray(teamEntry.players)) {
      const name = text(valueAt(entry, "player", "name"));
      if (!name) continue;
      const stats = asRecordArray(entry.statistics)[0] ?? {};
      const minutes = valueAt(stats, "games", "minutes");
      const goals = valueAt(stats, "goals", "total");
      const assists = valueAt(stats, "goals", "assists");
      const yellow = valueAt(stats, "cards", "yellow");
      const red = valueAt(stats, "cards", "red");
      const contributed =
        Number(minutes) > 0 || Number(goals) > 0 || Number(assists) > 0 ||
        Number(yellow) > 0 || Number(red) > 0;
      if (!contributed) continue;
      players.push({
        name,
        starter: !Boolean(valueAt(stats, "games", "substitute")),
        stats: [
          minutes,
          goals,
          assists,
          yellow,
          red,
          valueAt(stats, "fouls", "committed"),
          valueAt(stats, "fouls", "drawn"),
          valueAt(stats, "shots", "total"),
          valueAt(stats, "shots", "on"),
          valueAt(stats, "goals", "saves"),
          valueAt(stats, "games", "rating"),
        ].map((stat) => text(stat) || "-"),
      });
    }
    const minutesOf = (player: PlayerRow) => Number(player.stats[0]) || 0;
    players.sort((first, second) =>
      Number(second.starter) - Number(first.starter) || minutesOf(second) - minutesOf(first));
    if (players.length > 0) {
      boxes.push({
        team,
        groups: [{ title: "Matchday squad", labels: FOOTBALL_PLAYER_LABELS, players }],
      });
    }
  }
  return boxes.length > 0 ? boxes : readBoxScores(value);
}

function readBoxScores(value: unknown): TeamBoxScore[] {
  return asRecordArray(value).map((entry) => ({
    team: text(entry.team),
    groups: asRecordArray(entry.groups).map((group) => ({
      title: text(group.title),
      labels: Array.isArray(group.labels) ? group.labels.map((label) => text(label)) : [],
      players: asRecordArray(group.players).map((player) => ({
        name: text(player.name),
        starter: Boolean(player.starter),
        stats: Array.isArray(player.stats) ? player.stats.map((stat) => text(stat)) : [],
      })).filter((player) => player.name && player.stats.length > 0),
    })).filter((group) => group.labels.length > 0 && group.players.length > 0),
  })).filter((entry) => entry.team && entry.groups.length > 0);
}

function PlayerStatsSection({ playerStats }: { playerStats: unknown }) {
  const boxScores = readBoxScores(playerStats);
  if (boxScores.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Player stats</h3>
      <div className="mt-2 space-y-3">
        {boxScores.map((box) => (
          <div key={box.team} className="overflow-hidden rounded-xl border border-white/10">
            <p className="border-b border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-bold text-white">{box.team}</p>
            {box.groups.map((group, groupIndex) => (
              <details
                key={`${box.team}-${group.title}-${groupIndex}`}
                className="group border-b border-white/5 last:border-0"
                open={groupIndex === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-2">
                  <span className="text-[11px] font-black uppercase tracking-wide text-gray-400">
                    {group.title || "Totals"}
                  </span>
                  <span className="text-[10px] font-bold text-gray-600 group-open:hidden">
                    {group.players.length} players
                  </span>
                </summary>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[22rem] border-collapse text-left">
                    <thead>
                      <tr className="border-y border-white/10 text-[10px] uppercase tracking-wide text-gray-500">
                        <th className="sticky left-0 bg-zinc-950 px-4 py-2 text-left font-bold">Player</th>
                        {group.labels.map((label, index) => (
                          <th key={`${label}-${index}`} className="whitespace-nowrap px-2 py-2 text-right font-bold">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {group.players.map((player, playerIndex) => (
                        <tr key={`${player.name}-${playerIndex}`} className="border-b border-white/5 last:border-0">
                          <td className="sticky left-0 bg-zinc-950 px-4 py-2 text-xs font-bold text-white">
                            <span className="whitespace-nowrap">{player.name}</span>
                            {group.players.some((entry) => entry.starter) && !player.starter && (
                              <span className="ml-1.5 text-[9px] font-black uppercase tracking-wide text-gray-600">sub</span>
                            )}
                          </td>
                          {group.labels.map((_, statIndex) => (
                            <td key={statIndex} className="whitespace-nowrap px-2 py-2 text-right text-xs tabular-nums text-gray-300">
                              {player.stats[statIndex] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

type LineupPlayer = {
  name: string; jersey: string; position: string;
  starter: boolean; subbedIn: boolean; subbedOut: boolean;
};
type Lineup = { team: string; formation: string; players: LineupPlayer[] };

function readLineups(value: unknown): Lineup[] {
  return asRecordArray(value).map((entry) => ({
    team: text(entry.team),
    formation: text(entry.formation),
    players: asRecordArray(entry.players).map((player) => ({
      name: text(player.name),
      jersey: text(player.jersey),
      position: text(player.position),
      starter: Boolean(player.starter),
      subbedIn: Boolean(player.subbedIn),
      subbedOut: Boolean(player.subbedOut),
    })).filter((player) => player.name),
  })).filter((entry) => entry.team && entry.players.length > 0);
}

function LineupRow({ player }: { player: LineupPlayer }) {
  return (
    <li className="flex items-center gap-2 border-b border-white/5 py-1.5 last:border-0">
      <span className="w-6 shrink-0 text-center text-[10px] font-black tabular-nums text-gray-500">{player.jersey}</span>
      <span className="min-w-0 flex-1 truncate text-xs font-bold text-white">{player.name}</span>
      {player.subbedIn && <span aria-label="Came on" className="text-[10px] font-black text-emerald-400">↑</span>}
      {player.subbedOut && <span aria-label="Went off" className="text-[10px] font-black text-red-400">↓</span>}
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-500">{player.position}</span>
    </li>
  );
}

function LineupsSection({ lineups }: { lineups: unknown }) {
  const entries = readLineups(lineups);
  if (entries.length === 0) return null;
  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Line-ups</h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => {
          const starters = entry.players.filter((player) => player.starter);
          const bench = entry.players.filter((player) => !player.starter);
          return (
            <div key={entry.team} className="rounded-xl border border-white/10">
              <div className="border-b border-white/10 px-4 py-2.5">
                <p className="truncate text-xs font-bold text-white">{entry.team}</p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  {[entry.formation ? `Formation ${entry.formation}` : "", `${starters.length} starters`]
                    .filter(Boolean).join(" · ")}
                </p>
              </div>
              <ul className="px-4 py-1">
                {starters.map((player, index) => (
                  <LineupRow key={`${player.name}-${index}`} player={player} />
                ))}
              </ul>
              {bench.length > 0 && (
                <details className="border-t border-white/10">
                  <summary className="cursor-pointer list-none px-4 py-2 text-[10px] font-black uppercase tracking-wide text-gray-500">
                    Bench ({bench.length})
                  </summary>
                  <ul className="px-4 pb-1">
                    {bench.map((player, index) => (
                      <LineupRow key={`${player.name}-${index}`} player={player} />
                    ))}
                  </ul>
                </details>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FootballDetail({ detail }: { detail: JsonRecord }) {
  const fixture = record(detail.fixture);
  const league = record(detail.league);
  const teams = record(detail.teams);
  const home = record(teams.home);
  const away = record(teams.away);
  const goals = record(detail.goals);
  const events = asRecordArray(detail.events);
  const statistics = asRecordArray(detail.statistics);

  const statsFor = (teamName: string, index: number) => {
    const match = statistics.find((entry) => text(valueAt(entry, "team", "name")) === teamName);
    return asRecordArray((match || statistics[index])?.statistics);
  };
  const homeStats = statsFor(text(home.name), 0);
  const awayStats = statsFor(text(away.name), 1);
  const awayByType = new Map(awayStats.map((entry) => [text(entry.type), entry]));
  const statRows = homeStats.map((entry) => ({
    label: text(entry.type),
    home: text(entry.value, "-"),
    away: text(awayByType.get(text(entry.type))?.value, "-"),
  }));
  const elapsed = valueAt(fixture, "status", "elapsed");
  const statusLabel = elapsed != null
    ? `${elapsed}′ live`
    : text(valueAt(fixture, "status", "long"), "Live");
  const notStarted = text(valueAt(fixture, "status", "short")) === "NS";
  const hasScore = !notStarted && (goals.home != null || goals.away != null);

  return (
    <div className="mt-5 space-y-5">
      <ScoreHeader
        homeName={text(home.name, "Home")}
        homeLogo={text(home.logo) || undefined}
        awayName={text(away.name, "Away")}
        awayLogo={text(away.logo) || undefined}
        score={hasScore ? `${goals.home ?? 0} - ${goals.away ?? 0}` : "vs"}
        statusLabel={statusLabel}
      />

      <p className="text-center text-xs text-gray-500">
        {[
          [text(league.name), text(league.country)].filter(Boolean).join(" · "),
          text(league.round),
          text(valueAt(fixture, "venue", "name")),
          formatKickoff(text(fixture.date)),
        ].filter(Boolean).join("  ·  ")}
      </p>

      {events.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Match events</h3>
          <ul className="mt-2">
            {events.map((event, index) => {
              const elapsed = valueAt(event, "time", "elapsed");
              const extra = valueAt(event, "time", "extra");
              const minute = elapsed != null
                ? `${elapsed}${extra ? `+${extra}` : ""}′`
                : "";
              const type = text(event.type);
              const detailText = text(event.detail);
              const playerName = text(valueAt(event, "player", "name"));
              const teamName = text(valueAt(event, "team", "name"));
              const assist = text(valueAt(event, "assist", "name"));
              const extras = [
                detailText && detailText.toLowerCase() !== text(event.type).toLowerCase()
                  && !GENERIC_DETAILS.test(detailText) ? detailText : "",
                type === "Goal" && assist ? `Assist: ${assist}` : "",
                type === "subst" && assist ? `On for ${assist}` : "",
              ].filter(Boolean).join(" · ");
              return (
                <li key={`${index}-${text(valueAt(event, "player", "name"))}-${minute}`} className="flex items-center gap-3 border-b border-white/5 py-2.5 last:border-0">
                  <span className="w-10 shrink-0 rounded-md bg-white/5 py-1 text-center text-[10px] font-black tabular-nums text-gray-300">{minute || "–"}</span>
                  <span aria-hidden="true" className="text-base">{eventIcon(type, detailText)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">
                      {playerName || (type === "subst" ? "Substitution" : type) || detailText || "Match event"}
                    </p>
                    {extras && <p className="truncate text-xs text-gray-500">{extras}</p>}
                  </div>
                  {teamName && (
                    <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                      <span className="truncate text-xs font-bold text-gray-400">{teamName}</span>
                      <TeamCrest name={teamName} logo={text(valueAt(event, "team", "logo")) || undefined} className="h-5 w-5" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {statRows.length > 0 && (
        <TeamStatsTable
          homeName={text(home.name, "Home")}
          homeLogo={text(home.logo) || undefined}
          awayName={text(away.name, "Away")}
          awayLogo={text(away.logo) || undefined}
          rows={statRows}
        />
      )}

      <PlayerStatsSection playerStats={footballPlayerBoxScores(detail.playerStats)} />

      <LineupsSection lineups={detail.lineups} />
    </div>
  );
}

function OtherSportDetail({ event, detail }: { event: LiveSportEvent; detail: JsonRecord }) {
  const teams = record(detail.teams);
  const home = record(teams.home);
  // API-NBA labels the away side `visitors` instead of `away`.
  const away = { ...record(teams.visitors), ...record(teams.away) };
  const scores = record(detail.scores);
  const homeScores = record(scores.home);
  const awayScores = { ...record(scores.visitors), ...record(scores.away) };
  const status = record(detail.status);
  const statusLabel = text(status.long, text(status.short, event.status));
  const clock = text(detail.time);

  const homeTotal = typeof homeScores.total === "number"
    ? homeScores.total
    : typeof homeScores.points === "number" ? homeScores.points : null;
  const awayTotal = typeof awayScores.total === "number"
    ? awayScores.total
    : typeof awayScores.points === "number" ? awayScores.points : null;
  const score = homeTotal != null && awayTotal != null
    ? `${homeTotal} - ${awayTotal}`
    : event.score;

  const NON_PERIOD_KEYS = new Set(["total", "points", "win", "loss", "series", "linescore", "ties"]);
  const periodKeys = Array.from(new Set([...Object.keys(homeScores), ...Object.keys(awayScores)]))
    .filter((key) => !NON_PERIOD_KEYS.has(key) &&
      (typeof homeScores[key] === "number" || typeof awayScores[key] === "number"));
  // NBA games publish quarter-by-quarter scoring as a `linescore` array rather
  // than named period keys.
  const homeLine = Array.isArray(homeScores.linescore) ? homeScores.linescore : [];
  const awayLine = Array.isArray(awayScores.linescore) ? awayScores.linescore : [];
  const linePeriods = homeLine.length >= awayLine.length ? homeLine : awayLine;

  const statistics = asRecordArray(detail.statistics);
  const statsFor = (teamName: string, index: number) => {
    const match = statistics.find((entry) => text(valueAt(entry, "team", "name")) === teamName);
    return asRecordArray((match || statistics[index])?.statistics);
  };
  const homeName = text(home.name, event.participants[0] || "Home");
  const awayName = text(away.name, event.participants[1] || "Away");
  const homeStats = statsFor(homeName, 0);
  const awayStats = statsFor(awayName, 1);
  const awayByType = new Map(awayStats.map((entry) => [text(entry.type), entry]));
  const statRows = homeStats.map((entry) => ({
    label: text(entry.type),
    home: text(entry.value, "-"),
    away: text(awayByType.get(text(entry.type))?.value, "-"),
  }));

  return (
    <div className="mt-5 space-y-5">
      <ScoreHeader
        homeName={homeName}
        homeLogo={text(home.logo) || event.logos?.[0]}
        awayName={awayName}
        awayLogo={text(away.logo) || event.logos?.[1]}
        score={score}
        statusLabel={clock ? `${statusLabel} · ${clock}` : statusLabel}
      />

      <p className="text-center text-xs text-gray-500">
        {[
          event.competition,
          formatKickoff(text(detail.date), clock || text(detail.time)),
        ].filter(Boolean).join("  ·  ")}
      </p>

      {linePeriods.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Score by period</h3>
          <div className="mt-2 rounded-xl border border-white/10">
            {linePeriods.map((_, index) => (
              <div key={index} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 border-b border-white/5 px-4 py-2 text-center last:border-0">
                <span className="text-sm font-black tabular-nums text-white">{text(homeLine[index], "-")}</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                  {index < 4 ? `Q${index + 1}` : `OT${index > 4 ? index - 3 : ""}`}
                </span>
                <span className="text-sm font-black tabular-nums text-white">{text(awayLine[index], "-")}</span>
              </div>
            ))}
            {homeTotal != null && awayTotal != null && (
              <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 border-t border-white/10 px-4 py-2 text-center">
                <span className="text-sm font-black tabular-nums text-red-400">{homeTotal}</span>
                <span className="text-[11px] font-black uppercase tracking-wide text-red-400">Total</span>
                <span className="text-sm font-black tabular-nums text-red-400">{awayTotal}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {periodKeys.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Score by period</h3>
          <div className="mt-2 rounded-xl border border-white/10">
            {periodKeys.map((key) => (
              <div key={key} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 border-b border-white/5 px-4 py-2 text-center last:border-0">
                <span className="text-sm font-black tabular-nums text-white">{Number(homeScores[key])}</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{periodLabel(key)}</span>
                <span className="text-sm font-black tabular-nums text-white">{Number(awayScores[key])}</span>
              </div>
            ))}
            {homeTotal != null && awayTotal != null && (
              <div className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 border-t border-white/10 px-4 py-2 text-center">
                <span className="text-sm font-black tabular-nums text-red-400">{homeTotal}</span>
                <span className="text-[11px] font-black uppercase tracking-wide text-red-400">Total</span>
                <span className="text-sm font-black tabular-nums text-red-400">{awayTotal}</span>
              </div>
            )}
          </div>
        </section>
      )}

      <TeamStatsTable
        homeName={homeName}
        homeLogo={text(home.logo) || event.logos?.[0]}
        awayName={awayName}
        awayLogo={text(away.logo) || event.logos?.[1]}
        rows={statRows}
      />

      <PlayerStatsSection playerStats={detail.playerStats} />
    </div>
  );
}

export default function LiveEventDetail({
  event,
  onClose,
}: {
  event: LiveSportEvent | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<unknown>(null);
  const [status, setStatus] = useState<DetailStatus>("loading");
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async (silent = false) => {
    if (!event) return;
    const detailId = event.detail?.id || event.id;
    const source = event.detail?.source || event.source;
    if (!/^\d+$/.test(detailId)) {
      setDetail(null);
      setStatus("unavailable");
      setMessage("The provider behind this match does not publish a detailed feed.");
      return;
    }
    if (silent) setRefreshing(true);
    else setStatus("loading");
    try {
      const params = new URLSearchParams({ id: detailId });
      if (source) params.set("source", source);
      // Let the football route borrow ESPN's detail feed by team pair when the
      // paid provider cannot resolve its own fixture (outage or lost coverage).
      if (event.sport === "football") {
        if (event.participants[0]) params.set("home", event.participants[0]);
        if (event.participants[1]) params.set("away", event.participants[1]);
      }
      const url = event.sport === "football"
        ? `/api/matches?view=detail&${params.toString()}`
        : `/api/live-sports?view=detail&sport=${event.sport}&${params.toString()}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      if (data.status === "ok" && data.response) {
        setDetail(data.response);
        setMessage("");
        setStatus("ready");
        return;
      }
      if (["not_found", "unavailable", "unsupported", "unconfigured", "invalid_request"].includes(text(data.status))) {
        setDetail(null);
        setStatus("unavailable");
        setMessage(text(data.message) || "No detailed feed is available for this match.");
        return;
      }
      throw new Error(text(data.message) || "Details are temporarily unavailable.");
    } catch (error) {
      setMessage(error instanceof Error && error.message ? error.message : "");
      setStatus("error");
    } finally {
      setRefreshing(false);
    }
  }, [event]);

  useEffect(() => {
    if (!event) return;
    void load();
  }, [event, load]);

  // Only poll while a real feed is loaded; retrying a match whose provider has
  // no detail endpoint would hit the network forever for nothing.
  useEffect(() => {
    if (!event || status !== "ready") return;
    const interval = window.setInterval(() => void load(true), 60_000);
    return () => window.clearInterval(interval);
  }, [event, load, status]);

  useEffect(() => {
    if (!event) return;
    const onKey = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${event.sport} match details`}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:rounded-3xl sm:p-6"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-400">
              {LIVE_SPORT_ICONS[event.sport]} {LIVE_SPORT_LABELS[event.sport]} · Match details
            </p>
            <p className="mt-1 text-sm font-bold text-white">{event.competition}</p>
          </div>
          <div className="flex items-center gap-2">
            {status !== "unavailable" && (
              <button
                type="button"
                onClick={() => void load()}
                disabled={refreshing}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:border-red-500 disabled:opacity-60"
              >
                {refreshing ? "…" : "Refresh"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close match details"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:border-red-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {status === "loading" ? (
          <p className="py-10 text-center text-sm text-gray-400">Loading match details…</p>
        ) : status === "error" ? (
          <div className="py-10 text-center">
            <p className="text-sm font-bold text-white">Match details are temporarily unavailable.</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-gray-500">{message || "The provider did not answer. Try the refresh button."}</p>
          </div>
        ) : status === "unavailable" || !detail ? (
          <div className="mt-5 space-y-5">
            <ScoreHeader
              homeName={event.participants[0] || "Home"}
              homeLogo={event.logos?.[0]}
              awayName={event.participants[1] || "Away"}
              awayLogo={event.logos?.[1]}
              score={event.score}
              statusLabel={event.status}
            />
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-6 text-center">
              <p className="text-sm font-bold text-white">No detailed feed for this match</p>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-gray-400">
                {message || "The provider behind this match publishes scores only."}
              </p>
            </div>
          </div>
        ) : event.sport === "football" ? (
          <FootballDetail detail={record(detail)} />
        ) : (
          <OtherSportDetail event={event} detail={record(detail)} />
        )}
      </div>
    </div>
  );
}
