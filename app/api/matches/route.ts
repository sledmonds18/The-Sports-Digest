import axios from "axios";

const FALLBACK_MATCHES = [
  {
    fixture: {
      id: 1001,
      status: { elapsed: 74, short: "2H" },
    },
    teams: {
      home: { name: "Arsenal", logo: "" },
      away: { name: "Chelsea", logo: "" },
    },
    goals: { home: 2, away: 1 },
  },
  {
    fixture: {
      id: 1002,
      status: { elapsed: 61, short: "2H" },
    },
    teams: {
      home: { name: "Real Madrid", logo: "" },
      away: { name: "Barcelona", logo: "" },
    },
    goals: { home: 1, away: 1 },
  },
  {
    fixture: {
      id: 1003,
      status: { elapsed: 35, short: "1H" },
    },
    teams: {
      home: { name: "Hearts of Oak", logo: "" },
      away: { name: "Asante Kotoko", logo: "" },
    },
    goals: { home: 1, away: 0 },
  },
  {
    fixture: {
      id: 1004,
      status: { elapsed: 88, short: "2H" },
    },
    teams: {
      home: { name: "Bayern Munich", logo: "" },
      away: { name: "Dortmund", logo: "" },
    },
    goals: { home: 3, away: 2 },
  },
];

export async function GET() {
  const apiKey =
    process.env.API_SPORTS_KEY ||
    process.env.NEXT_PUBLIC_API_KEY;

  if (
    !apiKey ||
    apiKey === "your_api_sports_key" ||
    apiKey.trim() === ""
  ) {
    return Response.json({ response: FALLBACK_MATCHES });
  }

  try {
    const response = await axios.get(
      "https:///fixtures?live=all",
      {
        headers: {
          "x-apisports-key": apiKey,
        },
        timeout: 5000,
      }
    );

    const matchData = response.data?.response;
    if (Array.isArray(matchData) && matchData.length > 0) {
      return Response.json({ response: matchData });
    }

    return Response.json({ response: FALLBACK_MATCHES });
  } catch (error) {
    console.warn("External live sports API unavailable, using fallback data.");
    return Response.json({ response: FALLBACK_MATCHES });
  }
}
