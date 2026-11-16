"use client";

import { LIVE_SPORT_ICONS, LIVE_SPORT_LABELS, interleaveBySport } from "./lib/liveSportsData";
import { useLiveSports } from "./lib/useLiveSports";

export function Ticker({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const { events, status } = useLiveSports();
  const items = interleaveBySport(events, 8).map((event) =>
    `${LIVE_SPORT_ICONS[event.sport]} ${LIVE_SPORT_LABELS[event.sport]} · ${event.competition}: ${event.participants.join(" ")} ${event.score} · ${event.status}`
  );

  const tickerItems = items.length > 0
    ? items
    : [status === "loading" ? "Checking live sports scores…" : "No live sports events are available right now"];

  return (
    <div className="ticker" aria-label="Live sports scores" aria-live="polite">
      <button type="button" className="tlbl" onClick={() => onNavigate?.("live-sports")} aria-label="Open Live Sports">
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
