import { toEmbedUrl } from "../components/RssIframeModal";
import type { RssCardItem } from "../components/AutoplayRssCard";

function textNS(el: Element, local: string): string {
  return el.getElementsByTagNameNS("*", local)[0]?.textContent?.trim() ?? "";
}

function attrNS(el: Element, local: string, attr: string): string {
  return el.getElementsByTagNameNS("*", local)[0]?.getAttribute(attr) ?? "";
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

      return {
        title,
        link,
        embedUrl: toEmbedUrl(link),
        image: thumb,
        fallback: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : "",
        date,
        source: author,
      };
    });
    return { title: feedTitle, items };
  }

  const nodes = Array.from(doc.querySelectorAll("item")).slice(0, limit);
  const items = nodes.map(n => {
    const desc = n.querySelector("description")?.textContent ?? "";
    const mediaImg =
      n.querySelector("content")?.getAttribute("url") ||
      attrNS(n, "content", "url") ||
      attrNS(n, "thumbnail", "url") ||
      "";
    const enclosure = n.querySelector("enclosure")?.getAttribute("url") ?? "";
    const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/);
    const link = n.querySelector("link")?.textContent?.trim() || "#";
    const image = mediaImg || enclosure || imgMatch?.[1] || "";

    return {
      title: n.querySelector("title")?.textContent ?? "",
      link,
      embedUrl: toEmbedUrl(link, desc),
      image,
      fallback: imgMatch?.[1] || enclosure,
      date: n.querySelector("pubDate")?.textContent ?? "",
      source: textNS(n, "creator") || feedTitle,
    };
  });

  return { title: feedTitle, items };
}

export async function fetchPlatformRss(
  feedUrl: string,
  limit = 12
): Promise<{ title: string; items: RssCardItem[] }> {
  const res = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();
  return parseRssXml(xml, limit);
}
