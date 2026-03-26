    "use client";

    import { ARTICLES } from "./lib/data";
    import { Newsletter } from "./Newsletter";
    import { About } from "./About";

    interface HomeProps {
    onNavigate: (page: string) => void;
    onToast: (message: string) => void;
    }

    export function Home({ onNavigate, onToast }: HomeProps) {
    const handleNewsletterSubmit = () => {
        onToast("✓ Subscribed! Your first digest arrives tomorrow.");
    };

    return (
        <main id="mc" aria-label="Homepage">
        {/* HERO */}
        <section className="hero" aria-label="Hero">
            <div className="hleft">
            <p className="heyebrow fu d1">Breaking Coverage · Est. 2018</p>
            <h1 className="hh1 fu d2">
                Where<br />
                Sport<br />
                Meets <em>Story.</em>
            </h1>
            <p className="hsub fu d3">
                Fearless analysis, investigative features and the voices that define
                the game — delivered daily from Accra to the world.
            </p>
            <div className="hacts fu d4">
                <button className="bred" onClick={() => onNavigate("articles")}>
                Read Features
                </button>
                <button className="bghost" onClick={() => onNavigate("about")}>
                Our Story
                </button>
            </div>
            <div className="hbadges fu d4" aria-hidden="true">
                {["12+ Sports", "850K Readers", "SJA Award 2025"].map((b) => (
                <span key={b} className="hbadge">
                    {b}
                </span>
                ))}
            </div>
            </div>
            <div className="hright" aria-hidden="true">
            <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=80"
                alt="afan sports journalists at work"
                loading="eager"
            />
            </div>
        </section>

        {/* FEATURED */}
        <section className="sec fbg" aria-labelledby="feat-h" style={{ paddingTop: 0 }}>
            <div className="wrap" style={{ paddingTop: "clamp(40px,5vw,72px)" }}>
            <p className="slbl">Editor&apos;s Picks</p>
            <h2 id="feat-h" className="sh2 lt">
                Featured Stories
            </h2>
            <div className="rule" />
            <div className="fgrid">
                <article
                className="fmain"
                onClick={() => onNavigate("articles")}
                tabIndex={0}
                aria-label={ARTICLES[0].title}
                >
                <img src={ARTICLES[0].img} alt={ARTICLES[0].title} loading="lazy" />
                <div className="fov">
                    <p className="fcat">
                    {ARTICLES[0].cat} · {ARTICLES[0].tag}
                    </p>
                    <h3 className="ftitle">{ARTICLES[0].title}</h3>
                    <p className="fmeta">
                    {ARTICLES[0].author} · {ARTICLES[0].date} · {ARTICLES[0].rt} read
                    </p>
                </div>
                </article>
                <div className="fstack">
                {ARTICLES.slice(1, 4).map((a) => (
                    <article
                    key={a.id}
                    className="fcard"
                    onClick={() => onNavigate("articles")}
                    tabIndex={0}
                    aria-label={a.title}
                    >
                    <img src={a.img} alt={a.title} loading="lazy" />
                    <div className="fov">
                        <p className="fcat">{a.cat}</p>
                        <h3 className="ftitle">{a.title}</h3>
                        <p className="fmeta" style={{ fontSize: 10, color: "#666" }}>
                        {a.author} · {a.date}
                        </p>
                    </div>
                    </article>
                ))}
                </div>
            </div>
            </div>
        </section>

        {/* STATS */}
        <div className="sband" role="region" aria-label="Key statistics">
            <div className="wrap">
            <div className="srow">
                {[
                ["12+", "Sports Covered"],
                ["850K+", "Monthly Readers"],
                ["200+", "Articles Published"],
                ["18", "Award Wins"],
                ].map(([n, l]) => (
                <div key={l} className="stat">
                    <div className="sn">{n}</div>
                    <div className="sl">{l}</div>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* RECENT */}
        <section className="sec abg" aria-labelledby="rec-h">
            <div className="wrap">
            <p className="slbl">Latest Features</p>
            <h2 id="rec-h" className="sh2">
                Recent Stories
            </h2>
            <div className="rule" />
            <div className="agrid">
                {ARTICLES.slice(0, 3).map((a, i) => (
                <article
                    key={a.id}
                    className={`acard fu d${i + 1}`}
                    onClick={() => onNavigate("articles")}
                    tabIndex={0}
                    aria-label={a.title}
                >
                    <div className="aimg">
                    <img src={a.img} alt={a.title} loading="lazy" />
                    </div>
                    <div className="abody">
                    <p className="acat">{a.cat}</p>
                    <h3 className="atitle">{a.title}</h3>
                    <p className="aexc">{a.excerpt}</p>
                    <div className="aftr">
                        <span>{a.author}</span>
                        <span>{a.date}</span>
                        <span className="atag">{a.tag}</span>
                    </div>
                    </div>
                </article>
                ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 44 }}>
                <button className="bred" onClick={() => onNavigate("articles")}>
                View All Features
                </button>
            </div>
            </div>
        </section>

        <Newsletter onSubmit={handleNewsletterSubmit} />
        </main>
    );
    }
