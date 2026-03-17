import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { Phone, Camera, MapPin, Building2, Clock, Wrench, FileText, ArrowRight, Sparkles, CheckCircle2, ChevronDown, UserCircle } from "lucide-react";
import { states } from "../data/states";
import { motion, AnimatePresence } from "framer-motion";

function CompleteProviderProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [services, setServices] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExistingProviderDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!token || !userId) return;

      const query = `{
        providerProfile(userId: ${userId}) {
          phone
          state
          profile {
            services
            experienceYears
            description
            city
            profilePicture
          }
        }
      }`;

      try {
        const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
        const data = res.data?.data?.providerProfile;
        if (!data) return;

        setPhone(data.phone || "");
        setState(data.state || "");
        setCity(data.profile?.city || "");
        setExperienceYears(data.profile?.experienceYears ? String(data.profile.experienceYears) : "");
        setDescription(data.profile?.description || "");
        setProfilePicture(data.profile?.profilePicture || "");

        const existingServices = data.profile?.services
          ? data.profile.services.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        setServices(existingServices);
      } catch (err) {
        // Prefill is best-effort and should not block completion flow.
      }
    };

    fetchExistingProviderDetails();
  }, [token]);

  const servicesList = ["Plumbing", "Electrician", "Cleaning", "Carpenter", "Painter", "AC Repair", "Appliance Repair"];

  const toggleService = (service) => {
    setServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
       if (file.size > 5 * 1024 * 1024) { setError("Image must be less than 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePicture(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!phone || !profilePicture || !experienceYears || services.length === 0 || !city || !state) {
      setError("Please fill all mandatory fields marked with *");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const mutation = `
        mutation {
          completeProviderProfile(
            phone: "${phone}"
            profilePicture: "${profilePicture}"
            experienceYears: ${parseInt(experienceYears)}
            services: "${services.join(",")}"
            city: "${city}"
            state: "${state}"
            description: "${description.replace(/"/g, '\\"')}"
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
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-[3rem] border border-white shadow-premium p-10 lg:p-14 relative z-10"
      >
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-4">
             <Sparkles size={14} />
             <span>Professional Onboarding</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Service Verification</h1>
          <p className="text-slate-500 font-medium">
             Enter your professional credentials and services to start receiving high-value leads.
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
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-red-500/5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-sm font-bold text-red-600">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
          {/* Top Section: Photo & Basic Details */}
          <div className="flex flex-col md:flex-row gap-10 items-start">
             <div className="shrink-0 group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Business Avatar</label>
                <div className="relative">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200 group-hover:border-primary-400 transition-all shadow-inner relative">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="text-slate-200" size={64} strokeWidth={1} />
                      )}
                   </div>
                   <label className="absolute bottom-[-10px] right-[-10px] cursor-pointer w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                      <Camera size={20} strokeWidth={2.5} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                   </label>
                </div>
             </div>

             <div className="flex-1 w-full space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contact Phone</label>
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Overall Experience</label>
                  <div className="relative group/input">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                    <input
                      type="number"
                      min="0"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="Number of years in trade"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
             </div>
          </div>

          {/* Services Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Expert Skills</label>
                <span className="text-[10px] font-bold text-primary-500 uppercase">{services.length} Selected</span>
             </div>
             <div className="flex flex-wrap gap-2.5">
               {servicesList.map((s) => (
                 <button
                   key={s}
                   type="button"
                   onClick={() => toggleService(s)}
                   className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${
                     services.includes(s)
                       ? "bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-200"
                       : "bg-white text-slate-500 border-slate-100 hover:border-slate-300 shadow-sm"
                   }`}
                 >
                   {s}
                 </button>
               ))}
             </div>
          </div>

          {/* Location Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Base City</label>
               <div className="relative group/input">
                 <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                 <input
                   type="text"
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                   placeholder="e.g. Hyderabad"
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                 />
               </div>
             </div>

             <div className="group">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">State Territory</label>
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

          {/* About Section */}
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Professional Pitch</label>
            <div className="relative group/input">
              <FileText className="absolute left-4 top-5 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight your expertise, recent works, and why customers should choose you..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-5 pl-12 pr-4 text-sm font-medium text-slate-700 leading-relaxed focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300 resize-none shadow-inner"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8">
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
                   <span>Initialize Pro Profile</span>
                   <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </>
               )}
               <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             </motion.button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pt-4">
             <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Secure Encryption</div>
             <div className="w-1 h-1 bg-slate-200 rounded-full" />
             <div className="flex items-center gap-2"><Sparkles size={12} className="text-primary-500" /> Priority Onboarding</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default CompleteProviderProfile;
