import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronUp, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import type { RssCardItem } from "./AutoplayRssCard";
import { timeAgo } from "./AutoplayRssCard";
import { isTmzEmbed, resolveTmzVideoUrl } from "../lib/tmzVideo";
import Hls from "hls.js";

function ytPost(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "*"
  );
}

function YouTubeFrame({
  src,
  title,
  active,
  muted = true,
}: {
  src: string;
  title: string;
  active: boolean;
  muted?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const kickPlay = useCallback(() => {
    ytPost(iframeRef.current, muted ? "mute" : "unMute");
    ytPost(iframeRef.current, "playVideo");
  }, [muted]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!active) {
      ytPost(iframeRef.current, "pauseVideo");
      return;
    }
    kickPlay();
    let n = 0;
    timerRef.current = setInterval(() => {
      kickPlay();
      if (++n >= 8) clearInterval(timerRef.current);
    }, 500);
    return () => clearInterval(timerRef.current);
  }, [active, src, kickPlay]);

  useEffect(() => {
    if (!active) return;
    ytPost(iframeRef.current, muted ? "mute" : "unMute");
  }, [muted, active]);

  return (
    <iframe
      ref={iframeRef}
      key={src}
      src={src}
      title={title}
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
      onLoad={() => active && kickPlay()}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        border: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function NativeVideo({
  src,
  poster,
  active,
  muted = true,
}: {
  src: string;
  poster?: string;
  active: boolean;
  muted?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    let hls: Hls | null = null;
    if (/\.m3u8(\?|$)/i.test(src) && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
    return () => hls?.destroy();
  }, [src]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = muted;
    if (active) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, src, muted]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted={muted}
      playsInline
      loop
      autoPlay
      controls={false}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        pointerEvents: "none",
      }}
    />
  );
}

function ReelSlide({
  item,
  root,
  index,
  total,
}: {
  item: RssCardItem;
  root: HTMLElement | null;
  index: number;
  total: number;
}) {
  const slideRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isFs, setIsFs] = useState(false);
  const [muted, setMuted] = useState(true);

  const tmz = isTmzEmbed(item.embedUrl || item.link);
  const isYouTube = /youtube\.com|youtu\.be/i.test(item.embedUrl || item.link);

  useEffect(() => {
    const el = slideRef.current;
    if (!el || !root) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio >= 0.65),
      { root, threshold: [0.5, 0.65, 0.85] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root]);

  useEffect(() => {
    if (!active || !tmz || videoSrc) return;
    let cancelled = false;
    resolveTmzVideoUrl(item.embedUrl || item.link).then(url => {
      if (!cancelled && url) setVideoSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [active, tmz, item.embedUrl, item.link, videoSrc]);

  useEffect(() => {
    const onFs = () => {
      const fs = document.fullscreenElement;
      setIsFs(!!fs && (fs === mediaRef.current || fs === slideRef.current));
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const box = mediaRef.current;
    if (!box) return;
    try {
      if (!document.fullscreenElement) await box.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={slideRef}
      style={{
        height: "100%",
        width: "100%",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        position: "relative",
        flexShrink: 0,
        background: "#000",
      }}
    >
      <div ref={mediaRef} style={{ position: "absolute", inset: 0, background: "#000" }}>
        {item.image && (
          <img
            src={item.image}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: active && (videoSrc || isYouTube) ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />
        )}

        {active && videoSrc && (
          <NativeVideo src={videoSrc} poster={item.image} active={active} muted={muted} />
        )}
        {active && isYouTube && item.embedUrl && (
          <YouTubeFrame src={item.embedUrl} title={item.title} active={active} muted={muted} />
        )}

        {/* gradient + meta */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.35) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 16,
            right: 64,
            bottom: 20,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            }}
          >
            {item.title}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
            <span style={{ color: "#E50914", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em" }}>
              {item.source}
            </span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{timeAgo(item.date)}</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
              {index + 1}/{total}
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 12,
            bottom: 20,
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() => setMuted(m => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
            style={iconBtn}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button type="button" onClick={toggleFs} aria-label="Fullscreen" style={iconBtn}>
            {isFs ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>

        {index === 0 && active && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              pointerEvents: "none",
              animation: "reelHintBounce 1.4s ease-in-out infinite",
            }}
          >
            <ChevronUp size={16} /> Swipe up
          </div>
        )}

        {index === total - 1 && active && (
          <div
            style={{
              position: "absolute",
              bottom: 72,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              color: "rgba(255,255,255,0.75)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            ↓ Scroll down for more
          </div>
        )}
      </div>
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.55)",
  color: "#fff",
  backdropFilter: "blur(8px)",
};

/** Instagram / YouTube Shorts–style vertical snap scroll */
export default function VerticalReelsFeed({ items }: { items: RssCardItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    setRoot(scrollerRef.current);
  }, []);

  // Release page scroll when user swipes past first/last reel (fixes mobile trap)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const atTop = () => el.scrollTop <= 1;
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 2;

    const onWheel = (e: WheelEvent) => {
      if ((e.deltaY < 0 && atTop()) || (e.deltaY > 0 && atBottom())) {
        // let the page scroll
        return;
      }
      e.stopPropagation();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? 0;
      const dy = touchStartY.current - y; // >0 swipe up (next), <0 swipe down (prev)
      if ((dy < 0 && atTop()) || (dy > 0 && atBottom())) {
        // Don't lock the gesture — page can scroll
        el.style.overflowY = "hidden";
        requestAnimationFrame(() => {
          el.style.overflowY = "auto";
        });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div style={{ padding: "0 16px 20px" }}>
      <style>{`
        @keyframes reelHintBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.55; }
          50% { transform: translateX(-50%) translateY(-6px); opacity: 1; }
        }
        .vertical-reels-scroller::-webkit-scrollbar { display: none; }
      `}</style>
      <div
        ref={scrollerRef}
        className="vertical-reels-scroller"
        style={{
          height: "min(70vh, 640px)",
          maxWidth: 420,
          margin: "0 auto",
          overflowY: "auto",
          overflowX: "hidden",
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "#000",
          scrollbarWidth: "none",
          overscrollBehaviorY: "auto",
          touchAction: "pan-y",
        }}
      >
        {items.map((item, i) => (
          <ReelSlide
            key={`${item.link}-${i}`}
            item={item}
            root={root}
            index={i}
            total={items.length}
          />
        ))}
      </div>
      <p
        style={{
          textAlign: "center",
          color: "#666",
          fontSize: 12,
          margin: "12px 0 0",
          letterSpacing: "0.04em",
        }}
      >
        Swipe reels ↑ · scroll page ↓ for more
      </p>
    </div>
  );
}
