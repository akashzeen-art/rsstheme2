/**
 * Platform RSS / YouTube feed config.
 * Edit youtubeChannelId (or switch source to "rss" / "platform") to change feeds.
 *
 * YouTube: https://www.youtube.com/feeds/videos.xml?channel_id=UC…
 * Fetched via /api/rss (Vite middleware locally, Netlify function in production).
 */

export type PlatformRssSource = "youtube" | "rss" | "platform";

export type PlatformRssLayout = "reel" | "landscape";

export interface PlatformRssCategory {
  id: string;
  title: string;
  badge?: string;
  source: PlatformRssSource;
  /** When source === "youtube" */
  youtubeChannelId?: string;
  /** When source === "rss" — your own XML/MRSS (e.g. /feeds/movies.xml) */
  rssUrl?: string;
  /** When source === "platform" — catalog item IDs only (not wired yet) */
  platformSnos?: string[];
  layout?: PlatformRssLayout;
  limit?: number;
}

export const platformRssCategories: PlatformRssCategory[] = [
  {
    id: "reels",
    title: "Reels",
    badge: "SHORTS",
    source: "youtube",
    youtubeChannelId: "UCX6OQ3DkcsbYNE6H8uQQuVA", // MrBeast
    layout: "reel",
    limit: 12,
  },
  {
    id: "web-series",
    title: "Web Series",
    badge: "SERIES",
    source: "youtube",
    youtubeChannelId: "UCq-Fj5jknLsUf-MWSy4_brA", // T-Series
    layout: "landscape",
    limit: 12,
  },

  // --- Also available (not active) ---
  // {
  //   id: "custom-movies",
  //   title: "Movies",
  //   source: "rss",
  //   rssUrl: "/feeds/movies.xml",
  //   layout: "landscape",
  // },
  // {
  //   id: "catalog",
  //   title: "From Catalog",
  //   source: "platform",
  //   platformSnos: [],
  // },
];

/** Build the upstream feed URL for a category (youtube / rss only). */
export function getCategoryFeedUrl(cat: PlatformRssCategory): string | null {
  if (cat.source === "youtube" && cat.youtubeChannelId) {
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${cat.youtubeChannelId}`;
  }
  if (cat.source === "rss" && cat.rssUrl) {
    return cat.rssUrl.startsWith("http")
      ? cat.rssUrl
      : typeof window !== "undefined"
        ? `${window.location.origin}${cat.rssUrl}`
        : cat.rssUrl;
  }
  return null;
}

/** Proxied fetch URL used by the client. */
export function getRssApiUrl(feedUrl: string): string {
  return `/api/rss?url=${encodeURIComponent(feedUrl)}`;
}
