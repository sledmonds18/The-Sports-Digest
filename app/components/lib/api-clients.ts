// Base URL for the API
const apiToken = "efda28f39eb34ad581712fda612cb82f";

export async function getFixtures() {
  try {
    const headers = {
      "X-Auth-Token": apiToken,
    };
    const response = await fetch("https://api.football-data.org/v4/matches/", {
      headers,
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


