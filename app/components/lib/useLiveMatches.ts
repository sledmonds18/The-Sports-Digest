    "use client";

    import { useEffect, useState } from "react";
    import axios from "axios";


    export function useLiveMatches() {
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        async function loadMatches() {
        try {
            const response = await axios.get(
            "/api/live-matches"
            );

            setMatches(response.data.response || []);
        } catch (error) {
            console.error("Live match error:", error);
        }
        }

        loadMatches();

        const interval = setInterval(loadMatches, 30000);

        return () => clearInterval(interval);
    }, []);

    return matches;
    }