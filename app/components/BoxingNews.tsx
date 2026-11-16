"use client";

import { useEffect, useState } from "react";
import type { GhanaSportArticle } from "./lib/ghanaSportsData";
import type { InternationalSportArticle } from "./lib/internationalSportsData";

type BoxingArticle = GhanaSportArticle | InternationalSportArticle;
type NewsDesk = "Ghana" | "International";

export default function BoxingNews() {
  const [articles, setArticles] = useState<Array<{ article: BoxingArticle; desk: NewsDesk }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBoxingNews() {
      setLoading(true);
      setError("");

      try {
        const [ghanaResponse, internationalResponse] = await Promise.all([
          fetch("/api/ghana-sports-news?category=Boxing", { signal: controller.signal }),
          fetch("/api/international-sports-news?category=Boxing", { signal: controller.signal }),
        ]);
        if (!ghanaResponse.ok || !internationalResponse.ok) {
          throw new Error("Boxing news could not be loaded.");
        }

        const [ghanaResult, internationalResult] = await Promise.all([
          ghanaResponse.json(),
          internationalResponse.json(),
        ]);
        if (!ghanaResult.success || !internationalResult.success) {
          throw new Error("Boxing news could not be loaded.");
        }
        setArticles([
          ...(Array.isArray(ghanaResult.data)
            ? ghanaResult.data.map((article: GhanaSportArticle) => ({ article, desk: "Ghana" as const }))
            : []),
          ...(Array.isArray(internationalResult.data)
            ? internationalResult.data.map((article: InternationalSportArticle) => ({ article, desk: "International" as const }))
            : []),
        ]);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") return;
        setError(loadError instanceof Error ? loadError.message : "Boxing news could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadBoxingNews();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Boxing</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Boxing News</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
            Follow boxing in Ghana and around the world. Every story is reviewed by our editorial desk before publication.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-4xl">Latest boxing stories</h2>
          {loading ? (
            <p className="mt-5 text-sm text-gray-400">Loading approved boxing stories…</p>
          ) : error ? (
            <p role="alert" className="mt-5 text-sm text-red-400">{error}</p>
          ) : articles.length === 0 ? (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400">
              No approved boxing stories yet. New leads stay unpublished until an editor verifies and approves them.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map(({ article, desk }) => (
                <article key={`${desk}-${article.id}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  {article.image && (
                    <img
                      src={article.image}
                      onError={(event) => event.currentTarget.remove()}
                      alt={article.title}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                      {desk} Boxing · {article.publishedAt}
                    </p>
                    <h3 className="mt-3 text-xl font-black leading-snug">{article.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{article.excerpt}</p>
                    {article.discoverySource.sourceUrl && (
                      <a
                        href={article.discoverySource.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex text-xs font-bold text-gray-300 hover:text-white"
                      >
                        Source: {article.discoverySource.sourceName} ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
