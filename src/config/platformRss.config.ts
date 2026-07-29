/**
 * Platform RSS / YouTube feed config.
 * Edit youtubeChannelId (or switch source to "rss" / "platform") to change feeds.
 *
 * YouTube: https://www.youtube.com/feeds/videos.xml?channel_id=UC…
 * Fetched via /api/rss (Vite middleware locally, Netlify/Vercel function in production).
 */

export type PlatformRssSource = "youtube" | "rss" | "platform";

export type PlatformRssLayout = "reel" | "landscape" | "articles";

export interface PlatformRssCategory {
  id: string;
  title: string;
  badge?: string;
  source: PlatformRssSource;
  /** When source === "youtube" */
  youtubeChannelId?: string;
  /** When source === "rss" — rss.app XML URL */
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
    id: "movies-hollywood",
    title: "Movies | Hollywood Reporter",
    badge: "MOVIES",
    source: "rss",
    rssUrl: "https://rss.app/feeds/Kokt3XvDewq5YvZp.xml",
    layout: "articles",
    limit: 12,
  },
  {
    id: "couples-news",
    title: "Couples News",
    badge: "LIVE",
    source: "rss",
    rssUrl: "https://rss.app/feeds/DY0mpELyWM1lzUs3.xml",
    layout: "articles",
    limit: 12,
  },
  {
    id: "music-celebuzz",
    title: "Celebuzz Entertainment",
    badge: "LIVE",
    source: "rss",
    rssUrl: "https://rss.app/feeds/vI0CmUYD495xLLcy.xml",
    layout: "articles",
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

/** Same-origin article proxy for iframe embeds (news sites block direct iframes). */
export function getArticleProxyUrl(articleUrl: string): string {
  return `/api/article?url=${encodeURIComponent(articleUrl)}`;
}

/** Same-origin image proxy for RSS thumbnails (CDN hotlink / referrer blocks). */
export function getImageProxyUrl(imageUrl: string): string {
  if (!imageUrl || imageUrl.startsWith("/api/img")) return imageUrl;
  return `/api/img?url=${encodeURIComponent(imageUrl)}`;
}
