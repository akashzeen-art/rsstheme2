import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Maximize, Minimize, SkipForward, X, Volume2, VolumeX } from "lucide-react";

interface Props { isOpen: boolean; onClose: () => void; title: string; videoUrl: string; }

export default function VideoPlayer({ isOpen, onClose, title, videoUrl }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fs, setFs] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showCtrl, setShowCtrl] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const v = ref.current; if (!v) return;
    const on = (e: Event) => {
      if (e.type === "play") setPlaying(true);
      if (e.type === "pause") setPlaying(false);
      if (e.type === "timeupdate") setCurrent(v.currentTime);
      if (e.type === "loadedmetadata") setDuration(v.duration);
    };
    ["play","pause","timeupdate","loadedmetadata"].forEach(t => v.addEventListener(t, on));
    return () => ["play","pause","timeupdate","loadedmetadata"].forEach(t => v.removeEventListener(t, on));
  }, [isOpen]);

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFs = async () => {
    const el = containerRef.current; if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch { /* not supported */ }
  };

  const toggle = () => { if (!ref.current) return; playing ? ref.current.pause() : ref.current.play(); };
  const skip = (n: number) => { if (ref.current) ref.current.currentTime += n; };
  const fmt = (t: number) => { const m = Math.floor(t / 60), s = Math.floor(t % 60); return `${m}:${s.toString().padStart(2, "0")}`; };

  const handleMove = () => {
    setShowCtrl(true);
    clearTimeout(hideTimer.current);
    if (playing) hideTimer.current = setTimeout(() => setShowCtrl(false), 3000);
  };

  useEffect(() => {
    if (!isOpen) return;
    setPlaying(false); setCurrent(0);
    const v = ref.current;
    if (v) { v.currentTime = 0; v.play().catch(() => {}); }
  }, [isOpen, videoUrl]);

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.9)" }}
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-md overflow-hidden shadow-2xl"
            style={{ background: "#000" }}
            onMouseMove={handleMove}
          >
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <video
                ref={ref}
                src={videoUrl}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                onClick={toggle}
                playsInline
              />

              {/* Top bar */}
              <AnimatePresence>
                {showCtrl && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute top-0 left-0 right-0 px-5 py-4 flex items-center justify-between"
                    style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}
                  >
                    <p className="text-white font-semibold text-sm truncate max-w-xs">{title}</p>
                    <button onClick={onClose} className="p-2 rounded hover:bg-white/10 transition text-white">
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Center play indicator */}
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(229,9,20,0.85)" }}>
                    <Play size={30} className="text-white fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Bottom controls */}
              <AnimatePresence>
                {showCtrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-0 left-0 right-0 px-5 py-4 space-y-2"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
                  >
                    {/* Progress bar */}
                    <div className="relative group/prog">
                      <input
                        type="range" min={0} max={duration || 0} value={current}
                        onChange={e => { const t = +e.target.value; if (ref.current) ref.current.currentTime = t; setCurrent(t); }}
                        className="w-full h-1 rounded-full cursor-pointer appearance-none"
                        style={{ background: `linear-gradient(to right, #E50914 ${pct}%, rgba(255,255,255,0.25) ${pct}%)` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Btn onClick={() => skip(-10)}><SkipForward size={18} className="text-white rotate-180" /></Btn>
                        <Btn onClick={toggle}>
                          {playing
                            ? <Pause size={22} className="text-white fill-white" />
                            : <Play size={22} className="text-white fill-white ml-0.5" />}
                        </Btn>
                        <Btn onClick={() => skip(10)}><SkipForward size={18} className="text-white" /></Btn>

                        {/* Volume */}
                        <div className="flex items-center gap-1 group/vol">
                          <Btn onClick={() => { setMuted(m => !m); if (ref.current) ref.current.muted = !muted; }}>
                            {muted || volume === 0
                              ? <VolumeX size={18} className="text-white" />
                              : <Volume2 size={18} className="text-white" />}
                          </Btn>
                          <input
                            type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
                            onChange={e => { const v = +e.target.value; setVolume(v); if (ref.current) { ref.current.volume = v; ref.current.muted = v === 0; } setMuted(v === 0); }}
                            className="w-0 group-hover/vol:w-16 transition-all duration-200 h-1 rounded-full cursor-pointer appearance-none overflow-hidden"
                            style={{ background: `linear-gradient(to right, #fff ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(muted ? 0 : volume) * 100}%)` }}
                          />
                        </div>

                        <span className="text-slate-300 text-xs ml-1 hidden sm:block">
                          {fmt(current)} / {fmt(duration)}
                        </span>
                      </div>

                      <Btn onClick={toggleFs}>
                        {fs ? <Minimize size={18} className="text-white" /> : <Maximize size={18} className="text-white" />}
                      </Btn>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Btn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="p-2 rounded hover:bg-white/10 transition">
      {children}
    </button>
  );
}
