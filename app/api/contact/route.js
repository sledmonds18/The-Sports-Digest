    import { Resend } from "resend";

    const resend = new Resend(process.env.RESEND_API_KEY);

    export async function POST(request) {
    try {
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !subject || !message) {
        return Response.json(
            { error: "Please fill in all fields." },
            { status: 400 }
        );
        }

        const { data, error } = await resend.emails.send({
        from: "Sports Digest <onboarding@resend.dev>",
        to: [process.env.CONTACT_EMAIL],
        replyTo: email,
        subject: subject || `New Contact Message from ${name}`,
        text: `
    Name: ${name}
    Email: ${email}
    Subject: ${subject}

    Message:
    ${message}
        `,
        });

        if (error) {
        console.error("Resend error:", error);

        return Response.json(
            { error: "Failed to send message." },
            { status: 500 }
        );
        }

        return Response.json(
        { message: "Message sent successfully!", data },
        { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);

        return Response.json(
        { error: "Something went wrong." },
        { status: 500 }
        );
    }
    }