
    export async function POST(request) {
    try {
        const { name, email, subject, message } =
        await request.json();

        if (!name || !email || !subject || !message) {
        return Response.json(
            { error: "Please fill in all fields." },
            { status: 400 }
        );
        }

        const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT
            ? process.env.FORMSPREE_ENDPOINT
            : "https://formspree.io/f/xbgolwga";

        const response = await fetch(
        formspreeEndpoint,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            },
            body: JSON.stringify({
            name,
            email,
            subject,
            message,
            // Formspree uses this to set the Reply-To so answering the
            // forwarded email reaches the visitor, not the form owner.
            _replyto: email,
            }),
        }
        );

        const data = await response.json();

        if (!response.ok) {
        console.error("Formspree error:", data);

        return Response.json(
            { error: "Failed to send message." },
            { status: 500 }
        );
        }

        return Response.json(
        { message: "Message sent successfully!" },
        { status: 200 }
        );

    } catch (error) {
        console.error("Contact API error:", error);

        return Response.json(
        { error: "Something went wrong." },
        { status: 500 }
        );
    }
    }
