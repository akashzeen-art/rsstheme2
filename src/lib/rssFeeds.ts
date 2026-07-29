/**
 * RSS feed helpers — builds configs from platformRss.config and loads rss.app feeds.
 */
import {
  platformRssCategories,
  getCategoryFeedUrl,
  getRssApiUrl,
  type PlatformRssCategory,
} from "../config/platformRss.config";
import { parseRssXml, fetchPlatformRss } from "./platformRss";
import type { RssCardItem } from "../components/AutoplayRssCard";

export interface RssFeedConfig {
  id: string;
  title: string;
  badge?: string;
  feedUrl: string;
  layout: "reel" | "landscape" | "articles";
  limit: number;
}

/** Only allow rss.app feed hosts (plus YouTube Atom for reels). */
export function isRssAppFeedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.hostname === "rss.app" || u.hostname.endsWith(".rss.app")) return true;
    if (u.hostname === "www.youtube.com" && u.pathname.includes("/feeds/videos.xml")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function buildRssFeedConfigs(
  categories: PlatformRssCategory[] = platformRssCategories
): RssFeedConfig[] {
  return categories
    .filter(c => c.source === "youtube" || c.source === "rss")
    .map(c => {
      const feedUrl = getCategoryFeedUrl(c);
      if (!feedUrl) return null;
      return {
        id: c.id,
        title: c.title,
        badge: c.badge,
        feedUrl,
        layout: c.layout ?? "landscape",
        limit: c.limit ?? 12,
      } satisfies RssFeedConfig;
    })
    .filter((c): c is RssFeedConfig => !!c);
}

/** Normalize / trim card fields after parse. */
export function normalizeItems(items: RssCardItem[]): RssCardItem[] {
  return items
    .filter(it => it.title?.trim() && (it.link || it.embedUrl))
    .map(it => ({
      ...it,
      title: it.title.trim(),
      link: (it.link || "#").trim(),
      embedUrl: (it.embedUrl || it.link || "").trim(),
      image: (it.image || it.fallback || "").trim(),
      source: (it.source || "Live").trim(),
      date: it.date || new Date().toISOString(),
      excerpt: (it.excerpt || "").trim(),
    }));
}

export async function loadRemoteFeed(
  feedUrl: string,
  limit = 12
): Promise<{ title: string; items: RssCardItem[] }> {
  const res = await fetch(getRssApiUrl(feedUrl));
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`RSS fetch failed: ${res.status} ${detail.slice(0, 120)}`);
  }
  const xml = await res.text();
  if (xml.trimStart().startsWith("{") || xml.trimStart().startsWith("<!DOCTYPE")) {
    throw new Error("RSS proxy returned non-XML response");
  }
  const parsed = parseRssXml(xml, limit);
  return { title: parsed.title, items: normalizeItems(parsed.items) };
}

/** Fetch a category feed — rss.app (or YouTube Atom) only. */
export async function fetchCategoryRss(
  categoryId: string,
  limit?: number
): Promise<{ title: string; items: RssCardItem[]; config: RssFeedConfig }> {
  const configs = buildRssFeedConfigs();
  const config = configs.find(c => c.id === categoryId);
  if (!config) throw new Error(`Unknown RSS category: ${categoryId}`);
  if (!isRssAppFeedUrl(config.feedUrl)) {
    throw new Error("Only rss.app (or YouTube Atom) feed URLs are allowed");
  }
  const data = await loadRemoteFeed(config.feedUrl, limit ?? config.limit);
  return { ...data, config };
}

/** Detect playable stream vs article link. */
export function classifyRssMedia(item: RssCardItem): "youtube" | "video" | "article" {
  const url = `${item.embedUrl || ""} ${item.link || ""}`;
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/\.(mp4|webm|m3u8)(\?|$)/i.test(url) || /share\.tmz\.com|player\./i.test(url)) {
    return "video";
  }
  return "article";
}

export { fetchPlatformRss };
