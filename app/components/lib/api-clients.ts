    import axios from "axios";

    // Base URL for the API
    const date = "2026-03-07"; // replace with your date
    const apiToken = "efda28f39eb34ad581712fda612cb82f";

    export async function getFixtures() {
    try {
        const headers ={
            'X-Auth-Token': apiToken
        }
        const response = await fetch(
        `https://api.football-data.org/v4/matches/`,
        {
            headers
        }
        );

        return await response.json();

        console.log("API Response:", response);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    }

