import { motion } from "framer-motion";
import { Zap, Shield, Users, CheckCircle2 } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-50 font-['Outfit'] selection:bg-primary-100 selection:text-primary-900">
      {/* ─── Left branded panel ─── */}
      <div className="hidden lg:flex lg:w-[46%] relative bg-slate-950 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-600/20 blur-[120px] rounded-full animate-pulse" />
        
        {/* Subtle Mesh Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Panel content */}
        <div className="relative z-10 flex flex-col justify-between p-16 xl:p-24 w-full">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-premium ring-4 ring-white/10">
              <span className="text-primary-600 font-extrabold text-2xl tracking-tighter">K</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              KaamOnClick
            </span>
          </motion.div>

          {/* Tagline */}
          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-8">
                One Tap.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 font-bold">Problem Gone.</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed font-light mb-12">
                India's premiere platform for verified professional services. Excellence at your doorstep, in minutes.
              </p>
            </motion.div>

            {/* Premium Feature list */}
            <div className="space-y-6">
              {[
                { icon: Zap, text: "Instant booking & real-time tracking", color: "text-amber-400" },
                { icon: Shield, text: "Background-checked & verified pros", color: "text-blue-400" },
                { icon: Users, text: "Join 10,000+ elite professionals", color: "text-emerald-400" },
              ].map(({ icon: Icon, text, color }, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                    <Icon size={20} className={color} />
                  </div>
                  <span className="text-slate-300 font-medium">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm shadow-inner"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800" />
              ))}
            </div>
            <span className="text-sm text-slate-400 font-medium">Trusted by 50,000+ users</span>
          </motion.div>
        </div>
      </div>

      {/* ─── Right form panel ─── */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-16 min-h-screen relative overflow-hidden">
        {/* Decorative background element for mobile/tablet */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-100/50 blur-[100px] rounded-full" />
        
        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-slate-900 font-bold text-xl tracking-tight">
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