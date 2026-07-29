import { toEmbedUrl } from "../components/RssIframeModal";
import type { RssCardItem } from "../components/AutoplayRssCard";

function textNS(el: Element, local: string): string {
  return el.getElementsByTagNameNS("*", local)[0]?.textContent?.trim() ?? "";
}

function attrNS(el: Element, local: string, attr: string): string {
  return el.getElementsByTagNameNS("*", local)[0]?.getAttribute(attr) ?? "";
}

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|webp|gif|avif)(\?|#|&|$)/i.test(url) || /[?&](format|fm)=(jpe?g|png|webp)/i.test(url);
}

function firstImageUrlFromElements(el: Element): string {
  const all = Array.from(el.getElementsByTagName("*"));

  // Prefer MRSS/media urls first
  for (const node of all) {
    const local = (node.localName || "").toLowerCase();
    if (local === "content" || local === "thumbnail") {
      const url = (node.getAttribute("url") || node.getAttribute("href") || "").trim();
      const medium = (node.getAttribute("medium") || "").toLowerCase();
      const type = (node.getAttribute("type") || "").toLowerCase();
      if (!url || !/^https?:\/\//i.test(url)) continue;
      // Skip content:encoded-style nodes with no media url usefulness
      if (medium === "image" || type.startsWith("image/") || isImageUrl(url)) {
        return url;
      }
    }
  }

  // Then enclosure-based images
  for (const node of all) {
    const local = (node.localName || "").toLowerCase();
    if (local === "enclosure") {
      const url = (node.getAttribute("url") || "").trim();
      const type = (node.getAttribute("type") || "").toLowerCase();
      if (url && (type.startsWith("image/") || isImageUrl(url))) {
        return url;
      }
    }
  }

  // Fallback: any node carrying a likely image URL
  for (const node of all) {
    const url = (node.getAttribute("url") || node.getAttribute("href") || "").trim();
    if (url && isImageUrl(url)) return url;
  }

  return "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromDesc(desc: string, max = 160): string {
  const text = stripHtml(desc);
  if (!text) return "";
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/** Parse YouTube Atom or generic RSS 2.0 / MRSS into card items */
export function parseRssXml(xml: string, limit = 12): { title: string; items: RssCardItem[] } {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const feedTitle =
    doc.querySelector("feed > title")?.textContent?.trim() ||
    doc.querySelector("channel > title")?.textContent?.trim() ||
    "Feed";

  const entries = Array.from(doc.querySelectorAll("entry"));
  if (entries.length) {
    const items = entries.slice(0, limit).map(n => {
      const videoId = textNS(n, "videoId");
      const link =
        Array.from(n.querySelectorAll("link"))
          .find(l => (l.getAttribute("rel") || "alternate") === "alternate")
          ?.getAttribute("href") ||
        (videoId ? `https://www.youtube.com/watch?v=${videoId}` : "#");
      const thumb =
        attrNS(n, "thumbnail", "url") ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");
      const title = n.querySelector("title")?.textContent ?? "";
      const date =
        n.querySelector("published")?.textContent ||
        n.querySelector("updated")?.textContent ||
        "";
      const author =
        n.querySelector("author > name")?.textContent?.trim() || feedTitle;
      const summary =
        n.querySelector("summary")?.textContent ||
        n.querySelector("content")?.textContent ||
        "";

      return {
        title,
        link,
        embedUrl: toEmbedUrl(link),
        image: thumb,
        fallback: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : "",
        date,
        source: author,
        excerpt: excerptFromDesc(summary),
      };
    });
    return { title: feedTitle, items };
  }

  const nodes = Array.from(doc.querySelectorAll("item")).slice(0, limit);
  const items = nodes.map(n => {
    const desc =
      n.querySelector("description")?.textContent ??
      textNS(n, "encoded") ??
      "";
    const mediaImg = firstImageUrlFromElements(n);
    const enclosure = n.querySelector("enclosure")?.getAttribute("url") ?? "";
    const imgMatch =
      desc.match(/<img[^>]+src=["']([^"']+)["']/i) ??
      desc.match(/https?:\/\/[^\s"'<>]+?\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s"'<>]*)?/i);
    const link = n.querySelector("link")?.textContent?.trim() || "#";
    const image = mediaImg || enclosure || imgMatch?.[1] || imgMatch?.[0] || "";

    return {
      title: n.querySelector("title")?.textContent ?? "",
      link,
      embedUrl: toEmbedUrl(link, desc),
      image,
      fallback: imgMatch?.[1] || imgMatch?.[0] || enclosure,
      date: n.querySelector("pubDate")?.textContent ?? "",
      source: textNS(n, "creator") || feedTitle,
      excerpt: excerptFromDesc(desc),
    };
  });

  return { title: feedTitle, items };
}

export async function fetchPlatformRss(
  feedUrl: string,
  limit = 12
): Promise<{ title: string; items: RssCardItem[] }> {
  const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`RSS fetch failed: ${res.status} ${detail.slice(0, 120)}`);
  }
  const xml = await res.text();
  // Guard: API sometimes returns JSON error HTML
  if (xml.trimStart().startsWith("{") || xml.trimStart().startsWith("<!DOCTYPE")) {
    throw new Error("RSS proxy returned non-XML response");
  }
  return parseRssXml(xml, limit);
}
