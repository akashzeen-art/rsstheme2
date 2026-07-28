import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronDown, X, Menu } from "lucide-react";
import { allVideos } from "../data/videos";

const NOTIFICATIONS = [
  { id: 1, text: "New release: CHASE TO DANGER EP4 is now streaming!", time: "2m ago" },
  { id: 2, text: "DANGEROUS MINDS EP4 finale — don't miss the shocking twist.", time: "1h ago" },
  { id: 3, text: "Your weekly plan renews in 2 days.", time: "3h ago" },
  { id: 4, text: "New arrival: BLACK HORIZON added to Premium Collection.", time: "5h ago" },
];

interface Props {
  onMyAccount: () => void;
}

const navItems: { label: string; action: (onMyAccount: () => void) => void }[] = [
  { label: "Home",               action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  { label: "TV Shows",           action: () => document.getElementById("fatal")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "Movies",             action: () => document.getElementById("mission")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "New & Hot",          action: () => document.getElementById("dangerous")?.scrollIntoView({ behavior: "smooth" }) },
  { label: "My List",            action: () => document.getElementById("escape")?.scrollIntoView({ behavior: "smooth" }) },
];

export default function Navbar({ onMyAccount }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof allVideos>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const q = searchVal.trim().toLowerCase();
    setSearchResults(q.length >= 2 ? allVideos.filter(v =>
      v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
    ).slice(0, 6) : []);
  }, [searchVal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <motion.nav
        animate={{ backgroundColor: scrolled ? "rgba(0,0,0,0.97)" : "transparent" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center px-6 md:px-12"
        style={{ backgroundImage: scrolled ? "none" : "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)" }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1 mr-8 shrink-0"
        >
          <span className="text-2xl md:text-3xl font-black tracking-tight text-white">
            CINEMAX
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-5 flex-1">
          {navItems.map(({ label, action }) => (
            <button
              key={label}
              onClick={() => action(onMyAccount)}
              className="text-sm text-white hover:text-red-200 transition font-medium whitespace-nowrap"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3 ml-auto">
          {/* Search */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative mr-1"
                >
                  <input
                    ref={searchRef}
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder="Titles, genres…"
                    className="w-full text-sm text-white border border-white/40 px-3 py-1.5 outline-none rounded-sm"
                    style={{ background: "rgba(0,0,0,0.7)" }}
                    onBlur={() => { if (!searchVal) { setSearchOpen(false); setSearchResults([]); } }}
                  />
                  <AnimatePresence>
                    {searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="absolute top-full left-0 right-0 mt-1 rounded-md overflow-hidden shadow-2xl z-50"
                        style={{ background: "#1a1a1a", border: "1px solid rgba(229,9,20,0.3)", minWidth: 260 }}
                      >
                        {searchResults.map(v => (
                          <button
                            key={v.id}
                            onMouseDown={() => {
                              const el = document.querySelector(`[data-video-id="${v.id}"]`);
                              el?.scrollIntoView({ behavior: "smooth", block: "center" });
                              setSearchVal(""); setSearchOpen(false); setSearchResults([]);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition text-left"
                          >
                            <img src={v.thumbnail} alt={v.title} className="w-12 h-8 object-cover rounded shrink-0" />
                            <div>
                              <p className="text-white text-xs font-semibold line-clamp-1">{v.title}</p>
                              <p className="text-xs" style={{ color: "#E50914" }}>{v.category}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => { setSearchOpen(s => !s); if (searchOpen) { setSearchVal(""); setSearchResults([]); } }}
              className="p-2 text-white hover:text-red-200 transition"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Bell */}
          <div ref={bellRef} className="relative">
            <button
              onClick={() => setBellOpen(o => !o)}
              className="p-2 text-white hover:text-red-200 transition relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-lg overflow-hidden shadow-2xl z-50"
                  style={{ background: "#1a1a1a", border: "1px solid rgba(229,9,20,0.3)" }}
                >
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-white font-bold text-sm">Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: "#E50914" }}>{NOTIFICATIONS.length} New</span>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-white/5 transition cursor-pointer" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <p className="text-white/80 text-xs leading-snug mb-1">{n.text}</p>
                      <p className="text-xs" style={{ color: "#E50914" }}>{n.time}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <button onClick={onMyAccount} className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
              style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
              U
            </div>
            <ChevronDown size={14} className="text-white group-hover:rotate-180 transition-transform duration-200 hidden md:block" />
          </button>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 text-white">
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 h-full w-64"
              style={{ background: "#111", borderLeft: "1px solid rgba(229,9,20,0.3)" }}
            >
              <div className="flex items-center justify-between px-5 h-[68px] border-b border-red-900">
                <span className="font-black text-lg text-white">CINEMAX</span>
                <button onClick={() => setMobileOpen(false)} className="text-white p-1"><X size={20} /></button>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={() => { setMobileOpen(false); action(onMyAccount); }}
                    className="text-left px-4 py-3 text-white hover:bg-white/10 rounded text-sm font-medium transition"
                  >
                    {label}
                  </button>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); onMyAccount(); }}
                  className="text-left px-4 py-3 text-white hover:bg-white/10 rounded text-sm font-medium transition mt-2 border-t border-white/20 pt-4"
                >
                  My Account
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
