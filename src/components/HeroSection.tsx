import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowUpDown } from "lucide-react";
import { Video, trendingVideos } from "../data/videos";

const FEATURED = [
  { video: trendingVideos[2],  genre: "Action",  rating: "18+", year: "2024" },
  { video: trendingVideos[0],  genre: "Thriller", rating: "18+", year: "2024" },
  { video: trendingVideos[8],  genre: "Action",  rating: "18+", year: "2024" },
];

// 8 images evenly spaced on the orbit ring
const ORBIT_IMAGES = [
  trendingVideos[1].thumbnail,
  trendingVideos[3].thumbnail,
  trendingVideos[4].thumbnail,
  trendingVideos[5].thumbnail,
  trendingVideos[6].thumbnail,
  trendingVideos[7].thumbnail,
  trendingVideos[9].thumbnail,
  trendingVideos[0].thumbnail,
];

interface Props {
  onWatchNow: (video: Video) => void;
  onExplore: () => void;
}

function spawnStars(clientX: number, clientY: number, count = 3) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "hero-star-particle";
    star.textContent = Math.random() > 0.45 ? "✦" : "✧";

    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 55;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 12 - Math.random() * 36;
    const size = 7 + Math.random() * 12;
    const dur = 0.45 + Math.random() * 0.5;
    const jitterX = (Math.random() - 0.5) * 10;
    const jitterY = (Math.random() - 0.5) * 10;

    star.style.cssText = `
      left:${clientX + jitterX}px;
      top:${clientY + jitterY}px;
      font-size:${size}px;
      --tx:${tx}px;
      --ty:${ty}px;
      --dur:${dur}s;
      --rot:${(Math.random() - 0.5) * 180}deg;
    `;

    document.body.appendChild(star);
    star.addEventListener("animationend", () => star.remove(), { once: true });
  }
}

function SparkleText({
  children,
  className = "",
  style,
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span className={className} style={style}>
      {children.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          data-char={char}
          className="letter inline-block will-change-transform"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection({ onWatchNow, onExplore }: Props) {
  const [idx, setIdx] = useState(0);
  const item = FEATURED[idx];
  const lastSpawn = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FEATURED.length), 7000);
    return () => clearInterval(t);
  }, []);

  const onHeroMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    const dist = Math.hypot(dx, dy);
    lastPos.current = { x: clientX, y: clientY };

    // Skip tiny jitter; spawn along the path as the cursor travels
    if (dist < 4) return;

    const now = performance.now();
    if (now - lastSpawn.current < 28) return;
    lastSpawn.current = now;

    const burst = dist > 28 ? 4 : 2;
    spawnStars(clientX, clientY, burst);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "640px", background: "#0a0000" }}
      onMouseMove={onHeroMove}
    >

      {/* Red theme background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(229,9,20,0.15) 0%, rgba(120,0,0,0.08) 40%, transparent 70%)",
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 40% 30% at 20% 60%, rgba(180,0,0,0.07) 0%, transparent 60%)",
      }} />
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 40% 30% at 80% 55%, rgba(160,20,0,0.07) 0%, transparent 60%)",
      }} />

      {/* Orbit ring — visible on lg+ screens */}
      <style>{`
        @keyframes orbitRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes counterSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>

      <div className="absolute hidden lg:block" style={{
        top: "50%", left: "50%",
        width: 700, height: 700,
        marginTop: 54,
        transform: "translate(-50%, -50%)",
        animation: "orbitRing 28s linear infinite",
      }}>
        {ORBIT_IMAGES.map((thumb, i) => {
          const angle = (360 / ORBIT_IMAGES.length) * i;
          const rad = (angle * Math.PI) / 180;
          const r = 340;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "50%", top: "50%",
                width: 110, height: 70,
                marginLeft: -55, marginTop: -35,
                transform: `translate(${x}px, ${y}px)`,
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 6px 30px rgba(0,0,0,0.7), 0 0 16px rgba(229,9,20,0.2)",
                border: "1px solid rgba(229,9,20,0.25)",
              }}
            >
              {/* counter-rotate so image stays upright */}
              <div style={{ width: "100%", height: "100%", animation: "counterSpin 28s linear infinite" }}>
                <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82) saturate(1.15)" }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(229,9,20,0.12) 0%, transparent 60%)" }} />
            </div>
          );
        })}
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: 68 }}>

        {/* Title — letters sprinkle stars on hover */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-3 px-4"
          >
            <h1 className="font-black text-white leading-tight mb-2"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)", textShadow: "0 0 40px rgba(229,9,20,0.4)" }}>
              <SparkleText>Stream the</SparkleText>
              <br />
              <SparkleText className="text-[#ff8a8a]">Best Content</SparkleText>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Premium originals · Exclusive releases · No ads
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={item.video.id + "-card"}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "min(420px, 92vw)",
              borderRadius: 20,
              background: "rgba(20,5,5,0.88)",
              border: "1px solid rgba(229,9,20,0.2)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 8px 60px rgba(0,0,0,0.6), 0 0 40px rgba(229,9,20,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Now watching row */}
            <div style={{ padding: "12px 16px 10px" }}>
              <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-widest">Now Trending</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={item.video.thumbnail} alt={item.video.title}
                    style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(229,9,20,0.3)" }} />
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{item.video.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.genre}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider with swap icon */}
            <div className="relative flex items-center justify-center" style={{ margin: "0 16px" }}>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", flex: 1 }} />
              <button
                onClick={() => setIdx(i => (i + 1) % FEATURED.length)}
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(229,9,20,0.15)",
                  border: "1px solid rgba(229,9,20,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", margin: "0 10px",
                }}
              >
                <ArrowUpDown size={14} color="#E50914" />
              </button>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", flex: 1 }} />
            </div>

            {/* Next up row */}
            <div style={{ padding: "10px 16px 12px" }}>
              <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-widest">Up Next</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={FEATURED[(idx + 1) % FEATURED.length].video.thumbnail}
                    alt=""
                    style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", border: "1px solid rgba(229,9,20,0.25)" }} />
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{FEATURED[(idx + 1) % FEATURED.length].video.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{FEATURED[(idx + 1) % FEATURED.length].genre}</p>
                  </div>
                </div>
              </div>
            </div>


            {/* CTA Button */}
            <div style={{ padding: "0 16px 14px" }}>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => onWatchNow(item.video)}
                className="w-full flex items-center justify-center gap-2 font-bold text-white text-base"
                style={{
                  padding: "11px 0",
                  borderRadius: 10,
                  background: "linear-gradient(90deg, #E50914 0%, #a00000 100%)",
                  border: "1px solid rgba(229,9,20,0.4)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >
                <Play size={18} fill="white" /> Watch Now
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-5">
          {FEATURED.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 20 : 6, height: 6, borderRadius: 3,
                background: i === idx ? "#E50914" : "rgba(255,255,255,0.2)",
                border: "none", cursor: "pointer",
                transition: "all 0.3s ease",
              }} />
          ))}
        </div>

        {/* Explore link */}
        <button onClick={onExplore}
          className="mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          style={{ background: "none", border: "none", cursor: "pointer", letterSpacing: "0.05em" }}>
          Browse all content ↓
        </button>
      </div>
    </div>
  );
}
