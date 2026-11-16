import type { InternationalArticleCategory } from "./internationalSportsData";

export interface InternationalFeed {
  id: string;
  name: string;
  publisher: string;
  category: InternationalArticleCategory;
  url: string;
  tier: "wire_aggregator";
  enabled: boolean;
}

const queries: Array<[InternationalArticleCategory, string]> = [
  ["Premier League", 'English Premier League football'],
  ["Champions League", 'UEFA Champions League football'],
  ["La Liga", 'La Liga Spanish football'],
  ["Bundesliga", 'Bundesliga German football'],
  ["Serie A", 'Serie A Italian football'],
  ["Ligue 1", 'Ligue 1 French football'],
  ["MLS", 'Major League Soccer MLS'],
  ["FIFA", 'FIFA international football'],
  ["UEFA", 'UEFA European football'],
  ["Baseball", 'MLB Major League Baseball official news games teams World Series'],
  ["Boxing", 'international boxing world title fight boxing news'],
  ["Formula 1", 'Formula 1 Grand Prix F1 drivers teams'],
  ["Transfers", 'football transfers confirmed deals official announcements'],
  ["Transfers", 'football transfer reports rumours clubs players'],
  ["Transfers", 'Ghanaian footballers transfer moves abroad'],
  ["Volleyball", 'international volleyball FIVB OR "Volleyball World" OR CEV OR "Nations League"'],
  ["Cricket", 'international cricket ICC OR "Cricket World Cup" OR "Test cricket" OR T20'],
];

export const INTERNATIONAL_FEED_REGISTRY: InternationalFeed[] = queries.map(
  ([category, query], index) => ({
    id: `international-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    name: `Google News · ${category}`,
    publisher: "Google News",
    category,
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(`${query} when:7d`)}&hl=en&gl=US&ceid=US:en`,
    tier: "wire_aggregator",
    enabled: true,
  })
);
