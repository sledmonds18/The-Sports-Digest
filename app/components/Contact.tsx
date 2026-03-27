    "use client";

    import { FormEvent, useState } from "react";
    import { Newsletter } from "./Newsletter";

    interface ContactProps {
    onToast: (message: string) => void;
    }

    interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
    }

    export function Contact({ onToast }: ContactProps) {
    const [form, setForm] = useState<ContactForm>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const contactInfo = [
        { i: "📍", l: "Address", v: "Millennium City, Central Region, Ghana" },
        { i: "✉️", l: "Editorial", v: "editorial@thesportsdigest.com" },
        { i: "📞", l: "Newsroom", v: "+233 20 130 9212" },
        { i: "🕐", l: "Hours", v: "Sunday – Friday, 8:00am – 6:00pm GMT" },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onToast("✓ Message sent — we'll reply within 24 hours.");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    const handleNewsletterSubmit = () => {
        onToast("✓ Subscribed! Your first digest arrives tomorrow.");
    };

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value } = e.target;
        const keyMap: { [key: string]: keyof ContactForm } = {
        fn: "name",
        fe: "email",
        fs: "subject",
        fm: "message",
        };
        const key = keyMap[id];
        if (key) {
        setForm((prev) => ({ ...prev, [key]: value }));
        }
    };

    return (
        <main id="mc">
        <section className="sec cbg" aria-labelledby="ct-h">
            <div className="wrap">
            <div className="cgrid">
                <div className="cinfo fu">
                <p className="slbl">Get In Touch</p>
                <h1 id="ct-h" className="sh2 lt">
                    Contact Us
                </h1>
                <div className="rule" />
                <p>
                    Story tip, editorial pitch, press accreditation, or advertising
                    enquiry — we want to hear from you.
                </p>
                {contactInfo.map((d) => (
                    <address
                    key={d.l}
                    className="crow"
                    style={{ fontStyle: "normal" }}
                    >
                    <div className="cicon" aria-hidden="true">
                        {d.i}
                    </div>
                    <div className="ctxt">
                        <strong>{d.l}</strong>
                        {d.v}
                    </div>
                    </address>
                ))}
                </div>
                <form
                className="cform fu d2"
                onSubmit={handleSubmit}
                aria-label="Contact form"
                noValidate
                >
                <div className="crow2">
                    <div className="fg">
                    <label htmlFor="fn">Full Name</label>
                    <input
                        id="fn"
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={handleFormChange}
                        required
                        autoComplete="name"
                    />
                    </div>
                    <div className="fg">
                    <label htmlFor="fe">Email Address</label>
                    <input
                        id="fe"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleFormChange}
                        required
                        autoComplete="email"
                    />
                    </div>
                </div>
                <div className="fg">
                    <label htmlFor="fs">Subject</label>
                    <select
                    id="fs"
                    value={form.subject}
                    onChange={handleFormChange}
                    required
                    >
                    <option value="">Select a subject…</option>
                    <option>Editorial Pitch</option>
                    <option>Press Accreditation</option>
                    <option>Advertising & Partnerships</option>
                    <option>Story Tip</option>
                    <option>General Enquiry</option>
                    </select>
                </div>
                <div className="fg">
                    <label htmlFor="fm">Message</label>
                    <textarea
                    id="fm"
                    placeholder="Write your message…"
                    value={form.message}
                    onChange={handleFormChange}
                    required
                    rows={6}
                    />
                </div>
                <button
                    type="submit"
                    className="bred"
                    style={{ alignSelf: "flex-start", padding: "14px 36px" }}
                >
                    Send Message
                </button>
                </form>
            </div>
            </div>
        </section>
        <Newsletter onSubmit={handleNewsletterSubmit} />
        </main>
    );
    }
