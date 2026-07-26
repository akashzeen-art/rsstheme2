/**
 * Netlify Function: GET /.netlify/functions/rss?url=… | ?channel_id=…
 * Redirected from /api/rss in netlify.toml
 */
exports.handler = async function (event) {
  try {
    const params = event.queryStringParameters || {};
    let feedUrl = params.url;
    if (!feedUrl && params.channel_id) {
      feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${params.channel_id}`;
    }
    if (!feedUrl) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing url or channel_id" }),
      };
    }

    let upstream;
    try {
      upstream = new URL(feedUrl);
    } catch {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Invalid url" }),
      };
    }
    if (!/^https?:$/i.test(upstream.protocol)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Only http(s) feeds allowed" }),
      };
    }

    const r = await fetch(upstream.toString(), {
      headers: {
        "User-Agent": "CinemaX-RSS/1.0",
        Accept: "application/atom+xml, application/rss+xml, application/xml, text/xml, */*",
      },
    });
    const body = await r.text();

    return {
      statusCode: r.status,
      headers: {
        "Content-Type": r.headers.get("content-type") || "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Upstream fetch failed", detail: String(err) }),
    };
  }
};
