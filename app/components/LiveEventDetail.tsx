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

function FootballDetail({ detail }: { detail: JsonRecord }) {
  const fixture = record(detail.fixture);
  const league = record(detail.league);
  const teams = record(detail.teams);
  const home = record(teams.home);
  const away = record(teams.away);
  const goals = record(detail.goals);
  const events = asRecordArray(detail.events);
  const statistics = asRecordArray(detail.statistics);

  const homeStats = asRecordArray(statistics[0]?.statistics);
  const awayStats = asRecordArray(statistics[1]?.statistics);
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
  const hasScore = goals.home != null || goals.away != null;

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
              const assist = text(valueAt(event, "assist", "name"));
              const extras = [
                detailText && !GENERIC_DETAILS.test(detailText) ? detailText : "",
                assist && type === "Goal" ? `Assist: ${assist}` : "",
              ].filter(Boolean).join(" · ");
              return (
                <li key={`${index}-${text(valueAt(event, "player", "name"))}-${minute}`} className="flex items-center gap-3 border-b border-white/5 py-2.5 last:border-0">
                  <span className="w-10 shrink-0 rounded-md bg-white/5 py-1 text-center text-[10px] font-black tabular-nums text-gray-300">{minute}</span>
                  <span aria-hidden="true" className="text-base">{eventIcon(type, detailText)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{text(valueAt(event, "player", "name")) || "Unknown player"}</p>
                    {extras && <p className="truncate text-xs text-gray-500">{extras}</p>}
                  </div>
                  <div className="flex min-w-0 items-center justify-end gap-2 text-right">
                    <span className="truncate text-xs font-bold text-gray-400">{text(valueAt(event, "team", "name"))}</span>
                    <TeamCrest name={text(valueAt(event, "team", "name"))} logo={text(valueAt(event, "team", "logo")) || undefined} className="h-5 w-5" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {statRows.length > 0 && (
        <section>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Team stats</h3>
          <div className="mt-2 rounded-xl border border-white/10">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <TeamCrest name={text(home.name)} logo={text(home.logo) || undefined} className="h-5 w-5" />
                <span className="truncate text-xs font-bold text-white">{text(home.name)}</span>
              </div>
              <div className="flex min-w-0 items-center justify-end gap-2">
                <span className="truncate text-right text-xs font-bold text-white">{text(away.name)}</span>
                <TeamCrest name={text(away.name)} logo={text(away.logo) || undefined} className="h-5 w-5" />
              </div>
            </div>
            {statRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 border-b border-white/5 px-4 py-2 text-center last:border-0">
                <span className="text-sm font-black tabular-nums text-white">{row.home}</span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{row.label}</span>
                <span className="text-sm font-black tabular-nums text-white">{row.away}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function OtherSportDetail({ event, detail }: { event: LiveSportEvent; detail: JsonRecord }) {
  const teams = record(detail.teams);
  const home = record(teams.home);
  const away = record(teams.away);
  const scores = record(detail.scores);
  const homeScores = record(scores.home);
  const awayScores = record(scores.away);
  const status = record(detail.status);
  const statusLabel = text(status.long, text(status.short, event.status));
  const clock = text(detail.time);

  const homeTotal = typeof homeScores.total === "number" ? homeScores.total : null;
  const awayTotal = typeof awayScores.total === "number" ? awayScores.total : null;
  const score = homeTotal != null && awayTotal != null
    ? `${homeTotal} - ${awayTotal}`
    : event.score;

  const periodKeys = Array.from(new Set([...Object.keys(homeScores), ...Object.keys(awayScores)]))
    .filter((key) => key !== "total" && (typeof homeScores[key] === "number" || typeof awayScores[key] === "number"));

  return (
    <div className="mt-5 space-y-5">
      <ScoreHeader
        homeName={text(home.name, event.participants[0] || "Home")}
        homeLogo={text(home.logo) || event.logos?.[0]}
        awayName={text(away.name, event.participants[1] || "Away")}
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

  const load = useCallback(async (silent = false) => {
    if (!event) return;
    if (!/^\d+$/.test(event.id)) {
      setDetail(null);
      setStatus("unavailable");
      return;
    }
    if (silent) setRefreshing(true);
    else setStatus("loading");
    try {
      const url = event.sport === "football"
        ? `/api/matches?view=detail&id=${event.id}`
        : `/api/live-sports?view=detail&sport=${event.sport}&id=${event.id}`;
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || data.status === "error") {
        throw new Error(text(data.message) || "Details are temporarily unavailable.");
      }
      setDetail(data.response ?? null);
      setStatus("ready");
    } catch {
      setStatus("error");
    } finally {
      setRefreshing(false);
    }
  }, [event]);

  useEffect(() => {
    if (!event) return;
    void load();
    // Route responses are cached for 45s; refresh quietly once a minute.
    const interval = window.setInterval(() => void load(true), 60_000);
    return () => window.clearInterval(interval);
  }, [event, load]);

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
            <button
              type="button"
              onClick={() => void load()}
              disabled={refreshing}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-bold text-gray-300 transition hover:border-red-500 disabled:opacity-60"
            >
              {refreshing ? "…" : "Refresh"}
            </button>
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
          <p className="py-10 text-center text-sm text-gray-400">Match details are temporarily unavailable. Try the refresh button.</p>
        ) : status === "unavailable" || !detail ? (
          <p className="py-10 text-center text-sm text-gray-400">Detailed data is not available for this match.</p>
        ) : event.sport === "football" ? (
          <FootballDetail detail={record(detail)} />
        ) : (
          <OtherSportDetail event={event} detail={record(detail)} />
        )}
      </div>
    </div>
  );
}
