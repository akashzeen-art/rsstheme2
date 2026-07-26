import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Play, Star, Trophy, Users, X, Lock } from "lucide-react";

const GAMES = [
  {
    id: "g1",
    title: "SHADOW STRIKE",
    genre: "Action • Shooter",
    rating: "4.8",
    players: "2.1M",
    thumb: "/landscape/66.png",
    portrait: "/portrait/66.png",
    desc: "Infiltrate enemy strongholds in this fast-paced tactical shooter. Complete missions to unlock exclusive CinemaX content.",
    tag: "EXCLUSIVE",
    tagColor: "#E50914",
    gameUrl: "https://www.crazygames.com/embed/bullet-force-multiplayer",
  },
  {
    id: "g2",
    title: "CRIME CITY",
    genre: "Strategy • Crime",
    rating: "4.6",
    players: "1.4M",
    thumb: "/landscape/87.png",
    portrait: "/portrait/87.png",
    desc: "Build your criminal empire from scratch. Outsmart rival gangs and become the city's most feared boss.",
    tag: "NEW",
    tagColor: "#10b981",
    gameUrl: "https://www.crazygames.com/embed/city-car-stunt-4",
  },
  {
    id: "g3",
    title: "MYSTERY MANOR",
    genre: "Puzzle • Mystery",
    rating: "4.7",
    players: "980K",
    thumb: "/landscape/58.png",
    portrait: "/portrait/42.png",
    desc: "Solve cryptic puzzles inside a haunted manor. Every room hides a secret — can you escape before midnight?",
    tag: "TOP RATED",
    tagColor: "#f59e0b",
    gameUrl: "https://www.crazygames.com/embed/100-doors-escape-puzzle",
  },
  {
    id: "g4",
    title: "ROGUE RUNNER",
    genre: "Adventure • Endless",
    rating: "4.5",
    players: "3.2M",
    thumb: "/landscape/26.png",
    portrait: "/portrait/26.png",
    desc: "Race through dangerous terrain as a rogue operative. Dodge traps, collect intel and survive the chase.",
    tag: "POPULAR",
    tagColor: "#8b5cf6",
    gameUrl: "https://www.crazygames.com/embed/temple-run-2",
  },
  {
    id: "g5",
    title: "DARK EMPIRE",
    genre: "RPG • Strategy",
    rating: "4.9",
    players: "750K",
    thumb: "/landscape/100.png",
    portrait: "/portrait/64.png",
    desc: "Command armies, forge alliances and conquer kingdoms in this epic dark fantasy RPG.",
    tag: "EXCLUSIVE",
    tagColor: "#E50914",
    gameUrl: "https://www.crazygames.com/embed/age-of-war-2",
  },
];

interface Props {
  hasAccess: boolean;
  onRequireAccess: () => void;
}

