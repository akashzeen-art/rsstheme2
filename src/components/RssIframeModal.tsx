import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Prefer embed URL (e.g. share.tmz.com); falls back to article link */
  embedUrl: string;
}

export function toEmbedUrl(link: string, description = ""): string {
  const fromDesc = description.match(
    /<iframe[^>]+src=["']([^"']+)["']/i
  )?.[1];

  let url = (fromDesc || link || "").trim();
  if (!url) return "";

  // Prefer TMZ share embed over /watch/ pages
  const watchMatch = url.match(/tmz\.com\/watch\/([^/?#]+)/i);
  if (watchMatch) {
    url = `https://share.tmz.com/videos/${watchMatch[1]}/`;
  }

  // YouTube / Shorts → muted autoplay embed
  const ytId =
    url.match(
      /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w-]{11})/i
    )?.[1] ??
    description.match(
      /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/i
    )?.[1];
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3`;
  }

  try {
    const u = new URL(url);
    // muted autoplay is required by most browsers
    if (!u.searchParams.has("autoplay")) u.searchParams.set("autoplay", "1");
    if (!u.searchParams.has("mute")) u.searchParams.set("mute", "1");
    if (!u.searchParams.has("playsinline")) u.searchParams.set("playsinline", "1");
    return u.toString();
  } catch {
    return url;
  }
}

export default function RssIframeModal({ isOpen, onClose, title, embedUrl }: Props) {
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
      {isOpen && embedUrl && (
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
            className="relative w-full max-w-5xl overflow-hidden rounded-md shadow-2xl"
            style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-white text-sm font-semibold truncate m-0 pr-2">{title}</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 flex items-center justify-center rounded-full"
                style={{
                  width: 36, height: 36, background: "rgba(255,255,255,0.08)",
                  border: "none", cursor: "pointer", color: "#fff",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                key={embedUrl}
                src={embedUrl}
                title={title}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
