/**
 * Vercel — GET /api/img?url=…
 * Same-origin image proxy so RSS thumbnails aren't blocked by hotlink/referrer rules.
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  try {
    const q = req.query || {};
    const urlParam =
      typeof q.url === "string" ? q.url : Array.isArray(q.url) ? q.url[0] : "";
    if (!urlParam) {
      res.status(400).json({ error: "Missing url" });
      return;
    }

    let upstream;
    try {
      upstream = new URL(urlParam);
    } catch {
      res.status(400).json({ error: "Invalid url" });
      return;
    }
    if (!/^https?:$/i.test(upstream.protocol)) {
      res.status(400).json({ error: "Only http(s) URLs allowed" });
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
      res.status(r.status).json({ error: "Image fetch failed" });
      return;
    }

    const buf = Buffer.from(await r.arrayBuffer());
    res.status(200);
    res.setHeader(
      "Content-Type",
      r.headers.get("content-type") || "image/jpeg"
    );
    res.send(buf);
  } catch (err) {
    res.status(502).json({
      error: "Image proxy failed",
      detail: String(err && err.message ? err.message : err),
    });
  }
}
