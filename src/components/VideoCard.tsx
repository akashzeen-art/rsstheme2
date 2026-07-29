import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { Video } from "../data/videos";

interface Props extends Video { onClick: () => void; }

export default function VideoCard({ id, title, thumbnail, category, aspect, onClick }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative cursor-pointer rounded-sm overflow-visible group"
      style={{ aspectRatio: aspect === "portrait" ? "1080 / 1350" : "1350 / 760" }}
      data-video-id={id}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Base card */}
      <div className="absolute inset-0 rounded-sm overflow-hidden">
        <img
          src={thumbnail} alt={title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          onError={e => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
            el.parentElement!.style.background = "#1a1a1a";
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-semibold line-clamp-1 opacity-0 group-hover:opacity-0">{title}</p>
        </div>
      </div>

      {/* Hover expanded card */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 0 }}
            animate={{ opacity: 1, scale: 1.12, y: -8 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 z-30 rounded-md overflow-hidden shadow-2xl"
            style={{ transformOrigin: "center bottom", boxShadow: "0 8px 40px rgba(0,0,0,0.9)" }}
            onClick={e => { e.stopPropagation(); onClick(); }}
          >
            <div className="relative" style={{ aspectRatio: aspect === "portrait" ? "1080 / 1350" : "1350 / 760" }}>
              <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 60%)" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#E50914" }}
                >
                  <Play size={20} fill="#fff" className="ml-0.5" />
                </motion.div>
              </div>
            </div>

            {/* Info panel */}
            <div className="px-3 py-2" style={{ background: "#111" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={e => { e.stopPropagation(); onClick(); }}
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition"
                    style={{ background: "#E50914", borderColor: "#E50914" }}
                  >
                    <Play size={14} fill="#fff" className="ml-0.5" />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white/30 hover:border-red-500 transition text-white">
                    <Plus size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white/30 hover:border-red-500 transition text-white">
                    <ThumbsUp size={14} />
                  </button>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white/30 hover:border-red-500 transition text-white">
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-green-400 text-xs font-bold">98% Match</span>
                <span className="border border-white/30 text-white/60 text-xs px-1 rounded">16+</span>
                <span className="text-white/40 text-xs">HD</span>
              </div>

              <p className="text-white text-xs font-semibold line-clamp-1 mb-1">{title}</p>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(229,9,20,0.2)", color: "#E50914" }}>
                {category}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
