"use client";

import { useEffect, useMemo, useState } from "react";
import type { InternationalSportArticle } from "./lib/internationalSportsData";
import type { GhanaSportArticle } from "./lib/ghanaSportsData";
import SportsDeskFooter from "./SportsDeskFooter";

type TransferFilter = "all" | "confirmed" | "reported";
type DeskFilter = "all" | "ghana" | "international";
type TransferArticle = (GhanaSportArticle | InternationalSportArticle) & { desk: "ghana" | "international" };
type TransferFeedStatus = "loading" | "ready" | "error";
const genericTransferPhotos = ["photo-1574629810360-7efbbe195018", "photo-1522778119026-d647f0596c20"];

export default function InternationalTransfersPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [articles, setArticles] = useState<TransferArticle[]>([]);
  const [feedStatus, setFeedStatus] = useState<TransferFeedStatus>("loading");
  const [filter, setFilter] = useState<TransferFilter>("all");
  const [deskFilter, setDeskFilter] = useState<DeskFilter>("all");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const controller = new AbortController();
    const getFeed = async (url: string) => {
      const response = await fetch(url, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error(`Transfer feed request failed: ${response.status}`);
      return response.json();
    };
    Promise.all([
      getFeed("/api/ghana-sports-news?category=Transfers"),
      getFeed("/api/ghana-sports-news?category=Football"),
      getFeed("/api/international-sports-news?category=Transfers"),
    ])
      .then(([ghanaTransfers, ghanaFootball, international]) => {
        const explicitlyTaggedGhana = Array.isArray(ghanaTransfers?.data) ? ghanaTransfers.data as GhanaSportArticle[] : [];
        const legacyGhanaTransfers = Array.isArray(ghanaFootball?.data) ? (ghanaFootball.data as GhanaSportArticle[]).filter((article) => /\b(transfer|loan deal|contract extension|free agent|signs for|signed for|joins club)\b/i.test(`${article.title} ${article.excerpt} ${article.content.join(" ")}`)) : [];
        const uniqueGhana = new Map([...explicitlyTaggedGhana, ...legacyGhanaTransfers].map((article) => [article.id, article]));
        const ghanaStories = [...uniqueGhana.values()].map((article) => ({ ...article, desk: "ghana" as const }));
        const internationalStories = Array.isArray(international?.data) ? international.data.map((article: InternationalSportArticle) => ({ ...article, desk: "international" as const })) : [];
        setArticles([...ghanaStories, ...internationalStories].sort((left, right) =>
          new Date(right.discoverySource.discoveredAt).getTime() - new Date(left.discoverySource.discoveredAt).getTime()
        ));
        setFeedStatus("ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFeedStatus("error");
      });
    return () => controller.abort();
  }, []);

  const filteredArticles = useMemo(() => articles.filter((article) => (filter === "all" || (article.transferStatus || "reported") === filter) && (deskFilter === "all" || article.desk === deskFilter)), [articles, filter, deskFilter]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <section className="relative overflow-hidden border-b-4 border-red-600 bg-gradient-to-br from-red-950 via-black to-zinc-950 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">The Sports Digest · Ghana & International Football</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">Football Transfers</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-gray-300">Follow Ghanaian and international confirmed deals, reported moves, loans and contract news. Choose a desk below to explore each transfer market. Every item is reviewed by our editorial team before publication.</p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 sm:grid-cols-3">
          {[
            ["Confirmed deals", "Marked confirmed only after verification with a club, player or other primary source."],
            ["Reported moves", "Rumours and media reports stay clearly labelled until independently confirmed."],
            ["Deal details", "We include move type, clubs, window and fee only when reliable information is available."],
          ].map(([title, detail]) => <article key={title} className="bg-[#080808] p-5 sm:p-7"><h2 className="font-black text-white">{title}</h2><p className="mt-2 text-sm leading-6 text-gray-400">{detail}</p></article>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.24em] text-red-500">Transfer watch</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Latest transfer stories</h2></div>
          <div className="flex flex-wrap gap-2" aria-label="Filter transfers by desk">
            {(["all", "ghana", "international"] as const).map((value) => <button key={value} type="button" onClick={() => setDeskFilter(value)} className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition ${deskFilter === value ? "border-red-500 bg-red-600 text-white" : "border-white/15 text-gray-300 hover:border-red-500"}`}>{value === "all" ? "Ghana + International" : value}</button>)}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Filter transfers by status">
          {(["all", "confirmed", "reported"] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full border px-4 py-2 text-xs font-bold capitalize transition ${filter === value ? "border-red-500 bg-red-600 text-white" : "border-white/15 text-gray-300 hover:border-red-500"}`}>{value === "all" ? "All moves" : value === "reported" ? "Reported / rumours" : "Confirmed deals"}</button>)}
        </div>

        {feedStatus === "loading" ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-10 text-center text-sm text-gray-400">Loading approved transfer stories…</div>
        ) : feedStatus === "error" ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center"><h3 className="text-lg font-bold">Transfer stories could not be loaded</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">The newsroom feeds are temporarily unavailable. Please refresh the page in a moment.</p></div>
        ) : filteredArticles.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-zinc-950 p-10 text-center">
            <h3 className="text-lg font-bold">{articles.length === 0 ? `No approved ${deskFilter === "all" ? "Ghana or international" : deskFilter} transfer stories yet.` : "No stories match these filters."}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">{articles.length === 0 ? "File a transfer story under the Ghana or International desk in the Editorial Desk. It appears here only after an editor checks the source and approves it." : "Try another desk or transfer status filter."}</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => {
              const confirmed = article.transferStatus === "confirmed";
              const storyImage = article.image && !failedImages[article.id] && !genericTransferPhotos.some((photoId) => article.image?.includes(photoId)) ? article.image : undefined;
              return (
                <article key={`${article.desk}-${article.id}`} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                  {storyImage && <img src={storyImage} onError={() => setFailedImages((current) => ({ ...current, [article.id]: true }))} alt={article.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${confirmed ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{confirmed ? "Confirmed" : "Reported"}</span>
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase text-gray-300">{article.desk}</span>
                      {article.transferType && <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase text-gray-400">{article.transferType}</span>}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{article.publishedAt}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-black leading-snug">{article.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-400">{article.excerpt}</p>
                    {(article.playerName || article.fromClub || article.toClub || article.transferFee || article.transferWindow) && (
                      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-white/10 pt-4 text-xs">
                        {article.playerName && <div className="col-span-2"><dt className="text-gray-500">Player</dt><dd className="mt-0.5 font-bold text-white">{article.playerName}</dd></div>}
                        {article.fromClub && <div><dt className="text-gray-500">From</dt><dd className="mt-0.5 font-bold text-white">{article.fromClub}</dd></div>}
                        {article.toClub && <div><dt className="text-gray-500">To</dt><dd className="mt-0.5 font-bold text-white">{article.toClub}</dd></div>}
                        {article.transferFee && <div><dt className="text-gray-500">Reported fee</dt><dd className="mt-0.5 font-bold text-white">{article.transferFee}</dd></div>}
                        {article.transferWindow && <div><dt className="text-gray-500">Window</dt><dd className="mt-0.5 font-bold text-white">{article.transferWindow}</dd></div>}
                      </dl>
                    )}
                    {article.discoverySource.sourceUrl && <a href={article.discoverySource.sourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-xs font-bold text-gray-300 hover:text-white">Source: {article.discoverySource.sourceName} ↗</a>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <SportsDeskFooter desk="Football Transfers Desk" description="Reporting Ghanaian and international confirmed deals and reported moves after editorial review." onNavigate={onNavigate} />
    </main>
  );
}
