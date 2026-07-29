import { useEffect, useState } from "react";
import { AutoplayRssCard, RssCardItem } from "./AutoplayRssCard";
import VerticalReelsFeed from "./VerticalReelsFeed";
import RssScrollIframe from "./RssScrollIframe";
import {
  platformRssCategories,
  type PlatformRssCategory,
} from "../config/platformRss.config";
import { fetchCategoryRss } from "../lib/rssFeeds";

const BADGE_COLORS: Record<string, string> = {
  SHORTS: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)",
  LIVE: "#E50914",
  SPORTS: "#16a34a",
  MOVIES: "#2563eb",
  SERIES: "#a855f7",
  RSS: "#E50914",
};

function CategoryRow({ cat }: { cat: PlatformRssCategory }) {
  const [items, setItems] = useState<RssCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cat.source === "platform") {
      setLoading(false);
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchCategoryRss(cat.id, cat.limit ?? 12)
      .then(({ items: next }) => {
        if (cancelled) return;
        setItems(next);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cat]);

  if (loading) {
    return (
      <div style={{ padding: "24px 24px 8px" }}>
        <span style={{ color: "#555", fontSize: 13 }}>Loading {cat.title}…</span>
      </div>
    );
  }

  if (!items.length) return null;

  const isReel = cat.layout === "reel";
  const isArticles = cat.layout === "articles";
  const badge = cat.badge || cat.title.toUpperCase();
  const badgeBg = BADGE_COLORS[badge] || "#E50914";

  return (
    <div style={{ padding: "28px 0 20px" }}>
      <div style={{ padding: "0 24px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            background: badgeBg,
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            padding: "3px 8px",
            borderRadius: 3,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {badge}
        </span>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "0.02em" }}>
          {cat.title}
        </h2>
        <span style={{ color: "#666", fontSize: 12 }}>
          {isReel ? "Swipe up" : isArticles ? "Scroll inside · Read More in iframe" : "Autoplaying"}
        </span>
      </div>
      <p className="rss-live-badge-wrap">
        <span className="rss-live-badge">
          <span className="rss-live-badge-dot">(◉)</span> LIVE
        </span>
        <span style={{ display: "block", marginTop: 8, color: "#fff", fontSize: 11 }}>
          Live feed not meant for commercial purpose only for entertainment purpose
        </span>
      </p>

      {isReel ? (
        <VerticalReelsFeed items={items} />
      ) : isArticles ? (
        <RssScrollIframe title={cat.title} items={items} />
      ) : (
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
            <AutoplayRssCard
              key={`${cat.id}-${item.link}-${i}`}
              item={item}
              width={280}
              aspect="16/9"
              lines={2}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Single category row — place anywhere on the page */
export function PlatformRssCategoryRow({ categoryId }: { categoryId: string }) {
  const cat = platformRssCategories.find(c => c.id === categoryId);
  if (!cat) return null;
  return <CategoryRow cat={cat} />;
}

/** Multi-category YouTube / RSS platform block — driven by platformRss.config.ts */
export default function PlatformRssSection({
  excludeIds = [],
}: {
  excludeIds?: string[];
} = {}) {
  const active = platformRssCategories.filter(
    c =>
      (c.source === "youtube" || c.source === "rss" || c.source === "platform") &&
      !excludeIds.includes(c.id)
  );

  if (!active.length) return null;

  return (
    <section id="platform-rss" style={{ background: "#000", padding: "24px 0 48px" }}>
      {active.map(cat => (
        <CategoryRow key={cat.id} cat={cat} />
      ))}
    </section>
  );
}
