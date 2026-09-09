import OpenAI from "openai";

export async function POST(req: Request) {
  let body = {
    home: "Manchester City",
    away: "Arsenal",
  };

  try {
    const json = await req.json();
    if (json?.home) body.home = json.home;
    if (json?.away) body.away = json.away;
  } catch {
    // default body fallback
  }

  const fallbackInsight = `${body.home} are expected to dominate midfield possession with high positional pressing, while ${body.away} will look to exploit transition spaces on the counter. Key battle to watch: central midfield duels and set-piece execution.`;

  const apiKey = process.env.OPENAI_API_KEY;

  if (
    !apiKey ||
    apiKey === "your_openai_api_key" ||
    apiKey.trim() === ""
  ) {
    return Response.json({ insight: fallbackInsight }, { status: 200 });
  }

  try {
    const client = new OpenAI({ apiKey });

    const prompt = `
    Analyze this football match:
    ${body.home} vs ${body.away}

    Provide a concise tactical preview (2-3 sentences max) including:
    - likely dynamics / winner
    - tactical insight & key matchup
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content?.trim();

    return Response.json({
      insight: content || fallbackInsight,
    });
  } catch (error) {
    console.warn("OpenAI API call failed or key invalid, using tactical fallback insight.");
    return Response.json(
      {
        insight: fallbackInsight,
      },
      {
        status: 200,
      }
    );
  }
}