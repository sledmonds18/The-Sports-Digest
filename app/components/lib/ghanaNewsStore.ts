import fs from "fs";
import path from "path";
import {
  INITIAL_GHANA_ARTICLES,
  GhanaSportArticle,
  SportCategory,
  EditorialStatus,
} from "./ghanaSportsData";

interface PersistentDataPayload {
  version: string;
  lastUpdated: string;
  lastIngestedAt: string | null;
  lastIngestCount: number;
  articles: GhanaSportArticle[];
}

/**
 * Shared Persistent News Store
 * Persists all approved stories, pending reviews, and editorial verification
 * audit trails to disk (data/ghana-sports-news.json) so no data is lost on server restarts.
 */
class GhanaNewsStore {
  private static instance: GhanaNewsStore;
  private articles: GhanaSportArticle[] = [];
  private lastIngestedAt: string | null = null;
  private lastIngestCount: number = 0;
  private readonly storageFilePath: string;
  private isLoadedFromDisk: boolean = false;

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
    }
  }

  private persistSync() {
    try {
      const payload: PersistentDataPayload = {
        version: "2.0.0",
        lastUpdated: new Date().toISOString(),
        lastIngestedAt: this.lastIngestedAt,
        lastIngestCount: this.lastIngestCount,
        articles: this.articles,
      };

      const temporaryPath = `${this.storageFilePath}.tmp`;
      fs.writeFileSync(temporaryPath, JSON.stringify(payload, null, 2), "utf-8");
      fs.renameSync(temporaryPath, this.storageFilePath);
    } catch (err) {
      console.error("Failed to write to persistent news store:", err);
    }
  }

  private deduplicate(list: GhanaSportArticle[]): GhanaSportArticle[] {
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

  public getCounts() {
    return {
      total: this.articles.length,
      approved: this.articles.filter((a) => a.status === "approved").length,
      pending: this.articles.filter((a) => a.status === "pending").length,
      rejected: this.articles.filter((a) => a.status === "rejected").length,
      lastIngestedAt: this.lastIngestedAt,
      lastIngestCount: this.lastIngestCount,
      persistentStorage: {
        active: true,
        path: "data/ghana-sports-news.json",
        isLoadedFromDisk: this.isLoadedFromDisk,
      },
    };
  }

  public approveArticle(
    articleId: string,
    editorName: string = "Shem Bravon Lamptey (Editor-in-Chief)",
    notes: string = "Verified by Sports Digest Editorial Desk before publication.",
    updates?: Partial<Pick<GhanaSportArticle, "title" | "excerpt" | "category" | "image" | "author">>
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

  public addIngestedArticles(newArticles: GhanaSportArticle[]): number {
    const countBefore = this.articles.length;

    // Filter out articles that match existing titles or IDs
    const uniqueIncoming = newArticles.filter(
      (incoming) =>
        !this.articles.some(
          (existing) =>
            existing.id.toLowerCase() === incoming.id.toLowerCase() ||
            existing.title.trim().toLowerCase() === incoming.title.trim().toLowerCase()
        )
    );

    if (uniqueIncoming.length > 0) {
      this.articles = [...uniqueIncoming, ...this.articles];
      this.articles = this.deduplicate(this.articles);
    }

    const added = this.articles.length - countBefore;
    this.lastIngestedAt = new Date().toISOString();
    this.lastIngestCount = added;
    this.persistSync();
    return added;
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
