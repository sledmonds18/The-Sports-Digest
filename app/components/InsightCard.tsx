    "use client";

    import { useEffect, useState } from "react";

    export default function InsightCard() {
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadInsight() {
        try {
            const res = await fetch("/api/insights", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            home: "Manchester City",
            away: "Arsenal",
            }),
            });

            // check if response is valid
            if (!res.ok) {
            throw new Error("API request failed");
            }

            const text = await res.text();

            // prevent empty response crash
            if (!text) {
            throw new Error("Empty response from API");
            }

            const data = JSON.parse(text);

            setInsight(data.insight);
        } catch (err) {
            console.error(err);

            setInsight(
            "AI insights are temporarily unavailable."
            );
        } finally {
            setLoading(false);
        }
        }

        loadInsight();
    }, []);

    return (
        <section className="insight-card">
        <div className="ai-badge">AI Insight</div>

        <h2>Match Prediction</h2>

        {loading ? (
            <p>Loading AI analysis...</p>
        ) : (
            <p>{insight}</p>
        )}
        </section>
    );
    }