"use client";

import { useLiveMatches } from "./lib/useLiveMatches";

export function Ticker({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { matches, status } = useLiveMatches();
  const items = matches.slice(0, 6).map((match) => {
    const time = match.fixture.status.elapsed != null
      ? `${match.fixture.status.elapsed}′`
      : match.fixture.status.short;
    return `⚽ ${match.league.name}: ${match.teams.home.name} ${match.goals.home ?? 0}–${match.goals.away ?? 0} ${match.teams.away.name} · ${time}`;
  });

  const tickerItems = items.length > 0
    ? items
    : [status === "loading"
      ? "Loading live football scores…"
      : status === "unconfigured"
        ? "Live football scores are not connected yet"
        : status === "error"
          ? "Live football scores are temporarily unavailable"
          : "No football matches are live right now"];

  return (
    <div className="ticker" aria-label="Live football scores" aria-live="polite">
      <button type="button" className="tlbl" onClick={() => onNavigate?.("live")} aria-label="Open Live Football">
        Live
      </button>
      <div className="ttrack">
        <div className="tinner" aria-hidden="true">
          {tickerItems.length > 1
            ? [...tickerItems, ...tickerItems].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)
            : <span>{tickerItems[0]}</span>}
        </div>
      </div>
    </div>
  );
}
