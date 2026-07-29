/**
 * Netlify — GET /.netlify/functions/img?url=…
 */
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
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: upstream.origin + "/",
      },
      redirect: "follow",
    });

    if (!r.ok) {
      return {
        statusCode: r.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Image fetch failed" }),
      };
    }

    const buf = Buffer.from(await r.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        "Content-Type": r.headers.get("content-type") || "image/jpeg",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
      body: buf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Image proxy failed",
        detail: String(err && err.message ? err.message : err),
      }),
    };
  }
};
