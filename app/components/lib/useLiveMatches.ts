    "use client";

    import { useEffect, useState } from "react";

    export type Match = {
    id: number;
    participants: { name: string }[];
    scores: { description: string; score: { goals: number } }[];
    time?: { minute?: number };
    };

    export function useLiveMatches() {
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchLive = async () => {
        console.log("Fetching live matches...");
        const res = await fetch("/api/live");
        console.log("Response status:", res.status);
        const data = await res.json();
        setMatches(data);
        };

        fetchLive();
        const interval = setInterval(fetchLive, 10000);

        return () => clearInterval(interval);
    }, []);

    return matches;
    }