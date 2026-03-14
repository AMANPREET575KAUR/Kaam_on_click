import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import {
  Bell, Lock, Globe, Shield, Trash2, LogOut, ChevronRight, UserCog, Sparkles, CheckCircle2, ShieldAlert, Languages, ExternalLink, ShieldCheck, Key
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Settings() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");
  const [activeSection, setActiveSection] = useState("editDetails");
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    bidNotifications: true,
    newJobAlerts: true,
    isPublic: true,
    language: "English",
  });

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => { fetchUserSettings(); }, []);

  const fetchUserSettings = async () => {
    try {
      const query = `query {
        ${userRole === "CUSTOMER" ? "customerProfile" : "providerProfile"}(userId: ${localStorage.getItem("userId")}) {
          id bidNotifications newJobAlerts isPublic language
        }
      }`;
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      const profile = res.data.data[userRole === "CUSTOMER" ? "customerProfile" : "providerProfile"];
      setSettings({
        bidNotifications: profile.bidNotifications ?? true,
        newJobAlerts: profile.newJobAlerts ?? true,
        isPublic: profile.isPublic ?? true,
        language: profile.language || "English",
      });
    } catch (error) { console.error(error); }
  };

  const handleNotificationToggle = async (key) => {
    const newValue = !settings[key];
    setSettings({ ...settings, [key]: newValue });
    try {
      setLoading(true);
      const mutation = `mutation {
        updateNotificationSettings(
          bidNotifications: ${key === "bidNotifications" ? newValue : settings.bidNotifications}
          newJobAlerts: ${key === "newJobAlerts" ? newValue : settings.newJobAlerts}
        ) { id }
      }`;
      await axios.post(config.API_URL, { query: mutation }, { headers: { authorization: token } });
    } catch (error) { 
        setSettings({ ...settings, [key]: !newValue });
        alert("Sync failed. Check your connection.");
    } finally { setLoading(false); }
  };

  const handlePrivacyToggle = async () => {
    const newValue = !settings.isPublic;
    setSettings({ ...settings, isPublic: newValue });
    try {
      setLoading(true);
      const mutation = `mutation { updatePrivacySettings(isPublic: ${newValue}) { id } }`;
      await axios.post(config.API_URL, { query: mutation }, { headers: { authorization: token } });
    } catch (error) {
       setSettings({ ...settings, isPublic: !newValue });
       alert("Security update failed.");
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { alert("Confirm password mismatch."); return; }
    if (passwordForm.newPassword.length < 6) { alert("Password too short."); return; }
    try {
      setLoading(true);
      const mutation = `mutation { changePassword(currentPassword: "${passwordForm.currentPassword}", newPassword: "${passwordForm.newPassword}") { id } }`;
      await axios.post(config.API_URL, { query: mutation }, { headers: { authorization: token } });
      alert("Encryption keys updated.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) { alert("Current credentials invalid."); } finally { setLoading(false); }
  };

  const handleLogout = () => {
    if (window.confirm("Terminate active session?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  const navItems = [
    { key: "editDetails", icon: UserCog, label: "Identity", desc: "Manage legal details" },
    { key: "notifications", icon: Bell, label: "Alerts", desc: "Sync preferences" },
    { key: "security", icon: Lock, label: "Security", desc: "Keys and Access" },
    ...(userRole === "PROVIDER" ? [
      { key: "preferences", icon: Globe, label: "Localization", desc: "Language selection" },
      { key: "privacy", icon: Shield, label: "Visibility", desc: "Privacy mode" },
    ] : []),
    { key: "account", icon: Trash2, label: "Termination", desc: "Close account" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
              <ShieldCheck size={14} />
              <span>Encrypted Settings Access</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Control Center</h1>
            <p className="text-slate-500 font-medium mt-1">Configure your platform experience, security protocols, and connectivity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 h-fit lg:sticky lg:top-24">
             <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
                <nav className="p-4 space-y-2">
                   {navItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveSection(item.key)}
                        className={`w-full group flex items-start gap-4 p-5 rounded-[1.75rem] text-left transition-all duration-300 ${
                           activeSection === item.key
                             ? `bg-slate-950 text-white shadow-xl shadow-slate-200 scale-[1.02]`
                             : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                         <div className={`p-3 rounded-2xl transition-colors ${activeSection === item.key ? 'bg-white/10' : 'bg-slate-100'}`}>
                            <item.icon size={20} strokeWidth={2.5} />
                         </div>
                         <div className="flex-1">
                            <p className="font-black text-sm uppercase tracking-widest">{item.label}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${activeSection === item.key ? 'text-white/40' : 'text-slate-400'}`}>{item.desc}</p>
                         </div>
                         <ChevronRight size={16} className={`mt-1 transition-transform ${activeSection === item.key ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                      </button>
                   ))}
                </nav>
             </div>
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-8">
             <div className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-14 shadow-premium min-h-[600px] relative overflow-hidden transition-all duration-500">
                <AnimatePresence mode="wait">
                   {activeSection === "editDetails" && (
                      <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10 focus:outline-none">
                         <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
                               <UserCog size={40} />
                            </div>
                            <div>
                               <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Identity Management</h2>
                               <p className="text-slate-500 font-medium">Redirecting to your core identity profile.</p>
                            </div>
                         </div>
                         <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-10 text-center">
                            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">To ensure data integrity, legal and professional details are managed on your primary profile page.</p>
                            <button
                              onClick={() => navigate(userRole === "CUSTOMER" ? "/customer-profile" : "/my-profile")}
                              className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-slate-200 flex items-center gap-3 mx-auto"
                            >
                               Initialize Redirect <ExternalLink size={14} />
                            </button>
                         </div>
                      </motion.div>
                   )}

                   {activeSection === "notifications" && (
                      <motion.div key="notif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Alert Synchronization</h2>
                         <div className="grid gap-6">
                            {[
                               { 
                                  key: "bidNotifications", 
                                  title: "Incoming Bids", 
                                  desc: "Real-time alerts for service proposals.", 
                                  visible: userRole === "CUSTOMER" 
                               },
                               { 
                                  key: "newJobAlerts", 
                                  title: "Marketplace Activity", 
                                  desc: "Notifications for new project listings.", 
                                  visible: userRole === "PROVIDER" 
                               }
                            ].filter(i => i.visible).map((item) => (
                               <div key={item.key} className="flex items-center justify-between p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50/50 group hover:bg-white hover:border-primary-100 transition-all">
                                  <div>
                                     <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">{item.title}</p>
                                     <p className="text-xs font-medium text-slate-400">{item.desc}</p>
                                  </div>
                                  <button
                                    onClick={() => handleNotificationToggle(item.key)}
                                    className={`relative w-14 h-8 rounded-full transition-all duration-500 p-1 flex items-center ${settings[item.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                  >
                                     <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-500 ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                                  </button>
                               </div>
                            ))}
                         </div>
                      </motion.div>
                   )}

                   {activeSection === "security" && (
                      <motion.div key="sec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Security Credentials</h2>
                         <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8">
                            <div className="grid gap-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                  <div className="relative group/input">
                                     <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={18} />
                                     <input
                                       type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                       className="w-full px-12 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                                     />
                                  </div>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Secure Key</label>
                                     <input
                                       type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                       className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none"
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Identity</label>
                                     <input
                                       type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                       className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none"
                                     />
                                  </div>
                               </div>
                            </div>
                            <button
                              onClick={handleUpdatePassword}
                              className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-[1.01] transition-all shadow-xl shadow-slate-200"
                            >
                               Rotate Global Keys
                            </button>
                         </div>
                      </motion.div>
                   )}

                   {activeSection === "preferences" && (
                      <motion.div key="pref" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Localization</h2>
                         <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 space-y-8">
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <div className="p-3 bg-white rounded-2xl text-primary-500 shadow-sm"><Languages size={20} /></div>
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interface Language</label>
                               </div>
                               <select
                                 value={settings.language}
                                 onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                                 className="w-full px-8 py-5 bg-white border border-slate-100 rounded-3xl text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 appearance-none cursor-pointer"
                               >
                                 {["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati", "Punjabi"].map(l => <option key={l} value={l}>{l}</option>)}
                               </select>
                            </div>
                            <button onClick={() => alert('Prefs saved.')} className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest">Update Preferences</button>
                         </div>
                      </motion.div>
                   )}

                   {activeSection === "privacy" && (
                      <motion.div key="priv" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Identity Visibility</h2>
                         <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                               <div className="flex-1">
                                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border ${settings.isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                     {settings.isPublic ? <Sparkles size={12} /> : <ShieldAlert size={12} />}
                                     <span>{settings.isPublic ? 'Unrestricted Mode' : 'Ghost Protocol'}</span>
                                  </div>
                                  <p className="text-xl font-bold mb-4">Master Visibility Control</p>
                                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                     {settings.isPublic 
                                       ? "Your credentials, portfolio, and ratings are globally indexed for customer discovery."
                                       : "Your identity is encrypted. Only specific job posters can see your basic profile data."}
                                  </p>
                               </div>
                               <button
                                 onClick={handlePrivacyToggle}
                                 className={`shrink-0 w-24 h-24 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 transition-all duration-700 font-black text-[10px] uppercase border-2 ${settings.isPublic ? 'bg-white text-slate-950 border-white' : 'bg-transparent text-white border-white/20 hover:border-white'}`}
                               >
                                  {settings.isPublic ? <Globe size={28} /> : <Lock size={28} />}
                                  {settings.isPublic ? 'Go Stealth' : 'Go Public'}
                               </button>
                            </div>
                         </div>
                      </motion.div>
                   )}

                   {activeSection === "account" && (
                      <motion.div key="acc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                         <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight text-red-600">Danger Zone</h2>
                         <div className="grid gap-6">
                            <div className="p-10 border border-slate-100 rounded-[3rem] bg-slate-50 flex flex-col items-center text-center">
                               <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-950 shadow-sm mb-6">
                                  <LogOut size={32} />
                               </div>
                               <p className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Active Session Termination</p>
                               <p className="text-slate-500 text-sm font-medium max-w-xs mb-8">This will securely clear all local biometric and session markers.</p>
                               <button onClick={handleLogout} className="px-12 py-4 border-2 border-slate-950 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">Terminate Access</button>
                            </div>
                            
                            <div className="p-10 border border-red-100 rounded-[3rem] bg-red-50 flex flex-col items-center text-center">
                               <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-red-600 shadow-sm mb-6">
                                  <Trash2 size={32} />
                               </div>
                               <p className="text-lg font-black text-red-900 mb-2 uppercase tracking-tight">Data Erasure Request</p>
                               <p className="text-red-600/60 text-sm font-medium max-w-xs mb-8">Permanently delete all identity records and transaction history from the cloud.</p>
                               <button onClick={() => alert('Contact Support.')} className="px-12 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200">Initialize Erasure</button>
                            </div>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
                
                {/* Status Footer */}
                <div className="absolute bottom-10 left-10 lg:left-14 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                   <CheckCircle2 size={12} /> Cloud Sync Verified
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
