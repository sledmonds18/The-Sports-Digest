"use client";

import { useEffect, useState } from "react";

type VolleyballNewsArticle = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  publishedAt: string;
  category: string;
  status: string;
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

function isVolleyballArticle(value: unknown): value is VolleyballNewsArticle {
  if (!value || typeof value !== "object") return false;
  const article = value as Partial<VolleyballNewsArticle>;
  return (
    typeof article.id === "string" &&
    typeof article.title === "string" &&
    typeof article.excerpt === "string" &&
    typeof article.publishedAt === "string" &&
    article.category === "Volleyball" &&
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

  return result.data.filter(isVolleyballArticle);
}

export default function VolleyballNews() {
  const [articles, setArticles] = useState<Array<VolleyballNewsArticle & { region: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStories() {
      setIsLoading(true);
      setErrorMessage("");
      const results = await Promise.allSettled([
        loadApprovedStories("/api/ghana-sports-news?category=Volleyball", controller.signal),
        loadApprovedStories("/api/international-sports-news?category=Volleyball", controller.signal),
      ]);

      if (controller.signal.aborted) return;

      const stories: Array<VolleyballNewsArticle & { region: string }> = [];
      const errors: string[] = [];

      results.forEach((result, index) => {
        const region = index === 0 ? "Ghana" : "International";
        if (result.status === "fulfilled") {
          stories.push(...result.value.map((article) => ({ ...article, region })));
        } else {
          const reason = result.reason;
          errors.push(`${region}: ${reason instanceof Error ? reason.message : "Unable to load stories."}`);
          console.error(`Failed to load ${region.toLowerCase()} volleyball news:`, reason);
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
    <section className="border-y border-white/10 bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Ghana and international volleyball</p>
        <h2 className="mt-3 text-3xl font-black sm:text-4xl">Latest Volleyball News</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
          News from Ghana and around the world. Every story is reviewed by the newsroom before it can appear here.
        </p>

        {errorMessage && (
          <p role="alert" className="mt-5 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-sm text-amber-200">
            Some volleyball news could not be loaded. {errorMessage}
          </p>
        )}

        {isLoading ? (
          <p role="status" className="mt-6 text-sm text-gray-400">Loading approved volleyball stories…</p>
        ) : articles.length === 0 ? (
          <p className="mt-6 rounded-xl border border-white/10 bg-black p-5 text-sm leading-6 text-gray-400">
            No approved volleyball stories are live yet. New stories stay in the editorial queue until an editor approves them.
          </p>
        ) : (
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    {article.region} · Volleyball · {article.publishedAt}
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
  );
}
