import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Local /api/rss proxy — mirrors Netlify function in production */
function rssApiPlugin(): Plugin {
  return {
    name: "rss-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || "";
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

          // Only allow http(s) absolute URLs
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
