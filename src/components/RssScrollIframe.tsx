import { useMemo, useRef, useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { timeAgo, type RssCardItem } from "./AutoplayRssCard";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function articleHref(link: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/api/article?url=${encodeURIComponent(link)}`;
}

function thumbHref(imageUrl: string): string {
  if (!imageUrl) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/api/img?url=${encodeURIComponent(imageUrl)}`;
}

function buildFeedHtml(title: string, items: RssCardItem[]): string {
  const articles = items
    .map(item => {
      const href = articleHref(item.link || item.embedUrl || "#");
      const rawImg = item.image || item.fallback || "";
      const proxied = thumbHref(rawImg);
      const img = proxied
        ? `<div class="thumb"><img src="${escapeHtml(proxied)}" alt="" loading="lazy" onerror="this.parentElement.style.display='none'"/></div>`
        : "";
      const excerpt = item.excerpt
        ? `<p class="excerpt">${escapeHtml(item.excerpt)}</p>`
        : "";
      return `
<article class="post">
  ${img}
  <div class="body">
    <h3 class="title">${escapeHtml(item.title)}</h3>
    <p class="meta"><span>${escapeHtml(timeAgo(item.date))}</span> | By <span class="author">${escapeHtml(item.source)}</span></p>
    ${excerpt}
    <a class="read-more" href="${escapeHtml(href)}">Read More</a>
  </div>
</article>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0;
      background: #0a0a0a;
      color: #fff;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    }
    .wrap { padding: 16px 18px 40px; max-width: 880px; margin: 0 auto; }
    .feed-title {
      font-size: 13px; font-weight: 800; letter-spacing: 0.12em;
      text-transform: uppercase; color: #ff8a8a; margin: 0 0 18px;
    }
    .post {
      display: flex; gap: 16px; padding: 18px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      align-items: flex-start;
    }
    .thumb {
      flex-shrink: 0; width: min(200px, 32vw); aspect-ratio: 3/2;
      border-radius: 8px; overflow: hidden; background: #111;
    }
    .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .body { flex: 1; min-width: 0; }
    .title {
      margin: 0 0 8px; font-size: clamp(15px, 2.4vw, 18px);
      font-weight: 700; line-height: 1.35; color: #fff;
    }
    .meta { margin: 0 0 8px; font-size: 12px; color: rgba(255,255,255,0.45); }
    .author { color: rgba(255,138,138,0.95); }
    .excerpt {
      margin: 0 0 12px; font-size: 13px; line-height: 1.5;
      color: rgba(255,255,255,0.62);
    }
    .read-more {
      display: inline-block; padding: 8px 16px; border-radius: 4px;
      background: linear-gradient(90deg, #E50914 0%, #a00000 100%);
      border: 1px solid rgba(229,9,20,0.55);
      color: #fff !important; text-decoration: none;
      font-size: 12px; font-weight: 700; letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .read-more:hover { filter: brightness(1.08); }
    @media (max-width: 560px) {
      .post { flex-direction: column; }
      .thumb { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <p class="feed-title">${escapeHtml(title)}</p>
    ${articles}
  </div>
</body>
</html>`;
}

/**
 * Scrollable iframe feed. Read More opens article inside the iframe.
 * Back button lives on the frame chrome (always visible) — not inside proxied HTML.
 */
export default function RssScrollIframe({
  title,
  items,
}: {
  title: string;
  items: RssCardItem[];
}) {
  const srcDoc = useMemo(() => buildFeedHtml(title, items), [title, items]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showBack, setShowBack] = useState(false);
  const [frameKey, setFrameKey] = useState(0);

  const onFrameLoad = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      const href = win.location.href || "";
      // about:srcdoc = list; /api/article = article viewer
      setShowBack(/\/api\/article/i.test(href));
    } catch {
      // Cross-origin navigation — treat as article view
      setShowBack(true);
    }
  }, []);

  const goBackToList = useCallback(() => {
    setShowBack(false);
    setFrameKey(k => k + 1);
  }, []);

  return (
    <div
      style={{
        margin: "0 16px 8px",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#0a0a0a",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
      }}
    >
      {showBack && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "#111",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <button
            type="button"
            onClick={goBackToList}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 4,
              border: "1px solid rgba(229,9,20,0.55)",
              background: "linear-gradient(90deg, #E50914 0%, #a00000 100%)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} /> Back to list
          </button>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>Article viewer</span>
        </div>
      )}

      <iframe
        key={frameKey}
        ref={iframeRef}
        title={title}
        srcDoc={srcDoc}
        onLoad={onFrameLoad}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        style={{
          display: "block",
          width: "100%",
          height: showBack ? "min(70vh, 660px)" : "min(78vh, 720px)",
          border: 0,
          background: "#0a0a0a",
        }}
      />
    </div>
  );
}
