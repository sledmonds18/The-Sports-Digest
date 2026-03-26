    "use client";

    import { FormEvent, useState } from "react";

    interface NewsletterProps {
    onSubmit?: (email: string) => void;
    }

    export function Newsletter({ onSubmit }: NewsletterProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit?.(email);
        setEmail("");
    };

    return (
        <section className="nl2" aria-labelledby="nl-h">
        <div className="wrap">
            <h2 id="nl-h">Never Miss a Story</h2>
            <p>Join 850,000+ readers — your morning sports digest, free forever.</p>
            <form className="nlf" onSubmit={handleSubmit} aria-label="Newsletter signup form">
            <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
            </form>
        </div>
        </section>
    );
    }
