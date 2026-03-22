import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { User, Mail, Lock, Phone, MapPin, Building2, Briefcase, Clock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SignupProvider() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [services, setServices] = useState("");
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const registerProvider = async () => {
    if (!name || !email || !password || !phone || !state || !city || !services || !experience) {
      setError("Please fill all mandatory fields to initialize professional status.");
      return;
    }
    setIsLoading(true);
    setError("");
    const query = `mutation {
      registerProvider(
        name:"${name}", email:"${email}", password:"${password}", phone:"${phone}",
        state:"${state}", city:"${city}", services:"${services}",
        experienceYears:${experience}, description:"Dedicated Service Professional"
      ) { id name }
    }`;
    try {
      await axios.post(config.API_URL, { query });
      alert("Provider Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Data synchronization error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[180px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-slate-900/5 blur-[180px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl rounded-[3.5rem] border border-white shadow-premium p-10 lg:p-14 relative z-10"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
             <ShieldCheck size={14} />
             <span>Provider Verification Portal</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Start Your Professional Journey</h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">Build an elite portfolio and connect with thousands of premium clients across the network.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
               <div className="bg-red-50 border border-red-100 rounded-3xl p-5 flex items-center gap-4 text-red-600 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-500/5">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />
                  {error}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Identity & Access */}
          <div className="space-y-8">
             <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Identity</span>
             </div>
             <div className="space-y-6">
                <div className="space-y-2 group/input">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input type="text" placeholder="Full Legal Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Identifier <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input type="email" placeholder="professional@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Passkey <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input type="password" placeholder="•••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Phone <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" />
                  </div>
                </div>
             </div>
          </div>

          {/* Professional Context */}
          <div className="space-y-8">
             <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade Context</span>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2 group/input">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State Territory <span className="text-red-500 ml-0.5">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                        <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none" />
                      </div>
                   </div>
                   <div className="space-y-2 group/input">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating City <span className="text-red-500 ml-0.5">*</span></label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none" />
                      </div>
                   </div>
                </div>
                <div className="space-y-2 group/input">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Skillsets (Comma Sep) <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input type="text" placeholder="e.g. Plumbing, Electrical, HVAC" value={services} onChange={(e) => setServices(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" />
                  </div>
                </div>
                <div className="space-y-2 group/input">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commercial Experience (Years) <span className="text-red-500 ml-0.5">*</span></label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input type="number" min="0" placeholder="Years" value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={registerProvider}
                    disabled={isLoading}
                    className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-[2rem] py-5.5 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 group relative overflow-hidden"
                  >
                     {isLoading ? (
                       <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : (
                       <>
                         <span>Initialize Professional Status</span>
                         <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                       </>
                     )}
                     <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </button>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-12 text-center border-t border-slate-100 pt-10">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Registered Partner? <Link to="/login" className="text-slate-950 hover:underline">Secure Authentication</Link>
           </p>
           <div className="flex items-center justify-center gap-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">
              <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Identity Protected</div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
              <div className="flex items-center gap-2 text-primary-500"><Sparkles size={12} /> Priority Indexing</div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SignupProvider;