export default function GamesSection({ hasAccess, onRequireAccess }: Props) {
  const [active, setActive] = useState<typeof GAMES[0] | null>(null);
  const [playing, setPlaying] = useState<typeof GAMES[0] | null>(null);

  const handlePlay = (game: typeof GAMES[0]) => {
    if (!hasAccess) { onRequireAccess(); return; }
    setActive(game);
  };

  return (
    <section className="py-10" style={{ background: "#000" }}>
      {/* Header */}
      <div className="px-6 md:px-12 mb-6 flex items-center gap-3">
        <div className="w-1 h-7 rounded-full shrink-0" style={{ background: "#E50914" }} />
        <Gamepad2 size={22} style={{ color: "#E50914" }} />
        <h2
          className="font-black text-xl md:text-2xl uppercase tracking-wide"
          style={{
            background: "linear-gradient(90deg, #fff 0%, #E50914 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          CinemaX Games
        </h2>
        <span className="px-2 py-0.5 rounded text-xs font-bold text-white"
          style={{ background: "rgba(229,9,20,0.2)", border: "1px solid #E50914", color: "#E50914" }}>
          SERIES GAMES
        </span>
      </div>

      {/* Featured game — large card */}
      <div className="px-6 md:px-12 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden cursor-pointer group"
          style={{ background: "#111", border: "1px solid rgba(229,9,20,0.2)" }}
          onClick={() => handlePlay(GAMES[0])}
        >
          <div className="relative" style={{ aspectRatio: "21/7" }}>
            <img src={GAMES[0].thumb} alt={GAMES[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "brightness(0.45)" }} />
            <div className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
            <div className="absolute inset-0 flex items-center px-8 md:px-14">
              <div className="max-w-lg">
                <span className="text-xs font-black px-2 py-0.5 rounded mb-3 inline-block"
                  style={{ background: "#E50914", color: "#fff" }}>FEATURED GAME</span>
                <h3 className="text-white font-black text-3xl md:text-5xl uppercase mb-2">{GAMES[0].title}</h3>
                <p className="text-white/50 text-sm mb-2">{GAMES[0].genre}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                    <Star size={14} fill="#f59e0b" stroke="none" /> {GAMES[0].rating}
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-sm">
                    <Users size={13} /> {GAMES[0].players} playing
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-5 max-w-sm">{GAMES[0].desc}</p>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: "#E50914" }}
                >
                  {hasAccess ? <><Play size={16} fill="#fff" /> Play Now</> : <><Lock size={16} /> Subscribe to Play</>}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Game cards row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 pb-2">
        {GAMES.slice(1).map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="shrink-0 w-[200px] md:w-[220px] rounded-xl overflow-hidden cursor-pointer group"
            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}
            onClick={() => handlePlay(game)}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: "2/3" }}>
              <img src={game.portrait} alt={game.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "brightness(0.6)" }} />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)" }} />
              <span className="absolute top-2 left-2 text-xs font-black px-2 py-0.5 rounded"
                style={{ background: game.tagColor, color: "#fff" }}>{game.tag}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(229,9,20,0.9)" }}>
                  {hasAccess ? <Play size={20} fill="#fff" className="ml-0.5" /> : <Lock size={18} className="text-white" />}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-black text-sm leading-tight">{game.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{game.genre}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                    <Star size={10} fill="#f59e0b" stroke="none" /> {game.rating}
                  </span>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Users size={9} /> {game.players}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
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
                <img src={active.thumb} alt={active.title} className="w-full h-full object-cover" style={{ filter: "brightness(0.5)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111 0%, transparent 55%)" }} />
                <span className="absolute top-3 left-3 text-xs font-black px-2 py-0.5 rounded"
                  style={{ background: active.tagColor, color: "#fff" }}>{active.tag}</span>
                <button onClick={() => setActive(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
                  style={{ background: "rgba(0,0,0,0.5)" }}>
                  <X size={16} />
                </button>
              </div>
              <div className="p-5">
                <h3 className="text-white font-black text-2xl uppercase mb-1">{active.title}</h3>
                <p className="text-white/50 text-xs mb-3">{active.genre}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                    <Star size={14} fill="#f59e0b" stroke="none" /> {active.rating}
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-sm">
                    <Users size={13} /> {active.players} playing
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-sm">
                    <Trophy size={13} /> Leaderboard Active
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">{active.desc}</p>
                <button
                  onClick={() => { setPlaying(active); setActive(null); }}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "#E50914" }}
                >
                  <Play size={16} fill="#fff" /> Launch Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Game Player */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex flex-col"
            style={{ background: "#000" }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: "#111", borderBottom: "1px solid rgba(229,9,20,0.3)" }}>
              <div className="flex items-center gap-3">
                <Gamepad2 size={18} style={{ color: "#E50914" }} />
                <span className="text-white font-black text-sm uppercase tracking-wide">{playing.title}</span>
                <span className="text-xs px-2 py-0.5 rounded font-bold"
                  style={{ background: playing.tagColor, color: "#fff" }}>{playing.tag}</span>
                <span className="text-white/40 text-xs">{playing.genre}</span>
              </div>
              <button
                onClick={() => setPlaying(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold hover:bg-white/10 transition"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <X size={14} /> Exit Game
              </button>
            </div>

            {/* Game iframe */}
            <div className="flex-1 relative">
              <iframe
                src={playing.gameUrl}
                className="w-full h-full border-0"
                allow="fullscreen; autoplay; gamepad"
                allowFullScreen
                title={playing.title}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
