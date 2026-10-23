import fs from "fs";
import os from "os";
import path from "path";
import type { InternationalSportArticle } from "./internationalSportsData";

const MAX_PENDING = 120;

class InternationalNewsStore {
  private articles: InternationalSportArticle[] = [];
  private lastIngestedAt: string | null = null;
  private readonly file = path.join(process.cwd(), "data", "international-sports-news.json");
  private writable = true;
  private ephemeral = false;

  constructor() {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      const fallback = path.join(os.tmpdir(), "sports-digest-newsroom", "international-sports-news.json");
      const savedFile = fs.existsSync(this.file) ? this.file : fs.existsSync(fallback) ? fallback : null;
      if (savedFile) {
        const saved = JSON.parse(fs.readFileSync(savedFile, "utf8"));
        if (Array.isArray(saved.articles)) this.articles = saved.articles;
        this.lastIngestedAt = saved.lastIngestedAt || null;
        this.ephemeral = savedFile === fallback;
      } else this.persist();
    } catch {
      const fallback = path.join(os.tmpdir(), "sports-digest-newsroom", "international-sports-news.json");
      try {
        const saved = JSON.parse(fs.readFileSync(fallback, "utf8"));
        this.articles = Array.isArray(saved.articles) ? saved.articles : [];
        this.lastIngestedAt = saved.lastIngestedAt || null;
        this.writable = false;
        this.ephemeral = true;
      } catch { this.articles = []; }
    }
  }

  private persist() {
    const payload = JSON.stringify({ version: "1.0.0", lastUpdated: new Date().toISOString(), lastIngestedAt: this.lastIngestedAt, articles: this.articles }, null, 2);
    for (const [target, ephemeral] of [[this.file, false], [path.join(os.tmpdir(), "sports-digest-newsroom", "international-sports-news.json"), true]] as const) {
      try {
        fs.mkdirSync(path.dirname(target), { recursive: true });
        const tmp = `${target}.tmp`;
        fs.writeFileSync(tmp, payload, "utf8");
        fs.renameSync(tmp, target);
        this.writable = !ephemeral;
        this.ephemeral = ephemeral;
        if (!ephemeral) return;
      } catch { /* Continue to the ephemeral fallback. */ }
    }
  }

  getArticles(status = "approved", category = "All International") {
    return this.articles.filter((article) => (status === "all" || article.status === status) && (category === "All International" || article.category === category));
  }

  getCounts() {
    return { total: this.articles.length, pending: this.articles.filter((item) => item.status === "pending").length, approved: this.articles.filter((item) => item.status === "approved").length, lastIngestedAt: this.lastIngestedAt, persistentStorage: { path: this.ephemeral ? "OS temporary storage" : "data/international-sports-news.json", writable: this.writable, ephemeral: this.ephemeral } };
  }

  addMany(incoming: InternationalSportArticle[]) {
    let added = 0;
    let skippedDuplicates = 0;
    let queueFull = false;
    for (const article of incoming) {
      const duplicate = this.articles.some((saved) => saved.title.toLowerCase() === article.title.toLowerCase() || (!!article.discoverySource.sourceUrl && saved.discoverySource.sourceUrl === article.discoverySource.sourceUrl));
      if (duplicate) { skippedDuplicates++; continue; }
      if (this.articles.filter((item) => item.status === "pending").length >= MAX_PENDING) { queueFull = true; break; }
      this.articles.unshift(article);
      added++;
    }
    this.lastIngestedAt = new Date().toISOString();
    this.persist();
    return { added, skippedDuplicates, queueFull };
  }

  approve(id: string, editor: string, notes: string, updates?: Partial<InternationalSportArticle>) {
    const article = this.articles.find((item) => item.id === id);
    if (!article) return null;
    Object.assign(article, updates, { status: "approved", publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), editorialVerification: { verifiedBy: editor, verifiedAt: new Date().toISOString(), factChecked: true, sourceVerified: true, editorialNotes: notes } });
    this.persist();
    return article;
  }

  update(id: string, updates: Partial<InternationalSportArticle>) { const article = this.articles.find((item) => item.id === id); if (!article) return null; Object.assign(article, updates); this.persist(); return article; }
  reject(id: string) { const before = this.articles.length; this.articles = this.articles.filter((item) => item.id !== id); if (before !== this.articles.length) this.persist(); return before !== this.articles.length; }
  reset() { this.articles = []; this.lastIngestedAt = null; this.persist(); return this.articles; }
  submit(article: InternationalSportArticle) { if (this.articles.filter((item) => item.status === "pending").length >= MAX_PENDING) return null; if (this.articles.some((saved) => saved.title.toLowerCase() === article.title.toLowerCase() || (!!article.discoverySource.sourceUrl && saved.discoverySource.sourceUrl === article.discoverySource.sourceUrl))) return null; this.articles.unshift(article); this.persist(); return article; }
}

export const internationalNewsStore = new InternationalNewsStore();
