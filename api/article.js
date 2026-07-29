/**
 * Vercel Serverless — GET /api/article?url=…
 * Proxies article HTML and strips frame-blocking headers/meta so it can load in an iframe.
 */
function stripFrameBlocking(html, pageUrl) {
  let out = html
    // Remove CSP / XFO meta that block framing
    .replace(
      /<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi,
      ""
    )
    .replace(
      /<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi,
      ""
    )
    // Soften frame-ancestors in inline CSP scripts if any
    .replace(/frame-ancestors[^;"]*;?/gi, "")
    .replace(/X-Frame-Options\s*:\s*[^"<\n]+/gi, "");

  try {
    const origin = new URL(pageUrl).origin;
    if (!/<base\s/i.test(out)) {
      out = out.replace(
        /<head([^>]*)>/i,
        `<head$1><base href="${origin}/">`
      );
    }
  } catch {
    /* ignore */
  }

  // Inject back bar at start of <body> (not in <head> — browsers hide that)
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=300");

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
          "Mozilla/5.0 (compatible; CinemaX-Article/1.0; +https://vercel.app)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    const contentType = r.headers.get("content-type") || "text/html; charset=utf-8";
    let body = await r.text();

    if (/text\/html|application\/xhtml/i.test(contentType) || /<html/i.test(body)) {
      body = stripFrameBlocking(body, upstream.toString());
      res.status(200);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      // Critical: do NOT forward X-Frame-Options / CSP from upstream
      res.setHeader("Content-Security-Policy", "frame-ancestors *");
      res.send(body);
      return;
    }

    res.status(r.status);
    res.setHeader("Content-Type", contentType);
    res.send(body);
  } catch (err) {
    res.status(502).json({
      error: "Article fetch failed",
      detail: String(err && err.message ? err.message : err),
    });
  }
}
