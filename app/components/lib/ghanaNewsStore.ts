import fs from "fs";
import os from "os";
import path from "path";
import { INITIAL_GHANA_ARTICLES, GhanaSportArticle } from "./ghanaSportsData";

interface PersistentDataPayload {
  version: string;
  lastUpdated: string;
  lastIngestedAt: string | null;
  lastIngestCount: number;
  articles: GhanaSportArticle[];
}

export interface IngestResult {
  added: number;
  skippedDuplicates: number;
  queueFull: boolean;
}

export interface SportCoverageCount {
  approved: number;
  pending: number;
}

/** Upper bound on unverified stories held in the queue. */
export const MAX_PENDING_QUEUE = 120;

/**
 * Shared Persistent News Store
 * Persists all approved stories, pending reviews, and editorial verification
 * audit trails to disk (data/ghana-sports-news.json) so no data is lost on
 * server restarts.
 */
class GhanaNewsStore {
  private static instance: GhanaNewsStore;
  private articles: GhanaSportArticle[] = [];
  private lastIngestedAt: string | null = null;
  private lastIngestCount: number = 0;
  private readonly storageFilePath: string;
  private isLoadedFromDisk: boolean = false;
  private storageWritable: boolean = true;
  private storageLastError: string | null = null;
  private storageIsEphemeral: boolean = false;

  private constructor() {
    const dataDir = path.join(process.cwd(), "data");
    this.storageFilePath = path.join(dataDir, "ghana-sports-news.json");

    // Initialize directory and load initial state
    this.initStorage(dataDir);
  }

  public static getInstance(): GhanaNewsStore {
    if (!GhanaNewsStore.instance) {
      GhanaNewsStore.instance = new GhanaNewsStore();
    }
    return GhanaNewsStore.instance;
  }

