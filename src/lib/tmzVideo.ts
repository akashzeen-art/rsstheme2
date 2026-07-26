/** Resolve a direct playable video URL from a TMZ share / watch link */
export async function resolveTmzVideoUrl(embedOrLink: string): Promise<string | null> {
  try {
    let pathname = "";
    try {
      const u = new URL(embedOrLink);
      pathname = u.pathname;
    } catch {
      return null;
    }

    // /videos/slug/ or /watch/slug/
    const slug =
      pathname.match(/\/(?:videos|watch)\/([^/?#]+)/i)?.[1] ?? "";
    if (!slug) return null;

    const res = await fetch(`/tmz-share/videos/${slug}/`);
    if (!res.ok) return null;
    const html = await res.text();

    const unescape = (s: string) =>
      s.replace(/\\u002F/gi, "/").replace(/\\\//g, "/").replace(/\\"/g, '"');

    const mp4 = html.match(/"kaltura_mp4_url"\s*:\s*"([^"]+)"/)?.[1];
    if (mp4) return unescape(mp4);

    const jwId = html.match(/"jwplayer_media_id"\s*:\s*"([^"]+)"/)?.[1];
    if (jwId) {
      const jw = await fetch(`https://cdn.jwplayer.com/v2/media/${jwId}`).then(r => r.json());
      const sources: { file?: string; type?: string }[] =
        jw?.playlist?.[0]?.sources ?? [];
      const preferMp4 =
        sources.find(s => s.type === "video/mp4" || s.file?.includes(".mp4")) ??
        sources.find(s => s.file?.includes(".m3u8")) ??
        sources[0];
      if (preferMp4?.file) return preferMp4.file;
    }

    const m3u8 = html.match(/"mezzanine_url"\s*:\s*"([^"]+)"/)?.[1];
    if (m3u8) return unescape(m3u8);

    return null;
  } catch {
    return null;
  }
}

export function isTmzEmbed(url: string) {
  return /tmz\.com\/(videos|watch)\//i.test(url) || /share\.tmz\.com/i.test(url);
}
