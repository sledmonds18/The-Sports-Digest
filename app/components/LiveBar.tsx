    "use client";

    import { useEffect, useState } from "react";
    import { getFixtures } from "./lib/api-clients";

    /* ─── Types ───────────────────────── */
    type Match = {
    id: number;
    participants?: { name: string }[];
    scores?: {
        description: string;
        score: { goals: number };
    }[];
    time?: {
        minute?: number;
    };
    };

    export default function LiveBar() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getFixtures();
            setMatches(data);
        } catch (err) {
            console.error("Failed to fetch fixtures:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchData();

        // optional auto-refresh every 15s
        const interval = setInterval(fetchData, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black text-white py-2 overflow-hidden">
        <div className="flex gap-6 animate-marquee px-4">
            {loading ? (
            <span>Loading live matches...</span>
            ) : matches.length === 0 ? (
            <span>No live matches</span>
            ) : (
            matches.map((match) => {
                const home = match.participants?.[0]?.name ?? "Home";
                const away = match.participants?.[1]?.name ?? "Away";

                const homeScore =
                match.scores?.find((s) => s.description === "CURRENT")?.score.goals ?? 0;

                const awayScore =
                match.scores?.find((s) => s.description === "CURRENT")?.score.goals ?? 0;

                const minute = match.time?.minute ?? "";

                return (
                <span key={match.id}>
                    🔴 {home} {homeScore} - {awayScore} {away} {minute}'
                </span>
                );
            })
            )}
        </div>
        </div>
    );
    }