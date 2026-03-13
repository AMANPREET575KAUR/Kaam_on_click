import { motion } from "framer-motion";
import { Zap, Shield, Users } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* ─── Left branded panel ─── */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-[#09090b] overflow-hidden">
        {/* Gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-zinc-400/[0.06]" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Panel content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-lg">K</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">
              KaamOnClick
            </span>
          </div>

          {/* Tagline */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-5"
            >
              One Tap.
              <br />
              <span className="text-zinc-300">Problem Gone.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-zinc-400 max-w-sm leading-relaxed"
            >
              India's fastest-growing platform connecting you with verified
              professionals — plumbing, electrical, cleaning & more.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col gap-4 mt-10"
            >
              {[
                { icon: Zap, text: "Instant booking, real-time tracking" },
                { icon: Shield, text: "Verified & background-checked pros" },
                { icon: Users, text: "10,000+ professionals across India" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-zinc-300" />
                  </div>
                  <span className="text-sm text-zinc-400">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Trust bar */}
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Trusted by 50,000+ customers across 31 states</span>
          </div>
        </div>
      </div>

      {/* ─── Right form panel ─── */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 sm:p-10 lg:p-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-[#09090b] flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="text-[#09090b] font-semibold text-lg tracking-tight">
              KaamOnClick
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;