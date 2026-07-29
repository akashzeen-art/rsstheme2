import { motion } from "framer-motion";
import { Tv, Smartphone } from "lucide-react";

export default function DeviceShowcase() {
  return (
    <section className="relative py-16 overflow-hidden" style={{ background: "#000" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(229,9,20,0.12) 0%, transparent 70%)" }} />

      {/* Heading */}
      <div className="relative z-10 text-center mb-12 px-6">
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#E50914" }}>
          Available Everywhere
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="font-black text-3xl md:text-5xl uppercase tracking-wide"
          style={{
            background: "linear-gradient(90deg, #fff 0%, #E50914 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Watch on Any Device
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.14 }} className="text-white/50 mt-2 text-sm md:text-base max-w-md mx-auto">
          Stream on your Smart TV, phone, tablet or laptop — anytime, anywhere.
        </motion.p>
      </div>

      {/* Devices row */}
      <div className="relative z-10 flex items-end justify-center gap-6 md:gap-10 px-6">

        {/* TV Mockup */}
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="relative shrink-0" style={{ width: "min(520px, 58vw)" }}>
          <div className="relative rounded-xl overflow-hidden" style={{
            background: "#1a1a1a", border: "6px solid #2a2a2a",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(229,9,20,0.15)",
          }}>
            <div className="relative" style={{ aspectRatio: "16/9", background: "#111" }}>
              <img src="/newlandscape/SCILENT CHASE.png" alt="TV Screen" className="w-full h-full object-cover" style={{ filter: "brightness(0.75)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              <div className="absolute inset-0 flex">
                <div className="h-full flex flex-col gap-3 py-4 px-3" style={{ width: "28%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
                  <span className="font-black text-sm mb-2" style={{ color: "#E50914" }}>CINEMAX</span>
                  {["Home", "Explore", "Favourites", "Settings"].map((item, i) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? "#E50914" : "transparent", border: i !== 0 ? "1px solid rgba(255,255,255,0.2)" : "none" }} />
                      <span className="text-xs font-medium" style={{ color: i === 0 ? "#E50914" : "rgba(255,255,255,0.4)" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex-1" />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div style={{ width: "18%", height: "18px", background: "#2a2a2a", borderRadius: "0 0 4px 4px" }} />
          </div>
          <div className="flex justify-center">
            <div style={{ width: "32%", height: "6px", background: "#222", borderRadius: "4px" }} />
          </div>
          <div className="absolute -top-3 -left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: "#E50914" }}>
            <Tv size={12} /> Smart TV
          </div>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }} className="relative shrink-0 mb-4" style={{ width: "min(160px, 18vw)" }}>
          <div className="relative rounded-3xl overflow-hidden" style={{
            background: "#1a1a1a", border: "5px solid #2a2a2a",
            boxShadow: "0 30px 60px rgba(0,0,0,0.8), 0 0 30px rgba(229,9,20,0.15)",
          }}>
            <div className="flex justify-center pt-2 pb-1" style={{ background: "#1a1a1a" }}>
              <div className="w-10 h-1.5 rounded-full" style={{ background: "#333" }} />
            </div>
            <div className="relative" style={{ aspectRatio: "9/16", background: "#111" }}>
              <img src="/newportrait/THE MISSING LINK.jpg" alt="Phone Screen" className="w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />

            </div>
          </div>
          <div className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: "#E50914" }}>
            <Smartphone size={12} /> Mobile
          </div>
        </motion.div>
      </div>

      {/* Feature pills */}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: 0.3 }} className="relative z-10 flex flex-wrap justify-center gap-3 mt-10 px-6">
        {["4K Ultra HD", "Dolby Audio", "No Ads", "Multi-Device"].map(f => (
          <span key={f} className="px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(229,9,20,0.12)", border: "1px solid #E50914", color: "#E50914" }}>
            {f}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
