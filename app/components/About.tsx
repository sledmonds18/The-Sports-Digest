    "use client";

    import { TEAM } from "./lib/data";
    import { Newsletter } from "./Newsletter";
    import { Articles } from "./Ariticle";  
    import { Ticker } from "./Ticker";

    interface AboutProps {
    onNavigate: (page: string) => void;
    onToast: (message: string) => void;
    }

    export function About({ onNavigate, onToast }: AboutProps) {
    const handleNewsletterSubmit = () => {
        onToast("✓ Subscribed! Your first digest arrives tomorrow.");
    };

    const values = [
        {
        i: "✦",
        t: "Independence",
        b: "We answer to our readers, not to clubs, agents or federations. Our editorial line is sacrosanct.",
        },
        {
        i: "◈",
        t: "Depth",
        b: "Every story is reported, edited, fact-checked and considered — never aggregated.",
        },
        {
        i: "◉",
        t: "Diversity",
        b: "Sport is global. Our coverage reflects continents, genders and disciplines equally.",
        },
        {
        i: "⬡",
        t: "Integrity",
        b: "We correct mistakes transparently and protect sources with the rigor of any major newspaper.",
        },
    ];

    return (
        <main id="mc">
        <section
            className="sec"
            style={{ background: "var(--white)" }}
            aria-labelledby="ab-h"
        >
            <div className="wrap">
            <p className="slbl">Our Story</p>
            <h1 id="ab-h" className="sh2">
                About The Sports Digest
            </h1>
            <div className="rule" />
            <div className="abgrid">
                <div style={{ position: "relative" }}>
                <img
                    className="aphoto"
                    src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80"
                    alt="Sports journalist at work"
                    loading="lazy"
                />
                <div className="aaccent" aria-hidden="true" />
                </div>
                <div className="acontent fu">
                <p>
                    <strong>The Sports Digest</strong> was founded by a 22-year-old football journalist 
                    on the belief that sports journalism could be more honest, more
                    analytical and more literary. We cover global sport in full,
                    from the stadiums of Accra to Wimbledons grass courts and
                    beyond. 
                </p>
                <p>
                    <strong>The Sports Digest</strong> was built to challenge the status quo of sports
                        media, by focusing on authentic storytelling, youth-driven energy, and real football culture.
                        We're not just covering the game, we live it.
                        From GPL matchdays to Champions League nights, we bring you closer to the action,
                        the players, and the stories that matter.  
                </p>
                
                <p>
                    Our investigative features have sparked conversations at the
                    highest levels of sport governance. Our long-form writing has
                    earned recognition from the{" "}
                    <strong>Sports Journalists&apos; Association</strong> and the{" "}
                    <strong>African Media Awards</strong> three years running.
                </p>

                <p>
                    <strong>Our Mission</strong> is to become the go-to platform for football fans across the globe,
                    especially in Africa, by providing credible, engaging, and original football content.
                    Whether you're into local league dram or European transfer battles, we've got you covered. 
                </p>
                <p>
                    Today more than <strong>850,000 readers</strong> across 40
                    countries trust The Sports Digest for coverage that is rigorous,
                    independent, and genuinely illuminating.
                </p>
                <p className="asig">Shem Bravon Lamptey</p>
                <p className="arole">Founder & Editor-in-Chief</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
                    <button className="bred" onClick={() => onNavigate("contact")}>
                    Get In Touch
                    </button>
                    <button
                    className="bghost"
                    style={{ border: "1.5px solid var(--ink)", color: "var(--ink)" }}
                    onClick={() => onNavigate("articles")}
                    >
                    Read Our Work
                    </button>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className="sec" aria-labelledby="team-h">
            <div className="wrap">
            <p className="slbl">The Newsroom</p>
            <h2 id="team-h" className="sh2">
                Our Correspondents
            </h2>
            <div className="rule" />
            <div className="tgrid">
                {TEAM.map((m, i) => (
                <div key={m.name} className={`tcard fu d${i + 1}`}>
                    <div className="tphoto">
                    <img
                        src={m.img}
                        alt={`${m.name}, ${m.role}`}
                        loading="lazy"
                    />
                    </div>
                    <div className="tname">{m.name}</div>
                    <div className="trole">{m.role}</div>
                    <p className="tbio">{m.bio}</p>
                </div>
                ))}
            </div>
            </div>
        </section>

        <section
            className="sec"
            style={{ background: "var(--ink)" }}
            aria-labelledby="val-h"
        >
            <div className="wrap">
            <p className="slbl">What We Stand For</p>
            <h2 id="val-h" className="sh2 lt">
                Our Values
            </h2>
            <div className="rule" />
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                gap: 28,
                }}
            >
                {values.map((v) => (
                <div key={v.t} style={{ borderTop: "3px solid var(--red)", paddingTop: 22 }}>
                    <div style={{ fontSize: 22, color: "var(--red)", marginBottom: 10 }}>
                    {v.i}
                    </div>
                    <div
                    style={{
                        fontFamily: "'Oswald',sans-serif",
                        fontSize: 19,
                        color: "#fff",
                        marginBottom: 9,
                        letterSpacing: 1,
                        fontWeight: 600,
                    }}
                    >
                    {v.t}
                    </div>
                    <p style={{ fontSize: 12, color: "#888", lineHeight: 1.75 }}>
                    {v.b}
                    </p>
                </div>
                ))}
            </div>
            </div>
        </section>

        <Newsletter onSubmit={handleNewsletterSubmit} />
        </main>
    );
    }
