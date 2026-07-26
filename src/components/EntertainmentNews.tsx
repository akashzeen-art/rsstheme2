import { useEffect, useState } from "react";
import { AutoplayRssCard, RssCardItem, toEmbedUrl } from "./AutoplayRssCard";

export default function EntertainmentNews() {
  const [items, setItems] = useState<RssCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://rss.app/feeds/tSBR1SKqKIM9fZll.xml")
      .then(r => r.text())
      .then(xml => {
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const nodes = Array.from(doc.querySelectorAll("item")).slice(0, 12);
        setItems(
          nodes.map(n => {
            const mediaImg = n.querySelector("content")?.getAttribute("url") ?? "";
            const enclosure = n.querySelector("enclosure")?.getAttribute("url") ?? "";
            const desc = n.querySelector("description")?.textContent ?? "";
            const match =
              desc.match(/<img[^>]+src=["']([^"']+)["']/) ??
              desc.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);
            const descImg = match?.[1] ?? "";
            const image = mediaImg || enclosure || descImg;
            const link = n.querySelector("link")?.textContent ?? "#";
            return {
              title: n.querySelector("title")?.textContent ?? "",
              link,
              embedUrl: toEmbedUrl(link, desc),
              image,
              fallback: descImg || enclosure,
              date: n.querySelector("pubDate")?.textContent ?? "",
              source: n.querySelector("creator")?.textContent ?? "Entertainment",
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
        <span style={{ color: "#666", fontSize: 13 }}>Loading news…</span>
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
          LIVE
        </span>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "0.02em" }}>
          Entertainment Buzz
        </h2>
        <span style={{ color: "#666", fontSize: 12, marginLeft: 4 }}>Latest from the industry</span>
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
          <AutoplayRssCard key={i} item={item} width={220} aspect="auto" lines={3} />
        ))}
      </div>
    </section>
  );
}
