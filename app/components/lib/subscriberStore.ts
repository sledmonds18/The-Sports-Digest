import fs from "fs";
import os from "os";
import path from "path";

interface PersistentSubscriberPayload {
  version: string;
  lastUpdated: string;
  subscribers: DigestSubscriber[];
  lastDispatch: DigestDispatch | null;
}

export interface DigestSubscriber {
  email: string;
  subscribedAt: string;
  status: "active" | "unsubscribed";
}

export interface DigestDispatch {
  at: string;
  /** Recipients the bulletin was successfully delivered to. */
  delivered: number;
  /** How many active subscribers existed at dispatch time. */
  subscriberCount: number;
  /** The headline that went out, for the newsroom's recent-dispatch readout. */
  headline: string;
}

export interface SubscribeResult {
  added: boolean;
  reactivated: boolean;
  totalActive: number;
}

/**
 * Persistent Subscriber Store
 * Backs the "Subscribe" boxes on the public pages and the breaking-bulletin
 * dispatch. Persists to data/subscribers.json (temp file + rename) so signups
 * survive server restarts, with an OS-temp fallback for read-only serverless
 * deployments — the same strategy as the newsroom store.
 */
class SubscriberStore {
  private static instance: SubscriberStore;
  private subscribers: DigestSubscriber[] = [];
  private lastDispatch: DigestDispatch | null = null;
  private readonly storageFilePath: string;
  private isLoadedFromDisk: boolean = false;
  private storageWritable: boolean = true;
  private storageLastError: string | null = null;
  private storageIsEphemeral: boolean = false;

  private constructor() {
    const dataDir = path.join(process.cwd(), "data");
    this.storageFilePath = path.join(dataDir, "subscribers.json");
    this.initStorage(dataDir);
  }

  public static getInstance(): SubscriberStore {
    if (!SubscriberStore.instance) {
      SubscriberStore.instance = new SubscriberStore();
    }
    return SubscriberStore.instance;
  }

  private initStorage(dataDir: string) {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.storageFilePath)) {
        const raw = fs.readFileSync(this.storageFilePath, "utf-8");
        const parsed: PersistentSubscriberPayload = JSON.parse(raw);
        if (Array.isArray(parsed.subscribers)) {
          this.subscribers = this.normalize(parsed.subscribers);
          this.lastDispatch = parsed.lastDispatch || null;
          this.isLoadedFromDisk = true;
          return;
        }
      }

      this.persistSync();
      this.isLoadedFromDisk = true;
    } catch (err) {
      console.warn(
        "Could not read subscriber store, using in-memory fallback:",
        err
      );
      this.storageWritable = false;
      this.storageLastError =
        err instanceof Error ? err.message : "Unknown storage error";
    }
  }

  private persistSync() {
    const payload: PersistentSubscriberPayload = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      subscribers: this.subscribers,
      lastDispatch: this.lastDispatch,
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
          file: path.join(fallbackDir, "subscribers.json"),
          ephemeral: true,
        });
      } catch {
        // In-memory state still serves this instance.
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
        console.error("Failed to write subscriber store:", err);
      }
    }
  }

  /** Trim, lowercase and dedupe the roster (one record per email). */
  private normalize(list: DigestSubscriber[]): DigestSubscriber[] {
    const seen = new Set<string>();
    return list
      .filter((entry) => {
        const key = (entry.email || "").trim().toLowerCase();
        if (!key || key.length > 320 || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((entry) => ({
        email: entry.email.trim().toLowerCase(),
        subscribedAt: entry.subscribedAt || new Date().toISOString(),
        status: entry.status === "unsubscribed" ? "unsubscribed" : "active",
      }));
  }

  public subscribe(email: string): SubscribeResult {
    const key = email.trim().toLowerCase();
    const existing = this.subscribers.find((entry) => entry.email === key);

    if (existing) {
      if (existing.status === "unsubscribed") {
        existing.status = "active";
        existing.subscribedAt = new Date().toISOString();
        this.persistSync();
        return {
          added: false,
          reactivated: true,
          totalActive: this.countActive(),
        };
      }
      return { added: false, reactivated: false, totalActive: this.countActive() };
    }

    const subscriber: DigestSubscriber = {
      email: key,
      subscribedAt: new Date().toISOString(),
      status: "active",
    };
    this.subscribers = [subscriber, ...this.subscribers];
    this.persistSync();
    return { added: true, reactivated: false, totalActive: this.countActive() };
  }

  /** Called when a recipient opts out. Not an editorial action. */
  public unsubscribe(email: string): boolean {
    const key = email.trim().toLowerCase();
    const existing = this.subscribers.find((entry) => entry.email === key);
    if (!existing || existing.status === "unsubscribed") return false;

    existing.status = "unsubscribed";
    this.persistSync();
    return true;
  }

  /** Active (deliverable) recipients for the breaking bulletin. */
  public getActiveSubscribers(): DigestSubscriber[] {
    return this.subscribers
      .filter((entry) => entry.status === "active")
      .map((entry) => ({ email: entry.email, subscribedAt: entry.subscribedAt, status: "active" as const }));
  }

  /**
   * Called by the breaking-alert route after a dispatch so the newsroom can
   * show how many readers the last bulletin actually reached.
   */
  public recordDispatch(
    delivered: number,
    subscriberCount: number,
    headline: string
  ): DigestDispatch {
    this.lastDispatch = {
      at: new Date().toISOString(),
      delivered,
      subscriberCount,
      headline,
    };
    this.persistSync();
    return this.lastDispatch;
  }

  public getLastDispatch(): DigestDispatch | null {
    return this.lastDispatch;
  }

  public countActive(): number {
    return this.subscribers.filter((entry) => entry.status === "active").length;
  }

  public getCounts() {
    return {
      total: this.subscribers.length,
      active: this.countActive(),
      unsubscribed: this.subscribers.length - this.countActive(),
      latestSignupAt: this.subscribers[0]?.subscribedAt || null,
      lastDispatch: this.lastDispatch,
      persistentStorage: {
        active: true,
        path: "data/subscribers.json",
        isLoadedFromDisk: this.isLoadedFromDisk,
        writable: this.storageWritable,
        ephemeral: this.storageIsEphemeral,
        lastError: this.storageLastError,
      },
    };
  }
}

export const subscriberStore = SubscriberStore.getInstance();
