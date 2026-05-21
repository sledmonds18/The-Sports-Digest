    interface MatchCardProps {
    home: string;
    away: string;
    score: string;
    minute: number;
    }

    export function MatchCard({
    home,
    away,
    score,
    minute,
    }: MatchCardProps) {
    return (
        <article className="match-card">
        <div className="live-pill">LIVE</div>

        <h3>
            {home} vs {away}
        </h3>

        <p className="match-score">{score}</p>

        <p>{minute}'</p>
        </article>
    );
    }