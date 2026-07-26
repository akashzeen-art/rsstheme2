import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Users, Radio } from "lucide-react";

interface LiveStream {
  id: string;
  title: string;
  channel: string;
  viewers: string;
  thumbnail: string;
  category: string;
  youtubeId: string;  // YouTube live embed ID
  isLive: boolean;
}

// Official OTT & entertainment channels streaming free 24/7 on YouTube
const liveStreams: LiveStream[] = [
  {
    id: "live1",
    title: "Shemaroo Movies Live",
    channel: "Shemaroo Movies",
    viewers: "82.4K",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    category: "Bollywood Movies",
    youtubeId: "cMBskrENFNQ",
    isLive: true,
  },
  {
    id: "live2",
    title: "B4U Movies Live",
    channel: "B4U Movies",
    viewers: "54.1K",
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    category: "Movies",
    youtubeId: "VMNH4NKZOMQ",
    isLive: true,
  },
  {
    id: "live3",
    title: "B4U Music Live",
    channel: "B4U Music",
    viewers: "38.7K",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    category: "Music",
    youtubeId: "nBMDTSxBOQA",
    isLive: true,
  },
  {
    id: "live4",
    title: "Zee Bollywood Live",
    channel: "Zee Bollywood",
    viewers: "47.2K",
    thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&q=80",
    category: "Bollywood",
    youtubeId: "etpL_O4WFCM",
    isLive: true,
  },
  {
    id: "live5",
    title: "Dangal TV Live",
    channel: "Dangal TV",
    viewers: "29.5K",
    thumbnail: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&q=80",
    category: "Entertainment",
    youtubeId: "FoFPMFEYKtI",
    isLive: true,
  },
  {
    id: "live6",
    title: "Shemaroo Umang Live",
    channel: "Shemaroo Umang",
    viewers: "21.8K",
    thumbnail: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=600&q=80",
    category: "Entertainment",
    youtubeId: "c9ORrFGMHgk",
    isLive: true,
  },
];

interface Props {
  onRequireAccess: () => void;
  hasAccess: boolean;
}

function HlsPlayer({ src }: { src: string; autoPlay?: boolean }) {
  return (
    <iframe
      src={src}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

export default function LiveSection({ onRequireAccess, hasAccess }: Props) {
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);

  const handlePlay = (stream: LiveStream) => {
    if (!hasAccess) { onRequireAccess(); return; }
    setActiveStream(stream);
  };

  return (
    <section className="py-6" style={{ background: "#000" }}>
      {/* Section header */}
      <div className="px-6 md:px-12 mb-4 flex items-center gap-3">
        <Radio size={18} style={{ color: "#E50914" }} />
        <div className="w-1 h-7 rounded-full shrink-0" style={{ background: "#E50914" }} />
        <h2
          className="font-black text-xl md:text-2xl uppercase tracking-wide"
          style={{
            background: "linear-gradient(90deg, #fff 0%, #E50914 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Live Now
        </h2>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold text-white"
          style={{ background: "#E50914" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          LIVE
        </motion.span>
      </div>

      {/* Live cards row */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-4">
        {liveStreams.map((stream, i) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="shrink-0 w-[260px] md:w-[300px] cursor-pointer group/live"
            onClick={() => handlePlay(stream)}
          >
            <div className="relative rounded-md overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/live:scale-105"
                style={{ filter: "brightness(0.7)" }}
              />

              {/* Gradient */}
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />

              {/* Live badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                {stream.isLive ? (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ background: "#E50914" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    LIVE
                  </motion.div>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ background: "rgba(0,0,0,0.6)" }}>
                    STARTING SOON
                  </span>
                )}
                <span className="px-1.5 py-0.5 rounded text-xs text-white/80"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  {stream.category}
                </span>
              </div>

              {/* Viewer count */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white"
                style={{ background: "rgba(0,0,0,0.6)" }}>
                <Users size={10} />
                {stream.viewers}
              </div>

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/live:opacity-100 transition-opacity duration-200">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.9)" }}>
                  <Play size={20} fill="#000" className="ml-0.5" />
                </div>
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-bold text-sm line-clamp-1">{stream.title}</p>
                <p className="text-white/60 text-xs">{stream.channel}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live player modal */}
      <AnimatePresence>
        {activeStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setActiveStream(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl"
              style={{ background: "#111", border: "1px solid rgba(229,9,20,0.4)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: "#1a1a1a", borderBottom: "1px solid rgba(229,9,20,0.2)" }}>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold text-white"
                    style={{ background: "#E50914" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    LIVE
                  </motion.div>
                  <span className="text-white font-semibold text-sm">{activeStream.title}</span>
                  <span className="text-white/60 text-xs flex items-center gap-1">
                    <Users size={11} /> {activeStream.viewers} watching
                  </span>
                </div>
                <button
                  onClick={() => setActiveStream(null)}
                  className="p-1.5 rounded hover:bg-white/10 transition text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video — YouTube embed */}
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <HlsPlayer
                  src={`https://www.youtube.com/embed/${activeStream.youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                  autoPlay
                />
              </div>

              {/* Channel info */}
              <div className="px-4 py-3 flex items-center gap-3"
                style={{ background: "#1a1a1a" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "#E50914" }}>
                  {activeStream.channel[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{activeStream.channel}</p>
                  <p className="text-white/60 text-xs">{activeStream.category} • Live Stream</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
