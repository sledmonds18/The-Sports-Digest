    "use client";

    import { useState } from "react";

    export function PollCard() {
    const [vote, setVote] = useState("");

    return (
        <section className="poll-card">
        <h2>Who Wins Tonight?</h2>

        <div className="poll-btns">
            <button onClick={() => setVote("Home Win")}>
            Home Win
            </button>
            <button onClick={() => setVote("Draw")}>
            Draw
            </button>

            <button onClick={() => setVote("Away Win")}>
            Away Win
            </button>
        </div>

        {vote && <p>Your Vote: {vote}</p>}
        </section>
    );
    }
