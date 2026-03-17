import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { User, Mail, Lock, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SignupCustomer() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !phone || !state) {
      setError("All fields are required.");
      return;
    }
    setIsLoading(true);
    setError("");
    const query = `mutation {
      registerCustomer(name:"${name}", email:"${email}", password:"${password}", phone:"${phone}", state:"${state}") { id name }
    }`;
    try {
      await axios.post(config.API_URL, { query });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Email might already be in use.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-premium p-10 lg:p-14 relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <ShieldCheck size={14} />
             <span>Join KaamOnClick Economy</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Create Account</h1>
          <p className="text-slate-500 font-medium">Register as a customer to access elite services.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
               <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 text-red-600 text-xs font-bold shadow-lg shadow-red-500/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {error}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group/input">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                   <input
                     type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all shadow-inner"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Line</label>
                <div className="relative group/input">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                   <input
                     type="tel" placeholder="+91 XXXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all shadow-inner"
                   />
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Email)</label>
             <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                <input
                  type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all shadow-inner"
                />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                <div className="relative group/input">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                   <input
                     type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all shadow-inner"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary State</label>
                <div className="relative group/input">
                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                   <input
                     type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)}
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all shadow-inner"
                   />
                </div>
             </div>
          </div>

          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-[2rem] py-5 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 group relative overflow-hidden mt-4"
          >
             {isLoading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <>
                 <span>Create Customer Account</span>
                 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </>
             )}
             <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </button>

          <div className="text-center pt-6">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Already registered? <Link to="/login" className="text-slate-950 hover:underline">Authorize Here</Link>
             </p>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-8">
             <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Secure Encryption</div>
             <div className="w-1 h-1 bg-slate-200 rounded-full" />
             <div className="flex items-center gap-2 text-primary-500"><Sparkles size={12} /> Elite Priority</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignupCustomer;
