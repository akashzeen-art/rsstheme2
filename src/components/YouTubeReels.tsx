import { useEffect, useState } from "react";
import { AutoplayRssCard, RssCardItem } from "./AutoplayRssCard";
import { fetchPlatformRss } from "../lib/platformRss";

/** YouTube channel Atom feed — swap channel_id for your own / Shorts channel */
const YT_FEED =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA";

export default function YouTubeReels() {
  const [items, setItems] = useState<RssCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformRss(YT_FEED, 12)
      .then(({ items: next }) => setItems(next))
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
            background:
              "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
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
          Shorts
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
          <AutoplayRssCard key={item.link || i} item={item} width={180} aspect="9/16" lines={2} />
        ))}
      </div>
    </section>
  );
}
