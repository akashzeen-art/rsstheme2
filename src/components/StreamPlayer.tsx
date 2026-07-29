import { useEffect, useRef } from "react";
import Hls from "hls.js";

/** Plays YouTube embed, MP4, or HLS inside the Live Feed panel. */
export default function StreamPlayer({
  kind,
  src,
  title,
  poster,
}: {
  kind: "youtube" | "video";
  src: string;
  title: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (kind !== "video") return;
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    const isHls = /\.m3u8(\?|$)/i.test(src);

    if (isHls) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      video.src = src;
    }

    video.muted = true;
    video.play().catch(() => {});

    return () => {
      hls?.destroy();
    };
  }, [kind, src]);

  if (kind === "youtube") {
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
        }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      poster={poster}
      controls
      playsInline
      muted
      autoPlay
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "contain",
        background: "#000",
      }}
    />
  );
}
