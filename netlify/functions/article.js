/**
 * Netlify function — GET /.netlify/functions/article?url=…
 * Redirected from /api/article
 */
function stripFrameBlocking(html, pageUrl) {
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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const urlParam = event.queryStringParameters?.url || "";
    if (!urlParam) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing url" }),
      };
    }

    let upstream;
    try {
      upstream = new URL(urlParam);
    } catch {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid url" }),
      };
    }

    if (!/^https?:$/i.test(upstream.protocol)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Only http(s) URLs allowed" }),
      };
    }

    const r = await fetch(upstream.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CinemaX-Article/1.0)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    const contentType = r.headers.get("content-type") || "text/html; charset=utf-8";
    let body = await r.text();

    if (/text\/html|application\/xhtml/i.test(contentType) || /<html/i.test(body)) {
      body = stripFrameBlocking(body, upstream.toString());
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Content-Security-Policy": "frame-ancestors *",
          "Cache-Control": "public, max-age=120",
        },
        body,
      };
    }

    return {
      statusCode: r.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Article fetch failed",
        detail: String(err && err.message ? err.message : err),
      }),
    };
  }
};
