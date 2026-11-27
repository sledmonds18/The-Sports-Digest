"use client";

import { useEffect, useMemo, useState } from "react";
import { ARTICLES, CATS } from "./lib/data";
import type { GhanaSportArticle } from "./lib/ghanaSportsData";
import type { InternationalSportArticle } from "./lib/internationalSportsData";
import { Newsletter } from "./Newsletter";

interface ArticlesProps {
  onToast: (message: string) => void;
}

type FeedItem = {
  id: string;
  cat: string;
  filterCats: string[];
  tag: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  img?: string;
  href?: string;
  sourceName?: string;
};

const FOOTBALL_CATS = new Set([
  "Football",
  "Premier League",
  "Champions League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1",
  "MLS",
  "FIFA",
  "UEFA",
  "Transfers",
]);

function mapFilterCats(category: string): string[] {
  if (FOOTBALL_CATS.has(category)) return ["Football"];
  if (category === "Formula 1" || category === "Motorsport") return ["Motorsport"];
  if (CATS.includes(category)) return [category];
  return [];
}

function toTimestamp(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeGhana(article: GhanaSportArticle): FeedItem {
  return {
    id: `ghana-${article.id}`,
    cat: article.category,
    filterCats: mapFilterCats(article.category),
    tag: "Ghana",
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    date: article.publishedAt,
    readTime: article.readTime || "3 min",
    img: article.image || undefined,
    href: article.discoverySource?.sourceUrl,
    sourceName: article.discoverySource?.sourceName,
  };
}

function normalizeInternational(article: InternationalSportArticle): FeedItem {
  const filterCats = mapFilterCats(article.category);
  return {
    id: `intl-${article.id}`,
    cat: article.category,
    filterCats,
    tag: filterCats[0] === "Football" ? "International" : "World",
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    date: article.publishedAt,
    readTime: article.readTime || "3 min",
    img: article.image || undefined,
    href: article.discoverySource?.sourceUrl,
    sourceName: article.discoverySource?.sourceName,
  };
}

function normalizeStatic(article: (typeof ARTICLES)[number]): FeedItem {
  return {
    id: `static-${article.id}`,
    cat: article.cat,
    filterCats: mapFilterCats(article.cat),
    tag: article.tag,
    title: article.title,
    excerpt: article.excerpt,
    author: article.author,
    date: article.date,
    readTime: article.rt,
    img: article.img,
  };
}

export function Articles({ onToast }: ArticlesProps) {
  const [fcat, setFcat] = useState("All");
  const [ghana, setGhana] = useState<GhanaSportArticle[]>([]);
  const [international, setInternational] = useState<InternationalSportArticle[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const [ghanaRes, intlRes] = await Promise.all([
          fetch("/api/ghana-sports-news?status=approved&category=All%20Sports", {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch("/api/international-sports-news?category=All%20International", {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        if (ghanaRes.ok) {
          const data = await ghanaRes.json();
          if (data?.success && Array.isArray(data.data)) {
            setGhana(data.data as GhanaSportArticle[]);
          }
        }

        if (intlRes.ok) {
          const data = await intlRes.json();
          if (data?.success && Array.isArray(data.data)) {
            setInternational(data.data as InternationalSportArticle[]);
          }
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const items = useMemo(() => {
    const merged = [
      ...ARTICLES.map(normalizeStatic),
      ...ghana.map(normalizeGhana),
      ...international.map(normalizeInternational),
    ];

    const seen = new Set<string>();
    const deduped: FeedItem[] = [];
    for (const item of merged) {
      const key = item.title.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      deduped.push(item);
    }

    deduped.sort((a, b) => toTimestamp(b.date) - toTimestamp(a.date));
    return deduped;
  }, [ghana, international]);

  const filtered = useMemo(() => {
    if (fcat === "All") return items;
    return items.filter((item) => item.filterCats.includes(fcat) || item.cat === fcat);
  }, [fcat, items]);

  const handleNewsletterSubmit = () => {
    onToast("✓ Subscribed! Your first digest arrives tomorrow.");
  };

  return (
    <main id="mc">
      <section className="sec abg" aria-labelledby="art-h">
        <div className="wrap">
          <p className="slbl">Latest Articles</p>

          <h1 id="art-h" className="sh2">
            Stories, News &amp; Analysis
          </h1>
          <div className="rule" />
          <p style={{ color: "var(--mid)", marginTop: 12, maxWidth: 760, lineHeight: 1.7 }}>
            Ghana and international sports stories, features, and newsroom-approved updates across every major sport.
          </p>
          <nav className="frow2" aria-label="Filter articles by sport category">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                className={`fb${fcat === c ? " act" : ""}`}
                onClick={() => setFcat(c)}
                aria-pressed={fcat === c}
              >
                {c}
              </button>
            ))}
          </nav>
          <div className="agrid" role="list">
            {filtered.map((a, i) => {
              const card = (
                <>
                  {a.img ? (
                    <div className="aimg">
                      <img
                        src={a.img}
                        alt={a.title}
                        loading="lazy"
                        onError={(e) => {
                          const wrapper = e.currentTarget.parentElement;
                          if (wrapper) wrapper.style.display = "none";
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="abody">
                    <p className="acat">{a.cat}</p>
                    <h2 className="atitle">{a.title}</h2>
                    <p className="aexc">{a.excerpt}</p>
                    <div className="aftr">
                      <span>{a.author}</span>
                      <span>{a.date}</span>
                      <span>{a.readTime} read</span>
                      <span className="atag">{a.tag}</span>
                    </div>
                    {a.href && (
                      <p style={{ marginTop: 10, fontSize: 12, color: "var(--mid)" }}>
                        Source: {a.sourceName || "Newsroom source"}
                      </p>
                    )}
                  </div>
                </>
              );

              if (a.href) {
                return (
                  <a
                    key={a.id}
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`acard fu d${(i % 3) + 1}`}
                    role="listitem"
                    aria-label={a.title}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {card}
                  </a>
                );
              }

              return (
                <article
                  key={a.id}
                  className={`acard fu d${(i % 3) + 1}`}
                  role="listitem"
                  tabIndex={0}
                  aria-label={a.title}
                >
                  {card}
                </article>
              );
            })}
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