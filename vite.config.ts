import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function stripFrameBlocking(html: string, pageUrl: string): string {
  let out = html
    .replace(/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, "")
    .replace(/<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, "")
    .replace(/frame-ancestors[^;"]*;?/gi, "")
    .replace(/X-Frame-Options\s*:\s*[^"<\n]+/gi, "");

  try {
    const origin = new URL(pageUrl).origin;
    if (!/<base\s/i.test(out)) {
      out = out.replace(/<head([^>]*)>/i, `<head$1><base href="${origin}/">`);
    }
  } catch {
    /* ignore */
  }

  const styleInject = `<style>html,body{max-width:100%!important;overflow-x:hidden!important}#cinemax-back{position:sticky;top:0;z-index:2147483647;display:flex;align-items:center;gap:10px;padding:10px 14px;background:#111;border-bottom:1px solid rgba(255,255,255,0.12);font-family:system-ui,sans-serif}#cinemax-back button{padding:7px 12px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:#E50914;color:#fff;font-size:12px;font-weight:700;cursor:pointer}</style>`;
  const barInject = `<div id="cinemax-back"><button type="button" onclick="history.length>1?history.back():history.go(-1)">← Back to list</button><span style="color:rgba(255,255,255,0.45);font-size:11px">Article viewer</span></div>`;

  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `${styleInject}</head>`);
  } else {
    out = styleInject + out;
  }

  if (/<body[^>]*>/i.test(out)) {
    out = out.replace(/<body([^>]*)>/i, `<body$1>${barInject}`);
  } else {
    out = barInject + out;
  }

  return out;
}

/** Local /api/rss + /api/article proxies — mirrors serverless in production */
function rssApiPlugin(): Plugin {
  return {
    name: "rss-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || "";

        // --- Image proxy ---
        if (rawUrl.startsWith("/api/img")) {
          try {
            const parsed = new URL(rawUrl, "http://localhost");
            const target = parsed.searchParams.get("url");
            if (!target) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing url" }));
              return;
            }
            let upstream: URL;
            try {
              upstream = new URL(target);
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid url" }));
              return;
            }
            if (!/^https?:$/i.test(upstream.protocol)) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Only http(s) URLs allowed" }));
              return;
            }

            const r = await fetch(upstream.toString(), {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                Referer: upstream.origin + "/",
              },
              redirect: "follow",
            });
            if (!r.ok) {
              res.statusCode = r.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Image fetch failed" }));
              return;
            }
            const buf = Buffer.from(await r.arrayBuffer());
            res.statusCode = 200;
            res.setHeader("Content-Type", r.headers.get("content-type") || "image/jpeg");
            res.setHeader("Cache-Control", "public, max-age=86400");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(buf);
          } catch (err) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Image proxy failed", detail: String(err) }));
          }
          return;
        }

        // --- Article proxy ---
        if (rawUrl.startsWith("/api/article")) {
          try {
            const parsed = new URL(rawUrl, "http://localhost");
            const target = parsed.searchParams.get("url");
            if (!target) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Missing url" }));
              return;
            }
            let upstream: URL;
            try {
              upstream = new URL(target);
            } catch {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Invalid url" }));
              return;
            }
            if (!/^https?:$/i.test(upstream.protocol)) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Only http(s) URLs allowed" }));
              return;
            }

            const r = await fetch(upstream.toString(), {
              headers: {
                "User-Agent": "CinemaX-Article/1.0",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              },
              redirect: "follow",
            });
            const contentType = r.headers.get("content-type") || "text/html; charset=utf-8";
            let body = await r.text();

            if (/text\/html|application\/xhtml/i.test(contentType) || /<html/i.test(body)) {
              body = stripFrameBlocking(body, upstream.toString());
              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.setHeader("Content-Security-Policy", "frame-ancestors *");
              res.setHeader("Cache-Control", "public, max-age=120");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.end(body);
              return;
            }

            res.statusCode = r.status;
            res.setHeader("Content-Type", contentType);
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(body);
          } catch (err) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Article fetch failed", detail: String(err) }));
          }
          return;
        }

        // --- RSS proxy ---
        if (!rawUrl.startsWith("/api/rss")) return next();

        try {
          const parsed = new URL(rawUrl, "http://localhost");
          const target = parsed.searchParams.get("url");
          const channelId = parsed.searchParams.get("channel_id");

          let feedUrl = target;
          if (!feedUrl && channelId) {
            feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
          }
          if (!feedUrl) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Missing url or channel_id" }));
            return;
          }

          let upstream: URL;
          try {
            upstream = new URL(feedUrl);
          } catch {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Invalid url" }));
            return;
          }
          if (!/^https?:$/i.test(upstream.protocol)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Only http(s) feeds allowed" }));
            return;
          }

          const r = await fetch(upstream.toString(), {
            headers: {
              "User-Agent": "CinemaX-RSS/1.0",
              Accept: "application/atom+xml, application/rss+xml, application/xml, text/xml, */*",
            },
          });
          const body = await r.text();
          res.statusCode = r.status;
          res.setHeader("Content-Type", r.headers.get("content-type") || "application/xml; charset=utf-8");
          res.setHeader("Cache-Control", "public, max-age=300");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.end(body);
        } catch (err) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Upstream fetch failed", detail: String(err) }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), rssApiPlugin()],
  publicDir: "public",
  server: {
    port: 3000,
    proxy: {
      "/tmz-share": {
        target: "https://share.tmz.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmz-share/, ""),
      },
    },
  },
});
