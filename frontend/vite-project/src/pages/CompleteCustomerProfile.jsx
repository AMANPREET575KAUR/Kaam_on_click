import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { MapPin, Home, Phone, Building2, ArrowRight, Sparkles, CheckCircle2, ChevronDown, UserCircle } from "lucide-react";
import { states } from "../data/states";
import { motion, AnimatePresence } from "framer-motion";

function CompleteCustomerProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!address || !city || !state) {
      setError("Address, city and state are required");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const mutation = `
        mutation {
          completeCustomerProfile(
            phone: "${phone}"
            address: "${address}"
            houseNumber: "${houseNumber}"
            city: "${city}"
            state: "${state}"
          ) { id profileCompleted }
        }
      `;
      await axios.post(config.API_URL, { query: mutation }, { headers: { authorization: token } });
      localStorage.setItem("profileCompleted", "true");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || "Failed to complete profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans selection:bg-primary-100 selection:text-primary-900 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-premium p-10 lg:p-14 relative z-10"
      >
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <Sparkles size={14} />
             <span>Step 2: Credibility</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Final Touches</h1>
          <p className="text-slate-500 font-medium">
             Complete your identity to unlock premium services and secure bookings.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
               <div className="relative group/input">
                 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                 <input
                   type="tel"
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="+91 XXXXX XXXXX"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                 />
               </div>
             </div>

             <div className="group">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Flat / House No.</label>
               <div className="relative group/input">
                 <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                 <input
                   type="text"
                   value={houseNumber}
                   onChange={(e) => setHouseNumber(e.target.value)}
                   placeholder="e.g. 402, Block C"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                 />
               </div>
             </div>
          </div>

          <div className="group">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Complete Street Address</label>
            <div className="relative group/input">
              <MapPin className="absolute left-4 top-5 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Residential complex, Landmark, Street details..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
               <div className="relative group/input">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                 <input
                   type="text"
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                   placeholder="e.g. Bangalore"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                 />
               </div>
             </div>

             <div className="group">
               <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">State</label>
               <div className="relative group/input">
                 <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                 <select
                   value={state}
                   onChange={(e) => setState(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-10 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 appearance-none cursor-pointer"
                 >
                   <option value="">Select territory</option>
                   {states.map((s) => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
               </div>
             </div>
          </div>

          <div className="pt-6">
             <motion.button
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.99 }}
               onClick={handleSubmit}
               disabled={isLoading}
               className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-[2rem] py-5 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 group relative overflow-hidden"
             >
               {isLoading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>
                   <span>Complete My Profile</span>
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </>
               )}
               <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             </motion.button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
             <CheckCircle2 size={12} className="text-emerald-500" />
             <span>ISO 27001 Certified Security</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CompleteCustomerProfile;
