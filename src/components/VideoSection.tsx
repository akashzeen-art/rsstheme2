import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import VideoCard from "./VideoCard";
import { Video } from "../data/videos";

interface Props {
  id?: string;
  title: string;
  subtitle?: string;
  videos: Video[];
  layout: string;
  onVideoClick: (v: Video) => void;
}

export default function VideoSection({ id, title, videos, onVideoClick }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 4);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = rowRef.current;
    if (el) { el.addEventListener("scroll", checkScroll); checkScroll(); }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [videos]);

  useEffect(() => {
    document.body.style.overflow = showAll ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showAll]);

  const scroll = (dir: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  const cardW = "w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] shrink-0";

  return (
    <>
    <section
      id={id}
      className="py-4 md:py-6 scroll-mt-20"
      style={{ background: "#000" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="px-6 md:px-12 mb-2 flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 flex-1"
        >
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
            {title}
          </h2>
          <motion.span
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-semibold flex items-center gap-1 cursor-pointer"
            style={{ color: "#E50914" }}
            onClick={() => setShowAll(true)}
          >
            Explore All <ChevronRight size={14} />
          </motion.span>
        </motion.div>
      </div>

      <div className="relative group/row">
        {/* Left arrow */}
        <motion.button
          animate={{ opacity: hovered && canL ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.95), transparent)" }}
          tabIndex={-1}
        >
          <ChevronLeft size={32} style={{ color: "#fff" }} />
        </motion.button>

        {/* Right arrow */}
        <motion.button
          animate={{ opacity: hovered && canR ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center"
          style={{ background: "linear-gradient(to left, rgba(0,0,0,0.95), transparent)" }}
          tabIndex={-1}
        >
          <ChevronRight size={32} style={{ color: "#fff" }} />
        </motion.button>

        {/* Row */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-6"
          style={{ scrollSnapType: "x mandatory", paddingLeft: "40px", paddingRight: "40px" }}
        >
          {videos.map((v, i) => (
            <motion.div
              key={v.id}
              className={cardW}
              style={{ scrollSnapAlign: "start" }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <VideoCard {...v} onClick={() => onVideoClick(v)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Explore All Modal */}
    <AnimatePresence>
      {showAll && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(10px)" }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-12 py-4"
            style={{ background: "rgba(0,0,0,0.95)", borderBottom: "1px solid rgba(229,9,20,0.25)" }}>
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 rounded-full" style={{ background: "#E50914" }} />
              <h2 className="font-black text-xl md:text-2xl uppercase tracking-wide"
                style={{
                  background: "linear-gradient(90deg, #fff 0%, #E50914 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                {title}
              </h2>
              <span className="text-white/40 text-sm">{videos.length} titles</span>
            </div>
            <button onClick={() => setShowAll(false)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              <X size={18} />
            </button>
          </div>

          {/* Grid */}
          <div className="px-6 md:px-12 py-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {videos.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                style={{ aspectRatio: v.aspect === "portrait" ? "2/3" : "16/9" }}
              >
                <VideoCard {...v} onClick={() => { onVideoClick(v); setShowAll(false); }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
