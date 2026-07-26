import { useEffect, useState } from "react";
import { AutoplayRssCard, RssCardItem, toEmbedUrl } from "./AutoplayRssCard";

/** YouTube channel Atom feed — swap channel_id for your own / Shorts channel */
const YT_FEED =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA";

function textNS(el: Element, local: string): string {
  const nodes = el.getElementsByTagNameNS("*", local);
  return nodes[0]?.textContent?.trim() ?? "";
}

function attrNS(el: Element, local: string, attr: string): string {
  const nodes = el.getElementsByTagNameNS("*", local);
  return nodes[0]?.getAttribute(attr) ?? "";
}

export default function YouTubeReels() {
  const [items, setItems] = useState<RssCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [channelName, setChannelName] = useState("YouTube");

  useEffect(() => {
    fetch(YT_FEED)
      .then(r => r.text())
      .then(xml => {
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const name =
          doc.querySelector("feed > title")?.textContent?.trim() ||
          doc.querySelector("title")?.textContent?.trim() ||
          "YouTube";
        setChannelName(name);

        const entries = Array.from(doc.querySelectorAll("entry")).slice(0, 12);
        setItems(
          entries.map(n => {
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
              n.querySelector("author > name")?.textContent?.trim() || name;

            return {
              title,
              link,
              embedUrl: toEmbedUrl(link),
              image: thumb,
              fallback: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : "",
              date,
              source: author,
            };
          })
        );
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ background: "#000", padding: "40px 0", textAlign: "center" }}>
        <span style={{ color: "#666", fontSize: 13 }}>Loading reels…</span>
      </div>
    );

  if (!items.length) return null;

  return (
    <section style={{ background: "#000", padding: "40px 0" }}>
      <div style={{ padding: "0 24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 3,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          REELS
        </span>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "0.02em" }}>
          YouTube Shorts
        </h2>
        <span style={{ color: "#666", fontSize: 12 }}>{channelName} · Autoplaying</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          padding: "0 24px 12px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {items.map((item, i) => (
          <AutoplayRssCard key={item.link || i} item={item} width={180} aspect="9/16" lines={2} />
        ))}
      </div>
    </section>
  );
}
