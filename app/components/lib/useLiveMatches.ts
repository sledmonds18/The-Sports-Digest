    "use client";

    import { useEffect, useState } from "react";
    import axios from "axios";

    export function useLiveMatches() {
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        async function loadMatches() {
        try {
            const response = await axios.get(
            "https://v3.football.api-sports.io/fixtures?live=all",
            {
                headers: {
                "x-apisports-key": process.env.NEXT_PUBLIC_API_KEY,
                },
            }
                );

            setMatches(response.data.response || []);
        } catch (err) {
            console.error(err);
        }
        }

        loadMatches();

        const interval = setInterval(loadMatches, 30000);

        return () => clearInterval(interval);
    }, []);

    return matches;
    }