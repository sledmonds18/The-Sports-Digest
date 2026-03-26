    "use client";

    import { useState } from "react";
    import { ARTICLES, CATS } from "./lib/data";
    import { Newsletter } from "./Newsletter";

    interface ArticlesProps {
    onToast: (message: string) => void;
    }

    export function Articles({ onToast }: ArticlesProps) {
    const [fcat, setFcat] = useState("All");

    const handleNewsletterSubmit = () => {
        onToast("✓ Subscribed! Your first digest arrives tomorrow.");
    };

    const filtered = fcat === "All" ? ARTICLES : ARTICLES.filter((a) => a.cat === fcat);

    return (
        <main id="mc">
        <section className="sec abg" aria-labelledby="art-h">
            <div className="wrap">
            <p className="slbl">All Features</p>
            <h1 id="art-h" className="sh2">
                Stories & Analysis
            </h1>
            <div className="rule" />
            <nav className="frow2" aria-label="Filter by sport category">
                {CATS.map((c) => (
                <button
                    key={c}
                    className={`fb${fcat === c ? " act" : ""}`}
                    onClick={() => setFcat(c)}
                    aria-pressed={fcat === c}
                >
                    {c}
                </button>
                ))}
            </nav>
            <div className="agrid" role="list">
                {filtered.map((a, i) => (
                <article
                    key={a.id}
                    className={`acard fu d${(i % 3) + 1}`}
                    role="listitem"
                    tabIndex={0}
                    aria-label={a.title}
                >
                    <div className="aimg">
                    <img src={a.img} alt={a.title} loading="lazy" />
                    </div>
                    <div className="abody">
                    <p className="acat">{a.cat}</p>
                    <h2 className="atitle">{a.title}</h2>
                    <p className="aexc">{a.excerpt}</p>
                    <div className="aftr">
                        <span>{a.author}</span>
                        <span>{a.date}</span>
                        <span>{a.rt} read</span>
                        <span className="atag">{a.tag}</span>
                    </div>
                    </div>
                </article>
                ))}
                {!filtered.length && (
                <p
                    style={{
                    color: "var(--mid)",
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "40px 0",
                    }}
                >
                    No articles in this category yet.
                </p>
                )}
            </div>
            </div>
        </section>
        <Newsletter onSubmit={handleNewsletterSubmit} />
        </main>
    );
    }
