"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  GhanaSportArticle,
  SportCategory,
  GHANA_SPORTS_CATEGORIES,
  SPORT_PRESET_IMAGES,
  DiscoverySourceType,
} from "../components/lib/ghanaSportsData";
import {
  GHANA_FEED_REGISTRY,
  getCoverageMatrix,
} from "../components/lib/ghanaFeedRegistry";
import { EDITORIAL_TOKEN_HEADER } from "../components/lib/editorialAuth";

type SourceHealth = {
  id: string;
  name: string;
  publisher: string;
  tier: string;
  status: string;
  httpStatus?: number;
  itemsFound: number;
  itemsFresh: number;
  itemsQueued: number;
  durationMs: number;
  message?: string;
};

const EMPTY_FILING = {
  title: "",
  category: "Football" as Exclude<SportCategory, "All Sports">,
  author: "",
  excerpt: "",
  content: "",
  image: "",
  sourceName: "",
  sourceUrl: "",
  discoveryType: "field_correspondent" as DiscoverySourceType,
};

export default function EditorialDeskPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [newsroomToken, setNewsroomToken] = useState("");

  const [articles, setArticles] = useState<GhanaSportArticle[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [selectedSport, setSelectedSport] = useState<SportCategory>("All Sports");
  const [editingArticle, setEditingArticle] = useState<GhanaSportArticle | null>(null);

  const [editorName, setEditorName] = useState("Shem Bravon Lamptey (Editor-in-Chief)");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [sendBreakingAlert, setSendBreakingAlert] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [isFilingOpen, setIsFilingOpen] = useState(false);
  const [filing, setFiling] = useState({ ...EMPTY_FILING });
  const [isFiling, setIsFiling] = useState(false);

  const [sourceHealth, setSourceHealth] = useState<SourceHealth[]>([]);
  const [isCheckingFeeds, setIsCheckingFeeds] = useState(false);

  const coverageMatrix = useMemo(() => getCoverageMatrix(), []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  /** Every newsroom request carries the editorial token. */
  const newsroomHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      [EDITORIAL_TOKEN_HEADER]: newsroomToken,
    }),
    [newsroomToken]
  );

  const loadAllArticles = async () => {
    try {
      const res = await fetch("/api/ghana-sports-news?status=all", {
        headers: { [EDITORIAL_TOKEN_HEADER]: newsroomToken },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data);
        }
      } else if (res.status === 401) {
        showToast("⚠ Editorial passkey rejected. Please sign in again.");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Failed to load articles:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllArticles();
      const refreshInterval = window.setInterval(loadAllArticles, 60_000);
      return () => window.clearInterval(refreshInterval);
    }
  }, [isAuthenticated, newsroomToken]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = passkeyInput.trim();
    if (!entered) {
      setPasskeyError("Enter your newsroom passkey.");
      return;
    }
    // The server performs the real check on the first newsroom request.
    setNewsroomToken(entered);
    setIsAuthenticated(true);
    setPasskeyError("");
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setNewsroomToken("");
    setPasskeyInput("");
    setArticles([]);
    setSourceHealth([]);
  };

  // Filtered views
  const pendingQueue = useMemo(
    () => articles.filter((a) => a.status === "pending"),
    [articles]
  );

  const approvedLive = useMemo(
    () => articles.filter((a) => a.status === "approved"),
    [articles]
  );

  const currentTabArticles = useMemo(() => {
    const list = activeTab === "pending" ? pendingQueue : approvedLive;
    if (selectedSport === "All Sports") return list;
    return list.filter((a) => a.category === selectedSport);
  }, [activeTab, pendingQueue, approvedLive, selectedSport]);

  // Action: Upload Image File from Computer
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingArticle) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { [EDITORIAL_TOKEN_HEADER]: newsroomToken },
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setEditingArticle({ ...editingArticle, image: data.url });
        showToast("✓ Image uploaded from your computer successfully!");
      } else {
        showToast(data.error || "⚠ Failed to upload image.");
      }
    } catch {
      showToast("⚠ Error uploading image file.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Action: Approve & Publish
  const handleApprove = async (
    articleId: string,
    customNotes?: string,
    updates?: Partial<Pick<GhanaSportArticle, "title" | "excerpt" | "category" | "image">>
  ) => {
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: newsroomHeaders,
        body: JSON.stringify({
          action: "approve",
          articleId,
          editorName,
          notes:
            customNotes ||
            verificationNotes ||
            "Verified by Sports Digest Editorial Desk before publication.",
          updates:
            updates ||
            (editingArticle?.id === articleId
              ? {
                  title: editingArticle.title,
                  excerpt: editingArticle.excerpt,
                  category: editingArticle.category,
                  image: editingArticle.image,
                }
              : undefined),
        }),
      });

      if (res.ok) {
        if (sendBreakingAlert && editingArticle) {
          try {
            await fetch("/api/newsletter/breaking-alert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                [EDITORIAL_TOKEN_HEADER]: newsroomToken,
              },
              body: JSON.stringify({
                title: editingArticle.title,
                excerpt: editingArticle.excerpt,
                category: editingArticle.category,
                author: editorName,
                slug: editingArticle.slug,
              }),
            });
            showToast("✓ Published live and Breaking Alert dispatched via Resend!");
          } catch {
            showToast("✓ Article approved and published live!");
          }
        } else {
          showToast("✓ Article approved and published live to The Sports Digest!");
        }

        setEditingArticle(null);
        setVerificationNotes("");
        setSendBreakingAlert(false);
        await loadAllArticles();
      }
    } catch {
      showToast("⚠ Failed to approve article.");
    }
  };

  // Action: Save Edits & Image (without changing publication status)
  const handleSaveEdits = async () => {
    if (!editingArticle) return;
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: newsroomHeaders,
        body: JSON.stringify({
          action: "update",
          articleId: editingArticle.id,
          updates: {
            title: editingArticle.title,
            excerpt: editingArticle.excerpt,
            category: editingArticle.category,
            image: editingArticle.image,
          },
        }),
      });

      if (res.ok) {
        showToast("✓ Article edits and image saved successfully!");
        setEditingArticle(null);
        await loadAllArticles();
      } else {
        showToast("⚠ Failed to save edits.");
      }
    } catch {
      showToast("⚠ Failed to save edits.");
    }
  };

  // Action: Reject Story
  const handleReject = async (articleId: string) => {
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: newsroomHeaders,
        body: JSON.stringify({
          action: "reject",
          articleId,
          notes: "Unverified claims or failed primary corroboration.",
        }),
      });

      if (res.ok) {
        showToast("✕ Story rejected and removed from publishing queue.");
        setEditingArticle(null);
        await loadAllArticles();
      }
    } catch {
      showToast("⚠ Failed to reject article.");
    }
  };

  // Action: Trigger Background Crawler Scan
  const handleRunCrawler = async () => {
    setIsCrawling(true);
    try {
      const res = await fetch("/api/cron/ingest", {
        headers: { [EDITORIAL_TOKEN_HEADER]: newsroomToken },
      });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.sourceHealth)) {
          setSourceHealth(json.sourceHealth);
        }
        showToast(
          `🤖 Automated Crawler: ${json.newStoriesQueued} new wire stories discovered!`
        );
        await loadAllArticles();
      } else if (res.status === 401) {
        showToast("⚠ Editorial passkey rejected. Please sign in again.");
        setIsAuthenticated(false);
      }
    } catch {
      showToast("⚠ Crawler scan encountered an issue.");
    } finally {
      setIsCrawling(false);
    }
  };

  // Action: Verify every monitored feed without creating stories
  const handleCheckFeeds = async () => {
    setIsCheckingFeeds(true);
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: newsroomHeaders,
        body: JSON.stringify({ action: "check_feeds" }),
      });
      if (res.ok) {
        const json = await res.json();
        setSourceHealth(Array.isArray(json.sourceHealth) ? json.sourceHealth : []);
        const healthy = (json.sourceHealth || []).filter(
          (entry: SourceHealth) => entry.status === "ok"
        ).length;
        showToast(
          `🔍 Feed check complete: ${healthy}/${(json.sourceHealth || []).length} sources responding.`
        );
      } else if (res.status === 401) {
        showToast("⚠ Editorial passkey rejected. Please sign in again.");
        setIsAuthenticated(false);
      }
    } catch {
      showToast("⚠ Feed check failed.");
    } finally {
      setIsCheckingFeeds(false);
    }
  };

  // Action: File a story manually (the editorial half of hybrid collection)
  const handleFileStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filing.title.trim() || !filing.excerpt.trim()) {
      showToast("⚠ A headline and an excerpt are required.");
      return;
    }

    setIsFiling(true);
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: newsroomHeaders,
        body: JSON.stringify({
          action: "submit_story",
          title: filing.title,
          category: filing.category,
          author: filing.author || editorName,
          excerpt: filing.excerpt,
          content: filing.content,
          image: filing.image,
          sourceName: filing.sourceName || "Sports Digest News Desk",
          sourceUrl: filing.sourceUrl,
          discoveryType: filing.discoveryType,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        showToast("✓ Story filed into the verification queue.");
        setFiling({ ...EMPTY_FILING });
        setIsFilingOpen(false);
        setActiveTab("pending");
        await loadAllArticles();
      } else if (res.status === 401) {
        showToast("⚠ Editorial passkey rejected. Please sign in again.");
        setIsAuthenticated(false);
      } else {
        showToast(json.message || "⚠ Could not file the story.");
      }
    } catch {
      showToast("⚠ Could not file the story.");
    } finally {
      setIsFiling(false);
    }
  };

  // Action: Reset Staging
  const handleReset = async () => {
    if (!confirm("Reset all articles back to clean initial verified seed state?")) return;
    try {
      const res = await fetch("/api/ghana-sports-news", {
        method: "POST",
        headers: newsroomHeaders,
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        showToast("✓ Newsroom reset to clean seed state.");
        await loadAllArticles();
      }
    } catch {
      showToast("⚠ Failed to reset newsroom.");
    }
  };

  // ==========================================
  // PASSKEY GATE / LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">
              The Sports Digest
            </p>
          </div>

          <h1 className="text-2xl font-black">Editorial Desk Access</h1>
          <p className="mt-2 text-xs text-zinc-400">
            Publishing Policy: Editorial approval is required before any story goes
            live. Enter your newsroom passkey to manage queues.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Editorial Passkey
              </label>
              <input
                type="password"
                placeholder="Enter passkey (e.g. digest2026)"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none"
              />
              {passkeyError && (
                <p className="mt-1.5 text-xs text-red-400">{passkeyError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-500"
            >
              Enter Editorial Desk →
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-500">
            <span>Development Key: <code>digest2026</code></span>
            <Link href="/" className="text-zinc-400 hover:text-white">
              Back to Site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // EDITORIAL DESK DASHBOARD
  // ==========================================
  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      {/* TOAST NOTIFICATION */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-red-500/40 bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl backdrop-blur">
          {toastMsg}
        </div>
      )}

      {/* TOP NAV BAR */}
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded bg-red-600/20 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-red-500">
              Newsroom Desk
            </span>
            <h1 className="text-lg font-black tracking-tight sm:text-xl">
              Editorial Verification & Publishing Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFilingOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-200 transition hover:border-red-500 hover:text-white"
              title="File a story manually from a correspondent, federation desk or press release"
            >
              <span>✍️ File Story</span>
            </button>

            <button
              type="button"
              onClick={handleCheckFeeds}
              disabled={isCheckingFeeds}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-200 transition hover:border-zinc-500 hover:text-white disabled:opacity-50"
              title="Check that every monitored Ghana sports feed is reachable"
            >
              <span>{isCheckingFeeds ? "Checking..." : "🔍 Check Feeds"}</span>
            </button>

            <button
              type="button"
              onClick={handleRunCrawler}
              disabled={isCrawling}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-bold text-zinc-200 transition hover:border-zinc-500 hover:text-white disabled:opacity-50"
            >
              <span>{isCrawling ? "Scanning Feeds..." : "⚡ Run Crawler Now"}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 hover:border-amber-500 hover:text-amber-400"
              title="Reset newsroom to seed state"
            >
              ↺ Reset Staging
            </button>

            <Link
              href="/"
              className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-red-500 hover:text-red-400"
            >
              View Public Site →
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
              title="Lock the newsroom"
            >
              Lock Desk
            </button>
          </div>
        </div>
      </header>

      {/* STATS & AUTOMATION HEALTH */}
      <section className="border-b border-zinc-900 bg-zinc-950/50 px-6 py-5">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Pending Verification
            </p>
            <p className="mt-1 text-2xl font-black text-amber-400">
              {pendingQueue.length}{" "}
              <span className="text-xs font-normal text-zinc-500">stories waiting</span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Approved & Live
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-400">
              {approvedLive.length}{" "}
              <span className="text-xs font-normal text-zinc-500">publicly live</span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Storage Engine
            </p>
            <p className="mt-1 text-sm font-bold text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Persistent JSON Disk Store</span>
            </p>
            <p className="text-[11px] text-zinc-500">data/ghana-sports-news.json</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Automated Crawler
            </p>
            <p className="mt-1 text-sm font-bold text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active (Every 30m)</span>
            </p>
            <p className="text-[11px] text-zinc-500">
              {GHANA_FEED_REGISTRY.length} Monitored Sources ·{" "}
              {coverageMatrix.filter((entry) => entry.covered).length}/
              {coverageMatrix.length} Sports Covered
            </p>
          </div>
        </div>
      </section>

      {/* MANUAL STORY FILING (the editorial half of hybrid collection) */}
      {isFilingOpen && (
        <section className="border-b border-zinc-800 bg-zinc-950 px-6 py-6">
          <form
            onSubmit={handleFileStory}
            className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white">
                  File a Story into the Verification Queue
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Field correspondents, federation desks and press releases enter
                  the same queue as automated discoveries. Nothing is published
                  until an editor approves it.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFilingOpen(false)}
                className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-white"
              >
                Close ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Headline
                </label>
                <input
                  type="text"
                  value={filing.title}
                  onChange={(e) => setFiling({ ...filing, title: e.target.value })}
                  placeholder="Hearts of Oak edge Basake Holy Stars to go top of the GPL"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Sport Category
                </label>
                <select
                  value={filing.category}
                  onChange={(e) =>
                    setFiling({
                      ...filing,
                      category: e.target.value as Exclude<SportCategory, "All Sports">,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                >
                  {GHANA_SPORTS_CATEGORIES.filter((c) => c !== "All Sports").map(
                    (sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Discovery Channel
                </label>
                <select
                  value={filing.discoveryType}
                  onChange={(e) =>
                    setFiling({
                      ...filing,
                      discoveryType: e.target.value as DiscoverySourceType,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                >
                  <option value="field_correspondent">Field Correspondent</option>
                  <option value="federation_dispatch">Federation Dispatch</option>
                  <option value="press_release">Press Release</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Byline
                </label>
                <input
                  type="text"
                  value={filing.author}
                  onChange={(e) => setFiling({ ...filing, author: e.target.value })}
                  placeholder={editorName}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Primary Source Name
                </label>
                <input
                  type="text"
                  value={filing.sourceName}
                  onChange={(e) =>
                    setFiling({ ...filing, sourceName: e.target.value })
                  }
                  placeholder="Ghana Football Association Match Commissioner"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Primary Source URL
                </label>
                <input
                  type="url"
                  value={filing.sourceUrl}
                  onChange={(e) =>
                    setFiling({ ...filing, sourceUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Image URL
                </label>
                <input
                  type="text"
                  value={filing.image}
                  onChange={(e) => setFiling({ ...filing, image: e.target.value })}
                  placeholder="Leave blank to use a category preset"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Standfirst / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={filing.excerpt}
                  onChange={(e) => setFiling({ ...filing, excerpt: e.target.value })}
                  placeholder="One or two sentences that carry the story."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-bold text-zinc-300">
                  Body (separate paragraphs with a blank line)
                </label>
                <textarea
                  rows={6}
                  value={filing.content}
                  onChange={(e) => setFiling({ ...filing, content: e.target.value })}
                  placeholder="Paste the verified copy here."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isFiling}
                className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {isFiling ? "Filing..." : "→ File Into Verification Queue"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SOURCE HEALTH & COVERAGE MATRIX */}
      <section className="border-b border-zinc-900 bg-zinc-950/40 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-white">
                Monitored Source Registry & Coverage
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Every Ghanaian discipline must have at least one live source.
                Run “Check Feeds” to verify reachability right now.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {coverageMatrix.map((entry) => (
                <span
                  key={entry.sport}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    entry.covered
                      ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                      : "border-red-500/40 bg-red-950/40 text-red-300"
                  }`}
                  title={`${entry.sourceCount} source(s): ${entry.sources.join(", ")}`}
                >
                  {entry.sport} · {entry.sourceCount}
                </span>
              ))}
            </div>
          </div>

          {sourceHealth.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sourceHealth.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-zinc-200">
                      {entry.name}
                    </p>
                    <p className="truncate text-[11px] text-zinc-500">
                      {entry.tier.replace("_", " ")} · {entry.itemsFresh} fresh /{" "}
                      {entry.itemsFound} items
                    </p>
                    {entry.message && (
                      <p className="truncate text-[11px] text-amber-400">
                        {entry.message}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                      entry.status === "ok"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : entry.status === "empty"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUEUE TABS & SPORT FILTER */}
      <section className="mx-auto max-w-7xl px-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                activeTab === "pending"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Verification Queue ({pendingQueue.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("approved")}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                activeTab === "approved"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Live Approved Articles ({approvedLive.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">Filter Sport:</span>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as SportCategory)}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              {GHANA_SPORTS_CATEGORIES.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ARTICLES LIST */}
      <section className="mx-auto max-w-7xl px-6 py-6">
        {currentTabArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-400">
            <p className="text-base font-semibold">
              {activeTab === "pending"
                ? "No stories currently pending verification in this category."
                : "No live approved stories in this category."}
            </p>
            {activeTab === "pending" && (
              <button
                type="button"
                onClick={handleRunCrawler}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500"
              >
                ⚡ Run Automated Wire Crawler
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {currentTabArticles.map((article) => (
              <div
                key={article.id}
                className={`flex flex-col justify-between rounded-xl border p-5 ${
                  article.status === "pending"
                    ? "border-amber-500/30 bg-zinc-950"
                    : "border-zinc-800 bg-zinc-900/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                        article.status === "pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {article.category} · {article.status.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                      {article.discoverySource.sourceName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3.5">
                    {article.image && <div className="relative aspect-[16/10] sm:w-36 sm:h-24 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.parentElement?.remove();
                        }}
                      />
                    </div>}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 rounded-lg border border-zinc-800/80 bg-black/40 p-2.5 text-[11px] text-zinc-400 space-y-1">
                    <p className="truncate">
                      <strong className="text-zinc-300">Channel:</strong>{" "}
                      {article.discoverySource.type.replace("_", " ")}
                    </p>
                    {article.editorialVerification && (
                      <p className="line-clamp-1">
                        <strong className="text-zinc-300">Editorial Notes:</strong>{" "}
                        {article.editorialVerification.editorialNotes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-zinc-500 truncate">
                    By {article.author}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(article)}
                      className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
                    >
                      Inspect / Edit ✎
                    </button>

                    {article.status === "pending" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReject(article.id)}
                          className="rounded-lg border border-red-500/30 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/30"
                          title="Reject story"
                        >
                          ✕ Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(article.id)}
                          className="rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-red-500"
                        >
                          ✓ Publish Live
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReject(article.id)}
                        className="rounded-lg border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-500 hover:border-red-500 hover:text-red-400"
                        title="Unpublish or archive story"
                      >
                        Unpublish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* INSPECT / EDIT MODAL SUITE */}
      {editingArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setEditingArticle(null)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm text-zinc-300 hover:text-white"
            >
              ✕
            </button>

            <span className="rounded bg-red-600/20 px-2.5 py-1 text-xs font-bold uppercase text-red-400">
              Editorial Verification Suite
            </span>

            <h2 className="mt-3 text-xl font-black">Review & Verify Story</h2>

            <div className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">Sport Category</label>
                <select
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      category: e.target.value as Exclude<SportCategory, "All Sports">,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                >
                  {GHANA_SPORTS_CATEGORIES.filter((c) => c !== "All Sports").map(
                    (sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">Excerpt</label>
                <textarea
                  rows={3}
                  value={editingArticle.excerpt}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-zinc-300">
                    Story Image & Media
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-600/10 px-3 py-1 text-[11px] font-bold text-red-400 hover:bg-red-600 hover:text-white transition">
                    <span>{isUploading ? "⏳ Uploading..." : "📁 Upload from Computer"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live Image Preview */}
                {editingArticle.image && <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 mb-2.5">
                  <img
                    src={editingArticle.image}
                    alt={editingArticle.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.parentElement?.remove();
                    }}
                  />
                  <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 backdrop-blur">
                    {isUploading ? "Uploading new photo..." : "Live Preview"}
                  </div>
                </div>}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Or paste external image URL..."
                    value={editingArticle.image || ""}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, image: e.target.value })
                    }
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                  />
                  {editingArticle.image && (
                    <button
                      type="button"
                      onClick={() => setEditingArticle({ ...editingArticle, image: "" })}
                      className="shrink-0 rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-red-500 hover:text-white"
                    >
                      Remove image
                    </button>
                  )}
                  <label className="cursor-pointer shrink-0 inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white transition">
                    <span>{isUploading ? "..." : "Browse PC"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Chips */}
                {SPORT_PRESET_IMAGES[editingArticle.category] && (
                  <div className="mt-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Or select from curated {editingArticle.category} graphics:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SPORT_PRESET_IMAGES[editingArticle.category].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() =>
                            setEditingArticle({ ...editingArticle, image: preset.url })
                          }
                          className={`rounded-md border px-2.5 py-1 text-[11px] font-medium transition ${
                            editingArticle.image === preset.url
                              ? "border-red-500 bg-red-600/20 text-white font-bold"
                              : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1">
                  Editor-in-Chief Verification Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Record verification checklist (e.g. Primary source confirmed with match commissioner / GFA dispatch)."
                  value={
                    verificationNotes ||
                    editingArticle.editorialVerification?.editorialNotes ||
                    ""
                  }
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder-zinc-500"
                />
              </div>

              <div className="rounded-lg border border-zinc-800 bg-black/60 p-3 space-y-1 text-zinc-400">
                <p>
                  <strong className="text-zinc-300">Origin:</strong>{" "}
                  {editingArticle.discoverySource.type.replace("_", " ")} (
                  {editingArticle.discoverySource.sourceName})
                </p>
                {editingArticle.discoverySource.sourceUrl && (
                  <p>
                    <strong className="text-zinc-300">Source Link:</strong>{" "}
                    <a
                      href={editingArticle.discoverySource.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-400 hover:underline"
                    >
                      {editingArticle.discoverySource.sourceUrl}
                    </a>
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-zinc-800/60">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendBreakingAlert}
                    onChange={(e) => setSendBreakingAlert(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-0"
                  />
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <span>🚨</span>
                    <span>Dispatch Breaking Email Bulletin to Subscribers (via Resend)</span>
                  </span>
                </label>
                <p className="mt-1 pl-6 text-[10px] text-zinc-500">
                  Sends formatted breaking sports notification to the email configured in .env.local.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => handleReject(editingArticle.id)}
                className="rounded-lg border border-red-500/40 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30"
              >
                ✕ Reject / Archive
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdits}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-200 hover:border-zinc-500 hover:text-white"
                >
                  💾 Save Edits
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApprove(
                      editingArticle.id,
                      verificationNotes || editingArticle.editorialVerification?.editorialNotes,
                      {
                        title: editingArticle.title,
                        excerpt: editingArticle.excerpt,
                        category: editingArticle.category,
                        image: editingArticle.image,
                      }
                    )
                  }
                  className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500"
                >
                  ✓ Verify & Publish Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
