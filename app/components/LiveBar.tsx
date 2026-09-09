"use client";

import { useLiveMatches } from "./lib/useLiveMatches";
import { MatchCard } from "./MatchCard";

export function LiveBar() {
  const matches = useLiveMatches();

  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <section className="live-wrap">
      <h2 className="sec-title">Live Matches</h2>

      <div className="live-grid">
        {matches.map((m: any, idx: number) => {
          const homeName = m?.teams?.home?.name || "Home Team";
          const awayName = m?.teams?.away?.name || "Away Team";
          const homeGoals = m?.goals?.home ?? 0;
          const awayGoals = m?.goals?.away ?? 0;
          const minute = m?.fixture?.status?.elapsed || 0;
          const key = m?.fixture?.id || idx;

          return (
            <MatchCard
              key={key}
              home={homeName}
              away={awayName}
              score={`${homeGoals} - ${awayGoals}`}
              minute={minute}
            />
          );
        })}
      </div>
    </section>
  );
}