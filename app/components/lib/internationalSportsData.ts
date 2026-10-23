import type { DiscoverySourceType, EditorialStatus } from "./ghanaSportsData";

export const INTERNATIONAL_SPORTS_CATEGORIES = [
  "All International",
  "Premier League",
  "Champions League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1",
  "MLS",
  "FIFA",
  "UEFA",
  "Transfers",
] as const;

export type InternationalCategory = (typeof INTERNATIONAL_SPORTS_CATEGORIES)[number];
export type InternationalArticleCategory = Exclude<InternationalCategory, "All International">;

export interface InternationalSportArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: InternationalArticleCategory;
  image?: string;
  slug: string;
  author: string;
  publishedAt: string;
  status: EditorialStatus;
  featured?: boolean;
  transferStatus?: "confirmed" | "reported";
  transferType?: "permanent" | "loan" | "free transfer" | "contract extension";
  playerName?: string;
  fromClub?: string;
  toClub?: string;
  transferFee?: string;
  transferWindow?: string;
  readTime: string;
  discoverySource: {
    type: DiscoverySourceType;
    sourceName: string;
    sourceUrl?: string;
    discoveredAt: string;
    rawSnippet?: string;
  };
  editorialVerification?: {
    verifiedBy: string;
    verifiedAt: string;
    factChecked: boolean;
    sourceVerified: boolean;
    editorialNotes: string;
  };
}
