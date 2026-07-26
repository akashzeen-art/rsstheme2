import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Play } from "lucide-react";

const COMING_SOON = [
  {
    id: "cs1",
    title: "BLOOD COVENANT",
    category: "Crime • Thriller",
    releaseDate: "Aug 2025",
    thumb: "/landscape/41.png",
    desc: "A secret pact between two crime families unravels when a witness surfaces from the dead.",
    badge: "SERIES",
  },
  {
    id: "cs2",
    title: "ZERO HOUR",
    category: "Action • Espionage",
    releaseDate: "Aug 2025",
    thumb: "/landscape/53.png",
    desc: "An undercover agent has 60 minutes to stop a nuclear trigger from reaching enemy hands.",
    badge: "FILM",
  },
  {
    id: "cs3",
    title: "THE LAST EMPIRE",
    category: "Drama • History",
    releaseDate: "Sep 2025",
    thumb: "/landscape/71.png",
    desc: "The fall of a dynasty told through the eyes of the last surviving heir.",
    badge: "SERIES",
  },
  {
    id: "cs4",
    title: "DARK FREQUENCY",
    category: "Mystery • Sci-Fi",
    releaseDate: "Sep 2025",
    thumb: "/landscape/95.png",
    desc: "A radio signal from 1987 starts predicting murders happening today.",
    badge: "SERIES",
  },
  {
    id: "cs5",
    title: "ROGUE SIGNAL",
    category: "Thriller • Tech",
    releaseDate: "Oct 2025",
    thumb: "/landscape/79.png",
    desc: "A hacker uncovers a government surveillance program that knows too much.",
    badge: "FILM",
  },
  {
    id: "cs6",
    title: "SHADOW EMPIRE",
    category: "Crime • Action",
    releaseDate: "Oct 2025",
    thumb: "/landscape/98.png",
    desc: "One detective. Ten crime lords. A city on the edge of collapse.",
    badge: "SERIES",
  },
];

export default function ComingSoon() {
  const [active, setActive] = useState<typeof COMING_SOON[0] | null>(null);

  return (
    <section className="py-10" style={{ background: "#000" }}>
      {/* Header */}
      <div className="px-6 md:px-12 mb-6 flex items-center gap-3">
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
          Coming Soon
        </h2>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold text-white"
          style={{ background: "rgba(229,9,20,0.2)", border: "1px solid #E50914", color: "#E50914" }}>
          <Clock size={11} /> UPCOMING
        </span>
      </div>

      {/* Cards */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-2">
        {COMING_SOON.map((item) => (
          <div
            key={item.id}
            className="shrink-0 w-[260px] md:w-[300px] rounded-xl overflow-hidden cursor-pointer group"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}
            onClick={() => setActive(item)}
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={item.thumb}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "brightness(0.6)" }}
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />

              {/* Badge */}
              <span className="absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded"
                style={{ background: "#E50914", color: "#fff" }}>
                {item.badge}
              </span>

              {/* Release date — hidden */}

              {/* Play preview icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(229,9,20,0.85)" }}>
                  <Play size={20} fill="#fff" className="ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-black text-sm leading-tight">{item.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{item.category}</p>
              </div>
            </div>

            {/* Bottom */}
            <div className="px-3 py-3">
              <p className="text-white/40 text-xs line-clamp-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "#111", border: "1px solid rgba(229,9,20,0.35)" }}
            >
              <div className="relative" style={{ aspectRatio: "16/9" }}>
                <img src={active.thumb} alt={active.title} className="w-full h-full object-cover" style={{ filter: "brightness(0.55)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111 0%, transparent 60%)" }} />
                <span className="absolute top-3 left-3 text-xs font-black px-2 py-0.5 rounded"
                  style={{ background: "#E50914", color: "#fff" }}>{active.badge}</span>
                <button onClick={() => setActive(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
                  style={{ background: "rgba(0,0,0,0.5)" }}>✕</button>
              </div>
              <div className="p-5">
                <h3 className="text-white font-black text-2xl uppercase mb-1">{active.title}</h3>
                <p className="text-white/50 text-xs mb-3">{active.category}</p>
                <p className="text-white/70 text-sm leading-relaxed">{active.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
