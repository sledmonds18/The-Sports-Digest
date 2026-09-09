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
    <article
      className="match-card"
      style={{
        display: "block",
        background: "red",
        color: "white",
        padding: "30px",
        minHeight: "150px",
        borderRadius: "20px",
      }}
    >
      <div className="live-pill">LIVE</div>

      <h3>
        {home} vs {away}
      </h3>

      <p className="match-score">{score}</p>

      <p>{minute}'</p>
    </article>
  );
}