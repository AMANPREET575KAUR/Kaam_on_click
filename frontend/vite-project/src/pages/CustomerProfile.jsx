import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { User, Mail, Phone, MapPin, Briefcase, Camera, Edit3, X, Check, ShieldCheck, Sparkles, Loader2, Globe, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", state: "" });

  const fetchProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const query = `{
      customerProfile(userId: ${userId}) { id name email phone state role }
    }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setProfile(res.data.data.customerProfile);
      setFormData(res.data.data.customerProfile);
    } catch (error) { console.log(error); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    const query = `mutation {
      updateCustomerProfile(name:"${formData.name}", phone:"${formData.phone}", state:"${formData.state}") { id name email phone state }
    }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setProfile(res.data.data.updateCustomerProfile);
      setIsEditing(false);
    } catch (error) { alert("Failed to update profile."); }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Syncing Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
              <ShieldCheck size={14} />
              <span>Identity Verified Account</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your personal identity, contact preferences, and service locations.</p>
          </div>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-8 py-3.5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-2xl shadow-slate-200"
            >
              <Edit3 size={16} strokeWidth={3} /> Modify Identity
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Panel: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden transition-all duration-500">
               <div className="bg-slate-950 p-10 flex flex-col items-center relative">
                  <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full" />
                  <div className="w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center text-slate-950 font-black text-4xl mb-6 shadow-2xl relative z-10 border-4 border-white/20">
                     {profile.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-black text-white relative z-10 tracking-tight">{profile.name}</h3>
                  <p className="text-primary-300 font-black text-[10px] uppercase tracking-[0.2em] mt-2 relative z-10">Registered Customer</p>
               </div>
               
               <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
                     <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        <Check size={14} strokeWidth={3} /> Active
                     </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Level</span>
                     <span className="flex items-center gap-1.5 text-[10px] font-black text-primary-500 uppercase tracking-widest">
                        <Sparkles size={14} strokeWidth={3} /> Elite
                     </span>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                   <Shield size={20} className="text-indigo-200" />
                   Security Portal
                </h3>
                <p className="text-indigo-100 text-xs font-medium leading-relaxed mb-6">
                   Your biometric and identity data is protected by enterprise-grade 256-bit encryption.
                </p>
                <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-sm">Reset Security Key</button>
            </div>
          </div>

          {/* Right Panel: Information Details */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!isEditing ? (
                 <motion.div 
                    key="view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                 >
                    {[
                       { icon: User, label: "Full Legal Name", value: profile.name },
                       { icon: Mail, label: "Primary Email Address", value: profile.email, status: "Verified" },
                       { icon: Phone, label: "Contact Phone Number", value: profile.phone || "Not provided" },
                       { icon: MapPin, label: "Registered Territory", value: profile.state },
                    ].map((item, idx) => (
                       <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium flex items-start gap-6 group hover:border-primary-100 transition-all">
                          <div className="p-4 bg-slate-50 text-slate-400 rounded-3xl group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                             <item.icon size={24} strokeWidth={1.5} />
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                                {item.status && <span className="text-[8px] font-black bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded-full uppercase tracking-widest">Verified</span>}
                             </div>
                             <p className="text-xl font-bold text-slate-900 tracking-tight">{item.value}</p>
                          </div>
                       </div>
                    ))}
                    
                    <div className="md:col-span-2 bg-slate-100/50 border border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                       <Globe size={40} className="text-slate-300 mb-4" />
                       <h4 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Global Connectivity</h4>
                       <p className="text-slate-500 text-sm font-medium max-w-sm">Your profile is visible to 5,000+ top-tier service providers across the network.</p>
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                    key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-14 shadow-premium space-y-8"
                 >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Identity Name</label>
                          <input
                            type="text" name="name" value={formData.name} onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 shadow-inner"
                          />
                       </div>
                       <div className="space-y-2 opacity-60">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Identifier (Email)</label>
                          <input
                            type="email" value={formData.email} disabled
                            className="w-full px-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 cursor-not-allowed"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Backbone (Phone)</label>
                          <input
                            type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 shadow-inner"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Active Territory (State)</label>
                          <input
                            type="text" name="state" value={formData.state} onChange={handleInputChange}
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 shadow-inner"
                          />
                       </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-8">
                       <button
                         onClick={() => { setIsEditing(false); setFormData(profile); }}
                         className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all border border-slate-100 flex items-center justify-center gap-2"
                       >
                         <X size={16} strokeWidth={3} /> Discard Changes
                       </button>
                       <button
                         onClick={handleSaveChanges}
                         className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
                       >
                         <Check size={16} strokeWidth={3} /> Commit Identity Updates
                       </button>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CustomerProfile;