  private initStorage(dataDir: string) {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, "utf-8");
        const parsed: PersistentDataPayload = JSON.parse(raw);
        if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
          this.articles = this.deduplicate(parsed.articles);
          this.lastIngestedAt = parsed.lastIngestedAt || null;
          this.lastIngestCount = parsed.lastIngestCount || 0;
          this.isLoadedFromDisk = true;
          return;
        }
      }

      // Initialize with seed data and save to disk
      this.articles = this.deduplicate(INITIAL_GHANA_ARTICLES);
      this.persistSync();
      this.isLoadedFromDisk = true;
    } catch (err) {
      console.warn("Could not read from persistent store, using in-memory fallback:", err);
      this.articles = this.deduplicate(INITIAL_GHANA_ARTICLES);
      this.storageWritable = false;
      this.storageLastError =
        err instanceof Error ? err.message : "Unknown storage error";
    }
  }

  /**
   * Writes the payload atomically (temp file + rename).
   * Serverless platforms mount the project directory read-only, so a fallback
   * to the OS temp directory keeps the newsroom usable (ephemeral) instead of
   * silently dropping editorial decisions.
   */
  private persistSync() {
    const payload: PersistentDataPayload = {
      version: "2.1.0",
      lastUpdated: new Date().toISOString(),
      lastIngestedAt: this.lastIngestedAt,
      lastIngestCount: this.lastIngestCount,
      articles: this.articles,
    };

    const serialized = JSON.stringify(payload, null, 2);

    const targets: Array<{ file: string; ephemeral: boolean }> = [
      { file: this.storageFilePath, ephemeral: false },
    ];

    if (!this.storageWritable) {
      const fallbackDir = path.join(os.tmpdir(), "sports-digest-newsroom");
      try {
        fs.mkdirSync(fallbackDir, { recursive: true });
        targets.push({
          file: path.join(fallbackDir, "ghana-sports-news.json"),
          ephemeral: true,
        });
      } catch {
        // Nothing else we can do; in-memory state still serves this instance.
      }
    }

    for (const target of targets) {
      try {
        const temporaryPath = `${target.file}.tmp`;
        fs.writeFileSync(temporaryPath, serialized, "utf-8");
        fs.renameSync(temporaryPath, target.file);
        this.storageWritable = true;
        this.storageIsEphemeral = target.ephemeral;
        this.storageLastError = null;
        return;
      } catch (err) {
        this.storageWritable = false;
        this.storageLastError =
          err instanceof Error ? err.message : "Unknown storage error";
        console.error("Failed to write to persistent news store:", err);
      }
    }
  }

  /**
   * Removes duplicates by article id, headline and originating source URL so
   * the same story syndicated by two desks only ever appears once.
   */
  private deduplicate(list: GhanaSportArticle[]): GhanaSportArticle[] {
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const seenUrls = new Set<string>();

    return list.filter((article) => {
      const idKey = article.id.toLowerCase();
      const titleKey = article.title.trim().toLowerCase();
      const urlKey = (article.discoverySource?.sourceUrl || "")
        .trim()
        .toLowerCase()
        .replace(/[?#].*$/, "");

      if (
        seenIds.has(idKey) ||
        seenTitles.has(titleKey) ||
        (urlKey.length > 12 && seenUrls.has(urlKey))
      ) {
        return false;
      }

      seenIds.add(idKey);
      seenTitles.add(titleKey);
      if (urlKey.length > 12) seenUrls.add(urlKey);
      return true;
    });
  }

  public getArticles(status?: string, category?: string): GhanaSportArticle[] {
    let list = this.deduplicate(this.articles);

    if (status && status !== "all") {
      list = list.filter((a) => a.status === status);
    }

    if (category && category !== "All Sports") {
      list = list.filter((a) => a.category === category);
    }

    return list;
  }

  /** Approved/pending breakdown for every Ghanaian discipline. */
  public getCoverageCounts(): Record<string, SportCoverageCount> {
    const counts: Record<string, SportCoverageCount> = {};
    for (const article of this.articles) {
      if (!counts[article.category]) {
        counts[article.category] = { approved: 0, pending: 0 };
      }
      if (article.status === "approved") counts[article.category].approved += 1;
      if (article.status === "pending") counts[article.category].pending += 1;
    }
    return counts;
  }

  public getCounts() {
    const pending = this.articles.filter((a) => a.status === "pending").length;
    return {
      total: this.articles.length,
      approved: this.articles.filter((a) => a.status === "approved").length,
      pending,
      rejected: this.articles.filter((a) => a.status === "rejected").length,
      lastIngestedAt: this.lastIngestedAt,
      lastIngestCount: this.lastIngestCount,
      pendingQueueCapacity: MAX_PENDING_QUEUE,
      pendingQueueFull: pending >= MAX_PENDING_QUEUE,
      coverage: this.getCoverageCounts(),
      persistentStorage: {
        active: true,
        path: "data/ghana-sports-news.json",
        isLoadedFromDisk: this.isLoadedFromDisk,
        writable: this.storageWritable,
        ephemeral: this.storageIsEphemeral,
        lastError: this.storageLastError,
      },
    };
  }

  public approveArticle(
    articleId: string,
    editorName: string = "Shem Bravon Lamptey (Editor-in-Chief)",
    notes: string = "Verified by Sports Digest Editorial Desk before publication.",
    updates?: Partial<GhanaSportArticle>
  ): GhanaSportArticle | null {
    const index = this.articles.findIndex((a) => a.id === articleId);
    if (index === -1) return null;

    this.articles[index] = {
      ...this.articles[index],
      ...(updates || {}),
      status: "approved",
      publishedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      editorialVerification: {
        verifiedBy: editorName,
        verifiedAt: new Date().toISOString(),
        factChecked: true,
        sourceVerified: true,
        editorialNotes: notes,
      },
    };

    this.articles = this.deduplicate(this.articles);
    this.persistSync();
    return this.articles[index];
  }

  public updateArticle(
    articleId: string,
    updates: Partial<GhanaSportArticle>
  ): GhanaSportArticle | null {
    const index = this.articles.findIndex((a) => a.id === articleId);
    if (index === -1) return null;

    this.articles[index] = {
      ...this.articles[index],
      ...updates,
    };

    this.articles = this.deduplicate(this.articles);
    this.persistSync();
    return this.articles[index];
  }

  public rejectArticle(articleId: string): boolean {
    const initialLen = this.articles.length;
    this.articles = this.articles.filter((a) => a.id !== articleId);
    const changed = this.articles.length < initialLen;
    if (changed) {
      this.persistSync();
    }
    return changed;
  }

  /**
   * Adds automatically discovered stories to the pending queue.
   * Duplicates (id / headline / source URL) are rejected, and the queue is
   * capped so a noisy feed cannot bury the newsroom.
   */
  public addIngestedArticles(newArticles: GhanaSportArticle[]): IngestResult {
    const existingIds = new Set(
      this.articles.map((article) => article.id.toLowerCase())
    );
    const existingTitles = new Set(
      this.articles.map((article) => article.title.trim().toLowerCase())
    );
    const existingUrls = new Set(
      this.articles
        .map((article) =>
          (article.discoverySource?.sourceUrl || "")
            .trim()
            .toLowerCase()
            .replace(/[?#].*$/, "")
        )
        .filter((url) => url.length > 12)
    );

    let skippedDuplicates = 0;
    const pendingCount = this.articles.filter((a) => a.status === "pending").length;
    let queueFull = false;

    const uniqueIncoming: GhanaSportArticle[] = [];
    for (const incoming of newArticles) {
      const urlKey = (incoming.discoverySource?.sourceUrl || "")
        .trim()
        .toLowerCase()
        .replace(/[?#].*$/, "");

      const isDuplicate =
        existingIds.has(incoming.id.toLowerCase()) ||
        existingTitles.has(incoming.title.trim().toLowerCase()) ||
        (urlKey.length > 12 && existingUrls.has(urlKey));

      if (isDuplicate) {
        skippedDuplicates += 1;
        continue;
      }

      if (pendingCount + uniqueIncoming.length >= MAX_PENDING_QUEUE) {
        queueFull = true;
        break;
      }

      existingIds.add(incoming.id.toLowerCase());
      existingTitles.add(incoming.title.trim().toLowerCase());
      if (urlKey.length > 12) existingUrls.add(urlKey);
      uniqueIncoming.push(incoming);
    }

    if (uniqueIncoming.length > 0) {
      this.articles = [...uniqueIncoming, ...this.articles];
      this.articles = this.deduplicate(this.articles);
    }

    this.lastIngestedAt = new Date().toISOString();
    this.lastIngestCount = uniqueIncoming.length;
    this.persistSync();

    return {
      added: uniqueIncoming.length,
      skippedDuplicates,
      queueFull,
    };
  }

  /**
   * The manual half of hybrid collection: a correspondent, federation desk or
   * press release files a story directly into the pending queue.
   */
  public addEditorialSubmission(
    article: GhanaSportArticle
  ): GhanaSportArticle | null {
    const pendingCount = this.articles.filter((a) => a.status === "pending").length;
    if (pendingCount >= MAX_PENDING_QUEUE) return null;

    const existingUrls = new Set(
      this.articles
        .map((entry) =>
          (entry.discoverySource?.sourceUrl || "")
            .trim()
            .toLowerCase()
            .replace(/[?#].*$/, "")
        )
        .filter((url) => url.length > 12)
    );
    const urlKey = (article.discoverySource?.sourceUrl || "")
      .trim()
      .toLowerCase()
      .replace(/[?#].*$/, "");
    if (urlKey.length > 12 && existingUrls.has(urlKey)) return null;

    const submission: GhanaSportArticle = {
      ...article,
      status: "pending",
      publishedAt: "Pending Editorial Approval",
      editorialVerification: {
        verifiedBy: "Pending Verification",
        verifiedAt: "",
        factChecked: false,
        sourceVerified: false,
        editorialNotes:
          article.editorialVerification?.editorialNotes ||
          "Manually filed by the newsroom. Verify against a primary source before publishing.",
      },
    };

    this.articles = [submission, ...this.articles];
    this.articles = this.deduplicate(this.articles);
    this.persistSync();
    return this.articles[0];
  }

  public resetStore(): GhanaSportArticle[] {
    this.articles = this.deduplicate([...INITIAL_GHANA_ARTICLES]);
    this.lastIngestedAt = new Date().toISOString();
    this.lastIngestCount = 0;
    this.persistSync();
    return this.articles;
  }
}

export const ghanaNewsStore = GhanaNewsStore.getInstance();
