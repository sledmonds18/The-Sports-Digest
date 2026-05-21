    "use client";

    import { useLiveMatches } from "./lib/useLiveMatches";
    import { MatchCard } from "./MatchCard";

    export function LiveBar() {
    const matches = useLiveMatches();

    return (
        <section className="live-wrap">
        <h2 className="sec-title">Live Matches</h2>

        <div className="live-grid">
            {matches.map((m: any) => (
            <MatchCard
                key={m.fixture.id}
                home={m.teams.home.name}
                away={m.teams.away.name}
                score={`${m.goals.home} - ${m.goals.away}`}
                minute={m.fixture.status.elapsed || 0}
            />
            ))}
        </div>
        </section>
    );
    }