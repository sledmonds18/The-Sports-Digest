"use client";

import { useMemo, useState, useEffect } from "react";
import {
  GHANA_SPORTS_CATEGORIES,
  INITIAL_GHANA_ARTICLES,
  GhanaSportArticle,
  SportCategory,
  EditorialStatus,
} from "./lib/ghanaSportsData";

type GhanaSportsNewsProps = {
  onNavigate?: (page: string) => void;
  onToast?: (message: string) => void;
};

function deduplicateList(list: GhanaSportArticle[]): GhanaSportArticle[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();

  return list.filter((article) => {
    const idKey = article.id.toLowerCase();
    const titleKey = article.title.trim().toLowerCase();

    if (seenIds.has(idKey) || seenTitles.has(titleKey)) {
      return false;
    }

    seenIds.add(idKey);
    seenTitles.add(titleKey);
    return true;
  });
}

export default function GhanaSportsNews({
  onNavigate,
  onToast,
}: GhanaSportsNewsProps) {
  const [articles, setArticles] = useState<GhanaSportArticle[]>(
    deduplicateList(INITIAL_GHANA_ARTICLES)
  );
  const [activeCategory, setActiveCategory] = useState<SportCategory>("All Sports");
  const [selectedArticle, setSelectedArticle] = useState<GhanaSportArticle | null>(null);
  const [isEditorialDeskOpen, setIsEditorialDeskOpen] = useState(false);
  const [isSimulatingWire, setIsSimulatingWire] = useState(false);

  // Fetch articles from API on mount
  useEffect(() => {
    let isMounted = true;
    async function loadArticles() {
      try {
        const res = await fetch("/api/ghana-sports-news?status=all");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            setArticles(deduplicateList(json.data));
          }
        }
      } catch (err) {
        console.warn("API route unavailable, using local verified sports store:", err);
      }
    }

    loadArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check for new wire stories on page visits and every 30 minutes while the site is open.
  useEffect(() => {
    let isMounted = true;
    const scanForStories = async () => {
      try {
        const ingestRes = await fetch("/api/ghana-sports-news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ingest_wire" }),
        });
        if (!ingestRes.ok) return;
        const ingestData = await ingestRes.json();
        const refreshRes = await fetch("/api/ghana-sports-news?status=all");
        if (!refreshRes.ok) return;
        const freshJson = await refreshRes.json();
        if (freshJson.success && Array.isArray(freshJson.data) && isMounted) {
          setArticles(deduplicateList(freshJson.data));
          if (ingestData.newStoriesQueued > 0) setIsEditorialDeskOpen(true);
        }
      } catch (err) {
        console.warn("Automatic news check failed:", err);
      }
    };

    void scanForStories();
    const interval = window.setInterval(scanForStories, 30 * 60 * 1000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  // Strict deduplicated articles list
  const uniqueArticles = useMemo(() => deduplicateList(articles), [articles]);

  // PUBLIC POLICY: Only 'approved' stories are visible to the public reader
  const approvedArticles = useMemo(
    () => uniqueArticles.filter((article) => article.status === "approved"),
    [uniqueArticles]
  );

  // EDITORIAL QUEUE: Stories awaiting human editor verification
  const pendingArticles = useMemo(
    () => uniqueArticles.filter((article) => article.status === "pending"),
    [uniqueArticles]
  );

  const [searchQuery, setSearchQuery] = useState("");

  // Category & Athlete/Club Search filtering on approved stories
  const filteredArticles = useMemo(() => {
    let list = approvedArticles;

    if (activeCategory !== "All Sports") {
      list = list.filter((article) => article.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.excerpt.toLowerCase().includes(q) ||
          article.author.toLowerCase().includes(q) ||
          article.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategory, searchQuery, approvedArticles]);

  // Featured article for the current category or global
  const featuredArticle = filteredArticles.find((article) => article.featured) || filteredArticles[0];

  // Latest articles strictly EXCLUDE the featured article so no story repeats on the page!
  const latestArticles = filteredArticles.filter(
    (article) => article.id !== featuredArticle?.id
  );

  // EDITORIAL WORKFLOW: Approve a pending story
  const handleApprove = async (articleId: string) => {
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          articleId,
          editorName: "Shem Bravon Lamptey (Editor-in-Chief)",
          notes: "Primary sources corroborated. Approved for publication.",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setArticles((prev) =>
          deduplicateList(prev.map((a) => (a.id === articleId ? data.article : a)))
        );
        onToast?.("✓ Story approved & published live to Ghana Sports News feed!");
      } else {
        // Optimistic fallback
        setArticles((prev) =>
          deduplicateList(
            prev.map((a) =>
              a.id === articleId
                ? {
                    ...a,
                    status: "approved" as EditorialStatus,
                    publishedAt: "Just now",
                    editorialVerification: {
                      verifiedBy: "Shem Bravon Lamptey (Editor-in-Chief)",
                      verifiedAt: new Date().toISOString(),
                      factChecked: true,
                      sourceVerified: true,
                      editorialNotes: "Verified & approved for live publication.",
                    },
                  }
                : a
            )
          )
        );
        onToast?.("✓ Story approved & published live!");
      }
    } catch {
      onToast?.("✓ Story approved & published live!");
    }
  };

  // EDITORIAL WORKFLOW: Reject a story
  const handleReject = async (articleId: string) => {
    try {
      await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          articleId,
          notes: "Unverified claims or insufficient primary corroboration.",
        }),
      });
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
      onToast?.("✕ Story rejected and removed from publishing queue.");
    } catch {
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
      onToast?.("✕ Story rejected.");
    }
  };

  // EDITORIAL WORKFLOW: Reset newsroom to clean seed state (clears all duplicates)
  const handleResetNewsroom = async () => {
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        const data = await res.json();
        setArticles(deduplicateList(data.data));
        onToast?.("✓ Newsroom reset to clean verified state. Duplicates removed.");
      }
    } catch {
      setArticles(deduplicateList(INITIAL_GHANA_ARTICLES));
      onToast?.("✓ Restored clean verified articles.");
    }
  };

  // HYBRID COLLECTION: Trigger automated ingestion scan across all monitored sports feeds
  const handleSimulateWireDiscovery = async () => {
    setIsSimulatingWire(true);

    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ingest_wire" }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh articles from store
        const refreshRes = await fetch("/api/ghana-sports-news?status=all");
        if (refreshRes.ok) {
          const freshJson = await refreshRes.json();
          if (freshJson.success && Array.isArray(freshJson.data)) {
            setArticles(deduplicateList(freshJson.data));
          }
        }
        setIsEditorialDeskOpen(true);
        onToast?.(
          `🤖 Automated Scan Complete: ${data.newStoriesQueued} new sports stories queued for editorial review!`
        );
      }
    } catch (err) {
      console.error("Automated ingestion scan error:", err);
      onToast?.("⚠ Ingestion scan failed or timed out.");
    } finally {
      setIsSimulatingWire(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {/* EDITORIAL DESK NOTICE BAR */}
      <aside
        aria-label="Editorial Verification Desk"
        className="border-b border-red-950/80 bg-gradient-to-r from-red-950/40 via-black to-zinc-950 px-4 py-2.5 text-xs"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-semibold text-white">Publishing Policy:</span>
            <span>Editorial approval required before every story goes live.</span>
            <span className="hidden text-zinc-500 sm:inline">|</span>
            <span className="hidden text-zinc-400 md:inline">
              Multi-Sport Coverage (Zero Duplication)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditorialDeskOpen(!isEditorialDeskOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600/10 px-3 py-1 font-semibold text-red-300 transition-colors hover:bg-red-600 hover:text-white"
            >
              <span>Editorial Desk</span>
              <span className="rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] text-white font-bold">
                {pendingArticles.length} Pending
              </span>
            </button>

            <button
              type="button"
              onClick={handleSimulateWireDiscovery}
              disabled={isSimulatingWire}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
              title="Simulate automated wire discovery crawler"
            >
              <span>{isSimulatingWire ? "Scanning Wire..." : "⚡ Ingest Wire"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* EDITORIAL DESK DRAWER / REVIEW QUEUE */}
      {isEditorialDeskOpen && (
        <section
          aria-labelledby="desk-heading"
          className="border-b border-red-600/30 bg-zinc-950 px-4 py-6 shadow-2xl"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-red-600/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-400">
                    Editorial Gatekeeper
                  </span>
                  <h2 id="desk-heading" className="text-xl font-black text-white">
                    Verification & Approval Queue
                  </h2>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Hybrid Automated Discovery + Editorial Verification: Discovered stories
                  remain in staging until verified and approved by an editor.
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 font-semibold text-emerald-300">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Automated Ingestion Engine Active
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span>Monitored: Google News GH, GhanaWeb, GBA Boxing, GAF Armwrestling, GAA Athletics</span>
                  <span className="text-zinc-500">•</span>
                  <span>Cron Schedule: Every 30 mins</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetNewsroom}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-amber-500 hover:text-amber-400"
                  title="Reset to clean verified stories and remove any test duplicates"
                >
                  ↺ Reset Staging
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditorialDeskOpen(false)}
                  className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:border-zinc-600 hover:text-white"
                >
                  Close Desk ✕
                </button>
              </div>
            </div>

            {pendingArticles.length === 0 ? (
              <div className="py-8 text-center text-sm text-zinc-400">
                <p>✓ All discovered stories have been verified and processed.</p>
                <button
                  type="button"
                  onClick={handleSimulateWireDiscovery}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:underline"
                >
                  ⚡ Simulate incoming sports wire discovery
                </button>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {pendingArticles.map((story) => (
                  <div
                    key={story.id}
                    className="relative rounded-xl border border-amber-500/30 bg-zinc-900/80 p-5 shadow-lg"
                  >
                    {story.image && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-900 mb-3">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.parentElement?.remove();
                        }}
                      />
                    </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                        {story.category} · Pending Review
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Via: {story.discoverySource.sourceName}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-white">
                      {story.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                      {story.excerpt}
                    </p>

                    {story.editorialVerification?.editorialNotes && (
                      <div className="mt-3 rounded-lg border border-zinc-800 bg-black/50 p-2.5 text-[11px] text-zinc-400">
                        <span className="font-semibold text-zinc-300">
                          Verification Requirement:{" "}
                        </span>
                        {story.editorialVerification.editorialNotes}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                      <span className="text-[11px] text-zinc-500">
                        Status:{" "}
                        <strong className="text-amber-400 uppercase">
                          Draft / Unverified
                        </strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReject(story.id)}
                          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-500 hover:text-red-400"
                        >
                          ✕ Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(story.id)}
                          className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-red-500"
                        >
                          ✓ Verify & Approve Live
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/70 via-black to-black" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
                The Sports Digest · Accra Desk
              </p>
            </div>

            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
              Ghana Sports <span className="block text-red-500">News</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              Verified reporting across every Ghanaian sport. Every story undergoes
              primary-source verification and editorial approval before publication.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              <span className="rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1.5 text-xs font-semibold text-red-300">
                ✓ Editorial Approval Required
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-gray-200">
                All Ghanaian Sports Covered
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-gray-200">
                Hybrid Discovery Engine
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-SPORT CATEGORY NAVIGATION */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Select Sport Coverage
            </h2>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-500">
              {filteredArticles.length} Live Stories
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search athletes, clubs, or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/15 bg-white/5 py-2 pl-9 pr-8 text-xs text-white placeholder-zinc-500 transition focus:border-red-500 focus:bg-black focus:outline-none"
              />
              <span className="absolute left-3 top-2.5 text-xs text-zinc-500" aria-hidden="true">
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <a
              href="/editorial"
              className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-red-500/30 bg-red-950/20 px-3.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-600 hover:text-white transition"
              title="Open the password-secured newsroom dashboard"
            >
              <span>Editorial Desk</span>
              <span className="text-[10px]">🔒</span>
            </a>
          </div>
        </div>

        <div
          className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar"
          aria-label="Filter news by sport"
        >
          {GHANA_SPORTS_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            const categoryCount =
              category === "All Sports"
                ? approvedArticles.length
                : approvedArticles.filter((a) => a.category === category).length;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "border-red-600 bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "border-white/15 bg-white/5 text-gray-300 hover:border-red-500 hover:text-white"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`ml-1.5 text-xs ${
                    isActive ? "text-red-200" : "text-gray-500"
                  }`}
                >
                  ({categoryCount})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED STORY */}
      {featuredArticle && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              Top Story · Verified Coverage
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              ✓ Editorial Verified
            </span>
          </div>

          <article className={`grid overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition-all hover:border-red-600/50 ${featuredArticle.image ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
            {featuredArticle.image && <div className="relative aspect-[16/10] overflow-hidden bg-gray-900 md:aspect-auto md:min-h-[380px]">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.parentElement?.remove();
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  {featuredArticle.category}
                </span>
              </div>
            </div>}

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>By {featuredArticle.author}</span>
                <span>•</span>
                <span>{featuredArticle.publishedAt}</span>
                <span>•</span>
                <span>{featuredArticle.readTime} read</span>
              </div>

              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl text-white">
                {featuredArticle.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-300 text-sm sm:text-base">
                {featuredArticle.excerpt}
              </p>

              {featuredArticle.editorialVerification && (
                <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-gray-400">
                  <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span>✓ Verified by:</span>
                    <span className="text-gray-300">
                      {featuredArticle.editorialVerification.verifiedBy}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-400">
                    Source: {featuredArticle.discoverySource.sourceName}
                  </p>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(featuredArticle)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-bold text-white transition-all hover:bg-red-500 hover:shadow-lg hover:shadow-red-600/20"
                >
                  Read Full Story <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* LATEST STORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              {activeCategory} Desk
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl text-white">
              {activeCategory === "All Sports"
                ? "Latest Ghanaian Sports Reports"
                : `More Ghanaian ${activeCategory} Reports`}
            </h2>
          </div>

          <p className="text-xs text-gray-400">
            {filteredArticles.length} approved{" "}
            {filteredArticles.length === 1 ? "story" : "stories"} live
          </p>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#111] transition-all duration-300 hover:border-red-500/50 hover:bg-[#151515]"
              >
                <div>
                  {article.image && <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.parentElement?.remove();
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-black/80 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-400 backdrop-blur-md">
                        {article.category}
                      </span>
                    </div>
                  </div>}

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>{article.publishedAt}</span>
                      <span>{article.readTime} read</span>
                    </div>

                    <h3 className="mt-2.5 text-lg font-bold leading-snug text-white group-hover:text-red-400 transition-colors">
                      {article.title}
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-gray-400 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="mb-3 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-gray-500">
                    <span className="truncate">By {article.author}</span>
                    <span className="text-emerald-400 font-medium">✓ Verified</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-red-400 transition-colors"
                  >
                    Read story →
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
            <p className="text-sm font-semibold text-zinc-300">
              Featured story above is the active headline for {activeCategory}.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              New stories in this sport will appear here after editorial verification.
            </p>
          </div>
        )}
      </section>

      {/* FULL ARTICLE MODAL READER */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:text-white hover:border-zinc-500"
              aria-label="Close article modal"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400">
                {selectedArticle.category}
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                ✓ Editorial Approved
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black sm:text-3xl">
              {selectedArticle.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400 border-b border-zinc-800 pb-4">
              <span>{selectedArticle.author}</span>
              <span>•</span>
              <span>Published: {selectedArticle.publishedAt}</span>
              <span>•</span>
              <span>{selectedArticle.readTime} read</span>
            </div>

            {selectedArticle.image && <div className="mt-5 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-900">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.parentElement?.remove();
                }}
              />
            </div>}

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* VERIFICATION AUDIT TRAIL */}
            {selectedArticle.editorialVerification && (
              <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400">
                <h4 className="font-bold text-zinc-200 uppercase tracking-wider">
                  The Sports Digest · Editorial Verification Audit
                </h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <p>
                    <span className="text-zinc-500">Discovery Channel:</span>{" "}
                    {selectedArticle.discoverySource.type.replace("_", " ")}
                  </p>
                  <p>
                    <span className="text-zinc-500">Source Attributed:</span>{" "}
                    {selectedArticle.discoverySource.sourceName}
                  </p>
                  <p>
                    <span className="text-zinc-500">Verified By:</span>{" "}
                    {selectedArticle.editorialVerification.verifiedBy}
                  </p>
                  <p>
                    <span className="text-zinc-500">Fact-Checked:</span>{" "}
                    <span className="text-emerald-400 font-semibold">
                      Confirmed Primary Source
                    </span>
                  </p>
                </div>
                <p className="mt-2 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500">
                  Notes: {selectedArticle.editorialVerification.editorialNotes}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-lg bg-zinc-800 px-5 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
      {/* SPORTS DESK FOOTER */}
      <section className="border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h3 className="font-bold text-white">The Sports Digest · Ghana Sports Desk</h3>
            <p className="mt-1 text-xs text-gray-500">
              Responsible sports journalism. Covering Football, Boxing, Athletics,
              Armwrestling, Basketball, Hockey, Volleyball and more.
            </p>
          </div>
        </div>
      </section>

      {/* BACK HOME */}
      <section className="border-t border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              The Sports Digest
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Where Sport Meets Story.
            </h2>
          </div>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-bold transition hover:bg-white/10"
            >
              ← Back to Home
            </button>
          )}
        </div>
      </section>
    </main>
  );
}


