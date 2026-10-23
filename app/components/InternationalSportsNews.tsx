"use client";

import { useEffect, useState } from "react";
import type { InternationalSportArticle } from "./lib/internationalSportsData";

const CATEGORY_IMAGES: Record<string, string> = {
  "Premier League": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  "Champions League": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80",
  "La Liga": "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80",
  Bundesliga: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
  "Serie A": "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80",
  "Ligue 1": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
  MLS: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
  FIFA: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80",
  UEFA: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80",
};

export default function InternationalSportsNews({ category }: { category: string }) {
  const [articles, setArticles] = useState<InternationalSportArticle[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/international-sports-news?category=${encodeURIComponent(category)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => { if (result?.success && Array.isArray(result.data)) setArticles(result.data); })
      .catch(() => {});
    return () => controller.abort();
  }, [category]);

  return (
    <section className="border-y border-white/10 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">International Sports News</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">{category === "All International" ? "Latest international stories" : `Latest ${category} stories`}</h2>
        {articles.length === 0 ? (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400">No approved stories yet. Our newsroom reviews every international news lead before publication.</p>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article key={article.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <img src={article.image || CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES["Premier League"]} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = CATEGORY_IMAGES[article.category] || CATEGORY_IMAGES["Premier League"]; }} alt={article.image ? article.title : `Illustrative football image for ${article.category}`} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{article.category} · {article.publishedAt}</p>
                  <h3 className="mt-3 text-xl font-black leading-snug">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{article.excerpt}</p>
                  {article.discoverySource.sourceUrl && <a href={article.discoverySource.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-gray-300 hover:text-white">Source: {article.discoverySource.sourceName} ↗</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
