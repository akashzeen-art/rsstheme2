import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (data: { phone: string; plan: "weekly" | "monthly" }) => void;
}

const plans = [
  { id: "weekly",  name: "Weekly",  price: "₹79",  period: "per week"  },
  { id: "monthly", name: "Monthly", price: "₹179", period: "per month" },
];

export default function UnlockModal({ isOpen, onClose, onUnlock }: Props) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState<"weekly"|"monthly">("monthly");

  const reset = () => { setStep(1); setPhone(""); setPlan("monthly"); };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  const formattedPhone = phone.length === 10
    ? `+91 ${phone.slice(0, 5)}${phone.slice(5)}`
    : `+91 ${phone}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => { onClose(); reset(); }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: "#111", border: "1px solid rgba(229,9,20,0.3)" }}
          >
            <div className="p-6 relative">
              <button onClick={() => { onClose(); reset(); }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white transition"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <X size={18} />
              </button>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="s1"
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                    className="space-y-5 pt-2">
                    <div>
                      <h2 className="text-2xl font-black text-white mb-2">Enter your phone number</h2>
                      <p className="text-white/50 text-sm">Sign in or subscribe to unlock unlimited streaming</p>
                    </div>

                    <div>
                      <label className="text-xs text-white/50 mb-2 block">Mobile Number</label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm text-white shrink-0"
                          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
                          🇮🇳 +91
                        </div>
                        <input
                          type="tel" placeholder="10-digit number"
                          value={phone}
                          onChange={e => { const v = e.target.value.replace(/\D/g,""); if (v.length <= 10) setPhone(v); }}
                          className="flex-1 px-4 py-3 rounded-xl text-white text-sm outline-none transition"
                          style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${phone.length === 10 ? "#E50914" : "rgba(255,255,255,0.15)"}` }}
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      disabled={phone.length !== 10}
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "#E50914" }}
                    >Continue</motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="s2"
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                    className="space-y-5 pt-2">
                    <button onClick={() => setStep(1)} className="text-sm text-white/50 hover:text-red-400 transition">
                      ← Change number ({formattedPhone})
                    </button>

                    <div>
                      <h2 className="text-2xl font-black text-white mb-1">Choose your plan</h2>
                      <p className="text-white/50 text-sm">Select a pack to start watching</p>
                    </div>

                    <div className="space-y-3">
                      {plans.map(p => (
                        <motion.button key={p.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={() => setPlan(p.id as "weekly"|"monthly")}
                          className="w-full p-4 rounded-xl text-left flex items-center justify-between transition"
                          style={{
                            background: plan === p.id ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.05)",
                            border: `2px solid ${plan === p.id ? "#E50914" : "rgba(255,255,255,0.1)"}`,
                          }}>
                          <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-xs text-white/40">{p.period}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-xl font-black" style={{ color: "#E50914" }}>{p.price}</p>
                            {plan === p.id && (
                              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#E50914" }}>
                                <Check size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => onUnlock({ phone, plan })}
                      className="w-full py-3.5 rounded-xl font-bold text-white"
                      style={{ background: "#E50914" }}
                    >Subscribe</motion.button>
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
