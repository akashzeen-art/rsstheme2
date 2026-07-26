import { motion } from "framer-motion";

const banners = {
  fitness: {
    emoji: "💪", title: "Start Your Fitness Journey",
    sub: "Transform your body with expert-led workouts",
    from: "#8B5CF6", to: "#EC4899",
  },
  comedy: {
    emoji: "😂", title: "Laugh Unlimited",
    sub: "Premium comedy specials from top comedians",
    from: "#06B6D4", to: "#3B82F6",
  },
  cooking: {
    emoji: "🍳", title: "Cook Like A Pro",
    sub: "Master culinary skills with professional chefs",
    from: "#F59E0B", to: "#EF4444",
  },
};

interface Props { variant: "fitness" | "comedy" | "cooking"; }

export default function PromotionalBanner({ variant }: Props) {
  const b = banners[variant];
  return (
    <section className="relative py-16 overflow-hidden my-4" style={{ background: "#000", borderTop: "1px solid rgba(229,9,20,0.2)", borderBottom: "1px solid rgba(229,9,20,0.2)" }}>
      {/* glow bg */}
      <motion.div
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 blur-3xl"
        style={{ background: `linear-gradient(135deg,${b.from},${b.to})` }}
      />
      <div className="absolute inset-0 border-y"
        style={{ borderColor: `${b.from}30` }} />

      <div className="relative z-10 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <motion.div
            animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >{b.emoji}</motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{b.title}</h2>
          <p className="text-white/50 text-lg mb-6">{b.sub}</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-xl font-bold text-white"
            style={{ background: `linear-gradient(135deg,${b.from},${b.to})` }}
          >
            Explore Now →
          </motion.button>
        </div>

        <motion.div
          animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-36 h-36 md:w-52 md:h-52 rounded-full flex-shrink-0 opacity-20"
          style={{ background: `conic-gradient(${b.from},${b.to},${b.from})` }}
        />
      </div>
    </section>
  );
}
