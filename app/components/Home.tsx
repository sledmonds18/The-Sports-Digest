    "use client";

    import { ARTICLES } from "./lib/data";
    import { Newsletter } from "./Newsletter";
    import { LiveBar } from "./LiveBar";

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
            <p className="heyebrow fu d1">
                Breaking Coverage · Est. 2018
            </p>

            <h1 className="hh1 fu d2">
                Where
                <br />
                Sport
                <br />
                Meets <em>Story.</em>
            </h1>

            <p className="hsub fu d3">
                Fearless analysis, investigative features and the voices that
                define the game — delivered daily from Accra to the world.
            </p>

            <div className="hacts fu d4">
                <button
                className="bred"
                onClick={() => onNavigate("articles")}
                >
                Read Features
                </button>

                <button
                className="bghost"
                onClick={() => onNavigate("about")}
                >
                Our Story
                </button>
            </div>

            <div className="hbadges fu d4" aria-hidden="true">
                {["12+ Sports", "850K Readers", "SJA Award 2025"].map(
                (badge) => (
                    <span key={badge} className="hbadge">
                    {badge}
                    </span>
                )
                )}
            </div>
            </div>

            <div className="hright" aria-hidden="true">
            <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1400&q=80"
                alt="sports journalists at work"
                loading="eager"
            />
            </div>
        </section>

        {/* LIVE MATCHES */}
        <LiveBar />

        {/* LIVE FOOTBALL LINK */}
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10" aria-labelledby="live-centre-heading">
            <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-zinc-950 via-black to-red-950 p-6 text-white shadow-xl sm:p-9">
                <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full border-[28px] border-white/[0.04]" aria-hidden="true" />
                <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div className="max-w-2xl">
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-400">Match Centre · Ghana &amp; Worldwide</p>
                        <h2 id="live-centre-heading" className="mt-3 text-2xl font-black sm:text-3xl">Follow live football as it happens</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-300">See live scores, match minutes, team crests and competitions in one place.</p>
                    </div>
                    <button type="button" onClick={() => onNavigate("live")} className="shrink-0 rounded-lg bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-black">
                        Open Live Football <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </section>

        {/* FEATURED */}
        <section className="sec fbg" aria-labelledby="feat-h">
            <div className="wrap wrap--pt-clamp">
            <p className="slbl">Editor's Picks</p>

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
                <img
                    src={ARTICLES[0].img}
                    alt={ARTICLES[0].title}
                    loading="lazy"
                />

                <div className="fov">
                    <p className="fcat">
                    {ARTICLES[0].cat} · {ARTICLES[0].tag}
                    </p>

                    <h3 className="ftitle">
                    {ARTICLES[0].title}
                    </h3>

                    <p className="fmeta">
                    {ARTICLES[0].author} · {ARTICLES[0].date} ·{" "}
                    {ARTICLES[0].rt} read
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
                    <img
                        src={a.img}
                        alt={a.title}
                        loading="lazy"
                    />

                    <div className="fov">
                        <p className="fcat">{a.cat}</p>

                        <h3 className="ftitle">{a.title}</h3>

                        <p className="fmeta fmeta--compact">
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
        <div
            className="sband"
            role="region"
            aria-label="Key statistics"
        >
            <div className="wrap">
            <div className="srow">
                {[
                ["12+", "Sports Covered"],
                ["850K+", "Monthly Readers"],
                ["200+", "Articles Published"],
                ["18", "Award Wins"],
                ].map(([number, label]) => (
                <div key={label} className="stat">
                    <div className="sn">{number}</div>
                    <div className="sl">{label}</div>
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
                {ARTICLES.slice(4, 7).map((a, i) => (
                <article
                    key={a.id}
                    className={`acard fu d${i + 1}`}
                    onClick={() => onNavigate("articles")}
                    tabIndex={0}
                    aria-label={a.title}
                >
                    <div className="aimg">
                    <img
                        src={a.img}
                        alt={a.title}
                        loading="lazy"
                    />
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

            <div className="section-actions">
                <button
                className="bred"
                onClick={() => onNavigate("articles")}
                >
                View All Features
                </button>
            </div>
            </div>
        </section>

        {/* NEWSLETTER */}
        <Newsletter onSubmit={handleNewsletterSubmit} />
        </main>
    );
    }
