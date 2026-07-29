import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import type { RssCardItem } from "./AutoplayRssCard";
import StreamPlayer from "./StreamPlayer";
import { classifyRssMedia } from "../lib/rssFeeds";
import { getArticleProxyUrl } from "../config/platformRss.config";
import { toEmbedUrl } from "./RssIframeModal";
import { isTmzEmbed, resolveTmzVideoUrl } from "../lib/tmzVideo";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: RssCardItem | null;
}

/**
 * Live Feed panel — playable media via StreamPlayer,
 * articles via same-origin /api/article proxy iframe.
 */
export default function RssLivePanel({ isOpen, onClose, item }: Props) {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const kind = useMemo(() => (item ? classifyRssMedia(item) : "article"), [item]);

  const ytEmbed = useMemo(() => {
    if (!item || kind !== "youtube") return "";
    return toEmbedUrl(item.embedUrl || item.link, "");
  }, [item, kind]);

  const articleSrc = useMemo(() => {
    if (!item || kind !== "article") return "";
    const href = item.link || item.embedUrl;
    if (!href || href === "#") return "";
    return getArticleProxyUrl(href);
  }, [item, kind]);

  useEffect(() => {
    if (!isOpen || !item || kind !== "video") {
      setVideoSrc(null);
      return;
    }
    let cancelled = false;
    const raw = item.embedUrl || item.link;
    if (isTmzEmbed(raw)) {
      resolveTmzVideoUrl(raw).then(url => {
        if (!cancelled) setVideoSrc(url || raw);
      });
    } else if (/\.(mp4|webm|m3u8)(\?|$)/i.test(raw)) {
      setVideoSrc(raw);
    } else {
      setVideoSrc(raw);
    }
    return () => {
      cancelled = true;
    };
  }, [isOpen, item, kind]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-5xl overflow-hidden rounded-md shadow-2xl flex flex-col"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.08)",
              maxHeight: "92vh",
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate m-0">{item.title}</p>
                <p className="text-white/40 text-xs m-0 mt-0.5 truncate">
                  {item.source}
                  {kind === "article" ? " · Article" : kind === "youtube" ? " · YouTube" : " · Video"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {(item.link || item.embedUrl) && (
                  <a
                    href={item.link || item.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open original"
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                    }}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    background: "rgba(255,255,255,0.08)",
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div
              className="relative w-full bg-black shrink-0"
              style={{
                aspectRatio: kind === "article" ? undefined : "16 / 9",
                height: kind === "article" ? "min(72vh, 640px)" : undefined,
                minHeight: kind === "article" ? 420 : undefined,
              }}
            >
              {kind === "youtube" && ytEmbed && (
                <StreamPlayer kind="youtube" src={ytEmbed} title={item.title} />
              )}

              {kind === "video" && videoSrc && (
                <StreamPlayer
                  kind="video"
                  src={videoSrc}
                  title={item.title}
                  poster={item.image}
                />
              )}

              {kind === "article" && articleSrc && (
                <iframe
                  key={articleSrc}
                  src={articleSrc}
                  title={item.title}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0 bg-white"
                />
              )}

              {kind === "article" && !articleSrc && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                  No article URL available
                </div>
              )}
            </div>

            <p className="px-4 py-2 text-[11px] text-white/35 m-0 shrink-0">
              Live feed not meant for commercial purpose only for entertainment purpose
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
