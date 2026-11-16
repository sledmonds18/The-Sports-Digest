"use client";

import { useEffect, useState } from "react";

type CricketNewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  publishedAt: string;
  category: "Cricket";
  status: "approved";
  discoverySource: {
    sourceName: string;
    sourceUrl?: string;
    discoveredAt: string;
  };
};

type NewsResponse = {
  success: boolean;
  data: unknown;
};

function isCricketArticle(value: unknown): value is CricketNewsArticle {
  if (!value || typeof value !== "object") return false;
  const article = value as Partial<CricketNewsArticle>;
  return (
    typeof article.id === "string" &&
    typeof article.title === "string" &&
    typeof article.excerpt === "string" &&
    typeof article.publishedAt === "string" &&
    article.category === "Cricket" &&
    article.status === "approved" &&
    !!article.discoverySource &&
    typeof article.discoverySource.sourceName === "string" &&
    typeof article.discoverySource.discoveredAt === "string"
  );
}

async function loadApprovedStories(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  const result = (await response.json()) as NewsResponse;
  if (!result.success || !Array.isArray(result.data)) {
    throw new Error("The news service returned an invalid response.");
  }

  return result.data.filter(isCricketArticle);
}

export default function CricketNews() {
  const [articles, setArticles] = useState<Array<CricketNewsArticle & { region: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      setIsLoading(true);
      setErrorMessage("");
      const results = await Promise.allSettled([
        loadApprovedStories("/api/ghana-sports-news?category=Cricket", controller.signal),
        loadApprovedStories("/api/international-sports-news?category=Cricket", controller.signal),
      ]);

      if (controller.signal.aborted) return;

      const stories: Array<CricketNewsArticle & { region: string }> = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        const region = index === 0 ? "Ghana" : "International";
        if (result.status === "fulfilled") {
          stories.push(...result.value.map((article) => ({ ...article, region })));
        } else {
          const reason = result.reason;
          errors.push(`${region}: ${reason instanceof Error ? reason.message : "Unable to load stories."}`);
          console.error(`Failed to load ${region.toLowerCase()} cricket news:`, reason);
        }
      });

      stories.sort(
        (a, b) =>
          new Date(b.discoverySource.discoveredAt).getTime() -
          new Date(a.discoverySource.discoveredAt).getTime()
      );
      setArticles(stories);
      setErrorMessage(errors.join(" "));
      setIsLoading(false);
    }

    void loadStories();
    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Cricket</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Cricket News</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
            Cricket stories from Ghana and around the world. Every story is reviewed by the newsroom before publication.
          </p>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black sm:text-4xl">Latest cricket stories</h2>
          {errorMessage && (
            <p role="alert" className="mt-5 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-sm text-amber-200">
              Some cricket news could not be loaded. {errorMessage}
            </p>
          )}
          {isLoading ? (
            <p role="status" className="mt-5 text-sm text-gray-400">Loading approved cricket stories…</p>
          ) : articles.length === 0 ? (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400">
              No approved cricket stories are live yet. New stories remain in the editorial queue until an editor approves them.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article key={`${article.region}-${article.id}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black">
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
                      {article.region} · Cricket · {article.publishedAt}
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

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Official sources</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Cricket governing bodies</h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "International Cricket Council", href: "https://www.icc-cricket.com/" },
              { label: "ICC members in Africa", href: "https://www.icc-cricket.com/about/members/africa" },
              { label: "Ghana Cricket Association — ICC profile", href: "https://www.icc-cricket.com/about/members/associate/ghana-cricket-association" },
            ].map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#080808] p-5 transition hover:border-red-500/60">
                <span className="text-sm font-bold leading-6 text-gray-200 group-hover:text-white">{source.label}</span>
                <span aria-hidden="true" className="shrink-0 text-lg text-red-500 transition group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
