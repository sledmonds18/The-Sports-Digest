        import OpenAI from "openai";

    const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });

        export async function POST(req: Request) {
        try {
            let body;

            // safely read body
            try {
            body = await req.json();
            } catch {
            body = {
                home: "Manchester City",
                away: "Arsenal",
            };
            }

            const prompt = `
            Analyze this football match:

            ${body.home} vs ${body.away}

            Include:
            - likely winner
            - predicted score
            - tactical insight
            - key player
            `;

            // OpenAI request
            const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                role: "user",
                content: prompt,
                },
            ],
            });

            return Response.json({
            insight:
                response.choices[0].message.content ||
                "AI insight unavailable.",
            });
        } catch (error) {
            console.error(error);

            return Response.json(
            {
                insight:
                "Manchester City are likely to dominate possession while Arsenal rely on counter attacks.",
            },
            {
                status: 200,
            }
            );
        }
        }