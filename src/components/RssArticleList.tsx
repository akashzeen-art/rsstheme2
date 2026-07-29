import { timeAgo, type RssCardItem } from "./AutoplayRssCard";

/**
 * Article list layout for news RSS feeds.
 * Only "Read More" opens the Live Feed iframe panel — not a full-page iframe section.
 */
export default function RssArticleList({
  items,
  onReadMore,
}: {
  items: RssCardItem[];
  onReadMore: (item: RssCardItem) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        padding: "0 24px 8px",
        maxWidth: 920,
      }}
    >
      {items.map((item, i) => (
        <article
          key={`${item.link}-${i}`}
          style={{
            display: "flex",
            gap: 18,
            padding: "22px 0",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            alignItems: "flex-start",
          }}
        >
          {item.image ? (
            <div
              style={{
                flexShrink: 0,
                width: "min(220px, 34vw)",
                aspectRatio: "3 / 2",
                borderRadius: 8,
                overflow: "hidden",
                background: "#111",
              }}
            >
              <img
                src={item.image}
                alt=""
                referrerPolicy="no-referrer"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={e => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (item.fallback && img.src !== item.fallback) img.src = item.fallback;
                  else img.parentElement!.style.display = "none";
                }}
              />
            </div>
          ) : null}

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "clamp(15px, 2.2vw, 18px)",
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.45)",
                fontSize: 12,
              }}
            >
              <span>{timeAgo(item.date)}</span>
              <span style={{ margin: "0 6px" }}>|</span>
              By <span style={{ color: "rgba(255,138,138,0.9)" }}>{item.source}</span>
            </p>

            {item.excerpt ? (
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 13,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.excerpt}
              </p>
            ) : null}

            <div>
              <button
                type="button"
                onClick={() => onReadMore(item)}
                style={{
                  marginTop: 4,
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: "1px solid rgba(229,9,20,0.55)",
                  background: "linear-gradient(90deg, #E50914 0%, #a00000 100%)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Read More
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
