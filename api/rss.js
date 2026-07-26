/**
 * Vercel Serverless Function — GET /api/rss?url=… | ?channel_id=…
 * ESM export (package.json has "type": "module").
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    const q = req.query || {};
    const urlParam = typeof q.url === "string" ? q.url : Array.isArray(q.url) ? q.url[0] : "";
    const channelId =
      typeof q.channel_id === "string"
        ? q.channel_id
        : Array.isArray(q.channel_id)
          ? q.channel_id[0]
          : "";

    let feedUrl = urlParam;
    if (!feedUrl && channelId) {
      feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    }

    if (!feedUrl) {
      res.status(400).json({ error: "Missing url or channel_id" });
      return;
    }

    let upstream;
    try {
      upstream = new URL(feedUrl);
    } catch {
      res.status(400).json({ error: "Invalid url" });
      return;
    }

    if (!/^https?:$/i.test(upstream.protocol)) {
      res.status(400).json({ error: "Only http(s) feeds allowed" });
      return;
    }

    const r = await fetch(upstream.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CinemaX-RSS/1.0; +https://vercel.app)",
        Accept:
          "application/atom+xml, application/rss+xml, application/xml, text/xml, */*",
      },
      redirect: "follow",
    });

    const body = await r.text();
    res.status(r.status);
    res.setHeader(
      "Content-Type",
      r.headers.get("content-type") || "application/xml; charset=utf-8"
    );
    res.send(body);
  } catch (err) {
    res.status(502).json({
      error: "Upstream fetch failed",
      detail: String(err && err.message ? err.message : err),
    });
  }
}
