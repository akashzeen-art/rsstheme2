import { useEffect, useState } from "react";
import { AutoplayRssCard, RssCardItem, toEmbedUrl } from "./AutoplayRssCard";
import { fetchPlatformRss } from "../lib/platformRss";

const TMZ_FEED = "https://rss.app/feeds/yb2RiZKyhZogVKnx.xml";

export default function TMZReels() {
  const [items, setItems] = useState<RssCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformRss(TMZ_FEED, 12)
      .then(({ items: next }) => {
        setItems(
          next.map(item => ({
            ...item,
            source: "TMZ",
            embedUrl: item.embedUrl || toEmbedUrl(item.link),
          }))
        );
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ background: "#000", padding: "40px 0", textAlign: "center" }}>
        <span style={{ color: "#666", fontSize: 13 }}>Loading…</span>
      </div>
    );

  if (!items.length) return null;

  return (
    <section style={{ background: "#000", padding: "40px 0" }}>
      <div style={{ padding: "0 24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            background: "#E50914",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 3,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          ▶ LIVE
        </span>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "0.02em" }}>
          TMZ Reels
        </h2>
        <span style={{ color: "#666", fontSize: 12 }}>Autoplaying</span>
      </div>
      <p className="rss-live-badge-wrap">
        <span className="rss-live-badge">
          <span className="rss-live-badge-dot">(◉)</span> LIVE
        </span>
        <span style={{ display: "block", marginTop: 8, color: "#fff", fontSize: 11 }}>
          Live feed not meant for commercial purpose only for entertainment purpose
        </span>
      </p>

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
          <AutoplayRssCard key={i} item={item} width={260} />
        ))}
      </div>
    </section>
  );
}
