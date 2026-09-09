"use client";

import { useEffect, useState } from "react";

export function useLiveMatches() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadMatches() {
      try {
        const response = await fetch("/api/matches");
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        if (isMounted) {
          setMatches(Array.isArray(data.response) ? data.response : []);
        }
      } catch (err) {
        console.warn("Live matches unavailable:", err);
      }
    }

    loadMatches();

    const interval = setInterval(loadMatches, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return matches;
}