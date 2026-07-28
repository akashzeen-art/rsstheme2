import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Video, trendingVideos, fatalConnectionsVideos } from "../data/videos";

const ITEMS: Video[] = [
  ...trendingVideos.slice(0, 6),
  ...fatalConnectionsVideos.slice(0, 6),
];

const N = ITEMS.length;
const SENS = 0.28;
const AUTO_SPEED = 0.025;

interface Props {
  onWatchNow: (video: Video) => void;
}

export default function Hero360({ onWatchNow }: Props) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [radius, setRadius] = useState(420);
  const [cardW, setCardW] = useState(200);

  const rotRef = useRef(0);
  const velRef = useRef(0);
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const rafRef = useRef(0);

  const focused = ((Math.round(-rotation / (360 / N)) % N) + N) % N;
  const active = ITEMS[focused];

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setCardW(120);
        setRadius(220);
      } else if (w < 1024) {
        setCardW(160);
        setRadius(300);
      } else {
        setCardW(190);
        setRadius(360);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;

      if (!dragRef.current) {
        if (Math.abs(velRef.current) > 0.002) {
          rotRef.current += velRef.current * dt;
          velRef.current *= 0.95;
        } else {
          velRef.current = 0;
          rotRef.current += AUTO_SPEED * dt;
        }
        setRotation(rotRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = true;
    setDragging(true);
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    velRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    const dt = Math.max(1, now - lastTRef.current);
    rotRef.current += dx * SENS;
    velRef.current = (dx * SENS) / dt;
    lastXRef.current = e.clientX;
    lastTRef.current = now;
    setRotation(rotRef.current);
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current = false;
    setDragging(false);
  }, []);

  const step = (dir: 1 | -1) => {
    const stepDeg = 360 / N;
    const target = Math.round(rotRef.current / stepDeg) * stepDeg + dir * stepDeg;
    rotRef.current = target;
    velRef.current = 0;
    setRotation(target);
  };

  const sceneH = Math.round(cardW * 1.45 + radius * 0.22);

  return (
    <section
      id="hero-360"
      className="relative w-full overflow-hidden select-none"
      style={{
        height: "100vh",
        minHeight: 640,
        background: "#000",
        touchAction: "none",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(229,9,20,0.18) 0%, rgba(40,0,0,0.35) 45%, #000 75%)",
        }}
      />

      {/* Stack: title → rotation → watch now */}
      <div
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4"
        style={{ paddingTop: 68, gap: 20 }}
      >
        {/* 1. Title */}
        <div className="text-center shrink-0 relative z-20">
          <p
            className="text-xs uppercase tracking-[0.35em] mb-2"
            style={{ color: "rgba(255,138,138,0.85)" }}
          >
            360° Experience
          </p>
          <h2
            className="font-black text-white leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              textShadow: "0 0 40px rgba(229,9,20,0.45)",
            }}
          >
            Spin the Cinema
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-2">
            Drag left or right · Explore every title in the circle
          </p>
        </div>

        {/* 2. Rotation — between title and CTA */}
        <div
          className="relative w-full flex items-center justify-center shrink-0 overflow-hidden"
          style={{
            height: sceneH,
            maxHeight: "42vh",
            perspective: "1400px",
            cursor: dragging ? "grabbing" : "grab",
            zIndex: 10,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            style={{
              position: "relative",
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
              transform: `rotateX(6deg) rotateY(${rotation}deg)`,
            }}
          >
            {ITEMS.map((item, i) => {
              const angle = (360 / N) * i;
              let rel = ((angle + rotation) % 360 + 360) % 360;
              if (rel > 180) rel -= 360;
              const isFront = Math.abs(rel) < 360 / N / 2 + 2;
              const dim = Math.min(1, Math.abs(rel) / 90);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (Math.abs(velRef.current) > 0.05) return;
                    onWatchNow(item);
                  }}
                  aria-label={`Watch ${item.title}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: cardW,
                    aspectRatio: "16 / 10",
                    marginLeft: -cardW / 2,
                    marginTop: -(cardW * 0.3125),
                    borderRadius: 14,
                    overflow: "hidden",
                    border: isFront
                      ? "2px solid rgba(229,9,20,0.85)"
                      : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: isFront
                      ? "0 12px 40px rgba(229,9,20,0.35), 0 8px 32px rgba(0,0,0,0.7)"
                      : "0 8px 28px rgba(0,0,0,0.65)",
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    background: "#111",
                    filter: `brightness(${1 - dim * 0.55}) saturate(${1 - dim * 0.35})`,
                    opacity: 0.55 + (1 - dim) * 0.45,
                  }}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
                      pointerEvents: "none",
                    }}
                  />
                  {isFront && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                        right: 10,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        textAlign: "left",
                        textShadow: "0 1px 8px rgba(0,0,0,0.9)",
                        pointerEvents: "none",
                      }}
                    >
                      {item.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Watch Now */}
        <div className="flex flex-col items-center gap-3 shrink-0 relative z-20">
          <div className="text-center">
            <p className="text-white font-bold text-base md:text-lg">{active.title}</p>
            <p className="text-slate-400 text-xs mt-0.5">{active.category}</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Previous"
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
              }}
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              onClick={() => onWatchNow(active)}
              className="flex items-center gap-2 font-bold text-white text-sm md:text-base px-6 py-2.5 rounded-lg"
              style={{
                background: "linear-gradient(90deg, #E50914 0%, #a00000 100%)",
                border: "1px solid rgba(229,9,20,0.4)",
              }}
            >
              <Play size={16} fill="white" /> Watch Now
            </button>

            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Next"
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                transform: "scaleX(-1)",
              }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
