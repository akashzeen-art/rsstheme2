import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Maximize, Minimize } from "lucide-react";
import { toEmbedUrl } from "./RssIframeModal";
import { isTmzEmbed, resolveTmzVideoUrl } from "../lib/tmzVideo";

export interface RssCardItem {
  title: string;
  link: string;
  embedUrl: string;
  image: string;
  fallback?: string;
  date: string;
  source: string;
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function AutoplayVideo({
  src,
  poster,
  active,
  videoRef,
}: {
  src: string;
  poster?: string;
  active: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    const isHls = /\.m3u8(\?|$)/i.test(src);

    if (isHls) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    return () => {
      hls?.destroy();
    };
  }, [src, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.muted = true;
      const p = video.play();
      if (p) p.catch(() => {});
    } else {
      video.pause();
    }
  }, [active, src, videoRef]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      muted
      playsInline
      loop
      autoPlay
      preload="auto"
      controls={false}
      disablePictureInPicture
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        background: "#000",
        pointerEvents: "none",
      }}
    />
  );
}

/** YouTube embed autoplay without postMessage API calls */
function YouTubeAutoplayFrame({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  return (
    <iframe
      key={src}
      src={src}
      title={title}
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        background: "#000",
        pointerEvents: "none",
      }}
    />
  );
}

/** Autoplays when visible — TMZ uses direct MP4/HLS; YouTube uses embed + API */
export function AutoplayRssCard({
  item,
  width,
  aspect = "16/9",
  lines = 2,
}: {
  item: RssCardItem;
  width: number;
  aspect?: string;
  lines?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isFs, setIsFs] = useState(false);

  const tmz = isTmzEmbed(item.embedUrl || item.link);
  const isYouTube = /youtube\.com|youtu\.be/i.test(item.embedUrl || item.link);
  const iframeFallback = /youtube\.com|youtu\.be|player\.|embed/i.test(item.embedUrl);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.15),
      { root: null, rootMargin: "80px", threshold: [0, 0.15, 0.4, 0.75] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !tmz || videoSrc) return;
    let cancelled = false;
    resolveTmzVideoUrl(item.embedUrl || item.link).then(url => {
      if (!cancelled && url) setVideoSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [inView, tmz, item.embedUrl, item.link, videoSrc]);

  useEffect(() => {
    const onFs = () => {
      const fsEl = document.fullscreenElement;
      setIsFs(!!fsEl && (fsEl === mediaRef.current || fsEl === videoRef.current));
      const v = videoRef.current;
      if (v && inView) {
        v.muted = true;
        v.play().catch(() => {});
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [inView]);

  const toggleFullscreen = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const box = mediaRef.current;
    const video = videoRef.current;
    if (!box) return;

    try {
      if (!document.fullscreenElement) {
        if (box.requestFullscreen) await box.requestFullscreen();
        else if (video && (video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
          (video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
        }
        video?.play().catch(() => {});
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* fullscreen not available */
    }
  }, []);

  const showVideo = inView && !!videoSrc;
  const showYt = !tmz && inView && isYouTube && !!item.embedUrl;
  const showOtherIframe = !tmz && !isYouTube && inView && iframeFallback;

  return (
    <div
      ref={ref}
      style={{
        flexShrink: 0,
        width,
        borderRadius: 10,
        overflow: "hidden",
        background: "#111",
        border: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        ref={mediaRef}
        style={{
          width: "100%",
          ...(aspect === "auto" ? { height: 124 } : { aspectRatio: aspect }),
          ...(isFs ? { height: "100vh", aspectRatio: "unset" } : {}),
          overflow: "hidden",
          background: "#000",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt=""
            referrerPolicy="no-referrer"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: showVideo || showYt || showOtherIframe ? 0 : 1,
              transition: "opacity 0.35s",
              pointerEvents: "none",
            }}
            onError={e => {
              const img = e.currentTarget as HTMLImageElement;
              if (item.fallback && img.src !== item.fallback) img.src = item.fallback;
              else img.style.display = "none";
            }}
          />
        )}

        {showVideo && (
          <AutoplayVideo
            src={videoSrc!}
            poster={item.image}
            active={inView || isFs}
            videoRef={videoRef}
          />
        )}

        {showYt && (
          <YouTubeAutoplayFrame
            src={item.embedUrl}
            title={item.title}
          />
        )}

        {showOtherIframe && (
          <iframe
            key={item.embedUrl}
            src={item.embedUrl}
            title={item.title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              background: "#000",
            }}
          />
        )}

        {(showVideo || showYt || showOtherIframe) && (
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFs ? "Exit fullscreen" : "Fullscreen"}
            title={isFs ? "Exit fullscreen" : "Fullscreen"}
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              zIndex: 5,
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.65)",
              color: "#fff",
              backdropFilter: "blur(6px)",
            }}
          >
            {isFs ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        )}
      </div>

      <div style={{ padding: "10px 12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p
          style={{
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.4,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: lines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </p>
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              color: "#E50914",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {item.source.length > 18 ? item.source.slice(0, 18) + "…" : item.source}
          </span>
          <span style={{ color: "#555", fontSize: 10 }}>{timeAgo(item.date)}</span>
        </div>
      </div>
    </div>
  );
}

export { toEmbedUrl };
