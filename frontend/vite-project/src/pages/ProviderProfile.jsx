import { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { User, Briefcase, MapPin, Star, Award, Edit2, MessageSquare, ShieldCheck, Sparkles, Loader2, Phone, Mail, CheckCircle2, X, Check, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UploadOptionsModal from "../components/UploadOptionsModal";
import CameraCapture from "../components/CameraCapture";


function ProviderProfile() {
   const [profile, setProfile] = useState(null);
   const [reviews, setReviews] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isEditing, setIsEditing] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [formData, setFormData] = useState({ name: "", phone: "", state: "", city: "", services: "", experienceYears: 0, description: "", profilePicture: "" });
   const fileInputRef = useRef(null);

   const [isOptionsOpen, setIsOptionsOpen] = useState(false);
   const [isCameraOpen, setIsCameraOpen] = useState(false);


   const formatReviewDate = (createdAt) => {
      if (!createdAt) return "";
      const date = new Date(createdAt);
      return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString();
   };

   const fetchProfile = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
         console.warn("Missing userId or token for provider profile");
         setIsLoading(false);
         setProfile(null);
         setErrorMessage("You must be logged in as a provider to view this profile.");
         return;
      }
    const query = `{
         providerProfile(userId: ${userId}) {
            id name email phone state
            profile { services experienceYears description city rating totalReviews profilePicture }
         }
      providerReviews(providerId: ${userId}) { id rating comment jobServiceType createdAt }
    }`;
      try {
         const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });

         if (res.data?.errors?.length) {
            const msg = res.data.errors[0]?.message || "Unable to load provider profile.";
            console.error("GraphQL providerProfile error:", msg);
            setErrorMessage(msg);
            setProfile(null);
            setReviews([]);
            return;
         }

         const providerProfile = res.data?.data?.providerProfile || null;
         const providerReviews = res.data?.data?.providerReviews || [];

         if (!providerProfile) {
            console.warn("Provider profile not found in response");
            setErrorMessage("Provider profile not found. Make sure you are logged in as a provider and have completed your profile.");
            setProfile(null);
            setReviews([]);
            return;
         }

         setProfile(providerProfile);
         setReviews(providerReviews);

         setFormData({
            name: providerProfile.name,
            phone: providerProfile.phone,
            state: providerProfile.state,
            city: providerProfile.profile?.city || "",
            services: providerProfile.profile?.services || "",
            experienceYears: providerProfile.profile?.experienceYears || 0,
            description: providerProfile.profile?.description || "",
            profilePicture: providerProfile.profile?.profilePicture || "",
         });
      } catch (error) {
         const msg = error.response?.data?.errors?.[0]?.message || error.message || "Unable to load provider profile.";
         console.error("Error fetching provider profile:", msg);
         setErrorMessage(msg);
         setProfile(null);
         setReviews([]);
      } finally {
         setIsLoading(false);
      }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "experienceYears" ? parseInt(value) : value });
  };

   const handleSaveChanges = async () => {
      const token = localStorage.getItem("token");
      const query = `mutation {
         updateProviderProfile(
            name:"${formData.name}", phone:"${formData.phone}", state:"${formData.state}", city:"${formData.city}",
            services:"${formData.services}", experienceYears:${formData.experienceYears}, description:"${formData.description.replace(/"/g, '\\"')}",
            profilePicture:"${formData.profilePicture || ""}"
         ){ id name phone state }
      }`;
      try {
         await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
         setProfile({
            ...profile,
            name: formData.name,
            phone: formData.phone,
            state: formData.state,
            profile: {
               ...profile.profile,
               city: formData.city,
               services: formData.services,
               experienceYears: formData.experienceYears,
               description: formData.description,
               profilePicture: formData.profilePicture || profile.profile?.profilePicture,
            }
         });
         setIsEditing(false);
      } catch (error) { alert("Failed to update profile."); }
   };

   const handleCameraCapture = (dataUrl) => {
      setFormData((prev) => ({ ...prev, profilePicture: dataUrl }));
   };


  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Building Portfolio...</p>
        </div>
      </DashboardLayout>
    );
  }

   if (!profile) {
      return (
         <DashboardLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-3">
               <p className="text-slate-900 font-bold text-lg">Provider profile not available</p>
               <p className="text-slate-500 text-sm max-w-md text-center">
                  {errorMessage || "This can happen if your profile is not completed yet or if there was a problem loading it. Try completing your profile first and then refresh this page."}
               </p>
            </div>
         </DashboardLayout>
      );
   }

   const services = profile.profile?.services?.split(",") || [];

  return (
    <DashboardLayout>
      <UploadOptionsModal 
        isOpen={isOptionsOpen} 
        onClose={() => setIsOptionsOpen(false)} 
        onTakePhoto={() => setIsCameraOpen(true)}
        onChooseFromDevice={() => fileInputRef.current?.click()}
      />

      <CameraCapture 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={handleCameraCapture}
      />
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
              <ShieldCheck size={14} />
              <span>Certified Professional Partner</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Professional Dossier</h1>
            <p className="text-slate-500 font-medium mt-1">Showcase your elite skills, track reputation metrics, and manage business details.</p>
          </div>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-8 py-3.5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-2xl shadow-slate-200"
            >
              <Edit2 size={16} strokeWidth={3} /> Refine Portfolio
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Metrics & Identity */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden transition-all duration-500">
               <div className="bg-slate-950 p-10 flex flex-col items-center relative">
                  <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full" />
                  <div className="w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center overflow-hidden mb-6 shadow-2xl relative z-10 border-4 border-white/20">
                     {profile.profile?.profilePicture ? (
                        <img src={profile.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-slate-950 font-black text-4xl">{profile.name.charAt(0)}</span>
                     )}
                  </div>
                  <h3 className="text-2xl font-black text-white relative z-10 tracking-tight text-center">{profile.name}</h3>
                  <div className="flex items-center gap-2 text-primary-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2 relative z-10">
                     <Star size={14} fill="currentColor" /> {profile.profile?.rating || "New Specialist"}
                  </div>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Points</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{profile.profile?.experienceYears}+ Yrs</p>
                     </div>
                     <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reviews</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{reviews.length}</p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                           <CheckCircle2 size={12} strokeWidth={3} /> Active Now
                        </span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 w-[85%] rounded-full shadow-lg shadow-primary-500/20" />
                     </div>
                  </div>
               </div>
            </div>

          </div>

          {/* Right Column: Information & Reviews */}
          <div className="lg:col-span-8">
             <AnimatePresence mode="wait">
                {isEditing ? (
                           <motion.div 
                              key="edit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                              className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-14 shadow-premium space-y-10"
                           >
                               {/* Avatar + Photo Upload */}
                               <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                       {formData.profilePicture ? (
                                          <img src={formData.profilePicture} alt="" className="w-full h-full object-cover" />
                                       ) : (
                                          <span className="text-slate-500 font-black text-2xl">
                                             {profile.name.charAt(0)}
                                          </span>
                                       )}
                                    </div>
                                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer">
                                       <Camera size={14} />
                                       <span>Update Portrait</span>
                                       <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                             const file = e.target.files?.[0];
                                             if (!file) return;
                                             if (file.size > 5 * 1024 * 1024) {
                                                alert("Image must be less than 5MB");
                                                return;
                                             }
                                             const reader = new FileReader();
                                             reader.onloadend = () => {
                                                setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
                                             };
                                             reader.readAsDataURL(file);
                                          }}
                                       />
                                    </label>
                               </div>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name <span className="text-red-500 ml-0.5">*</span></label>
                           <input
                             type="text" name="name" value={formData.name} onChange={handleInputChange}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone <span className="text-red-500 ml-0.5">*</span></label>
                           <input
                             type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service City <span className="text-red-500 ml-0.5">*</span></label>
                           <input
                             type="text" name="city" value={formData.city} onChange={handleInputChange}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills (Comma Sep) <span className="text-red-500 ml-0.5">*</span></label>
                           <input
                             type="text" name="services" value={formData.services} onChange={handleInputChange}
                             className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner"
                           />
                                     </div>
                                     <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operating State <span className="text-red-500 ml-0.5">*</span></label>
                                          <input
                                             type="text" name="state" value={formData.state} onChange={handleInputChange}
                                             className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner"
                                          />
                                     </div>
                                     <div className="space-y-2">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Years <span className="text-red-500 ml-0.5">*</span></label>
                                          <input
                                             type="number" min="0" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange}
                                             className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-inner"
                                          />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Narrative Bio</label>
                        <textarea
                          name="description" value={formData.description} onChange={handleInputChange}
                          rows={4} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none shadow-inner"
                        />
                     </div>
                     <div className="flex gap-4 pt-4">
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 transition-all">Discard</button>
                        <button onClick={handleSaveChanges} className="flex-1 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 transition-all transform hover:scale-[1.01]">Commit Updates</button>
                     </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                     {/* Essential Info Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                           { icon: Phone, label: "Business Line", value: profile.phone },
                           { icon: Mail, label: "Official Email", value: profile.email },
                           { icon: MapPin, label: "Trade Territory", value: `${profile.profile?.city}, ${profile.state}` },
                           { icon: Award, label: "Experience Tier", value: `${profile.profile?.experienceYears}+ Pro Years` }
                        ].map((item, idx) => (
                           <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium flex items-start gap-6 group hover:border-primary-100 transition-all">
                              <div className="p-4 bg-slate-50 text-slate-400 rounded-3xl group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                 <item.icon size={24} strokeWidth={1.5} />
                              </div>
                              <div>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{item.label}</span>
                                 <p className="text-xl font-bold text-slate-900 tracking-tight">{item.value}</p>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Services & Bio */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-premium">
                           <div className="flex items-center gap-2 mb-6">
                              <Briefcase size={16} className="text-primary-500" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Services</span>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {services.map((s, idx) => (
                                 <span key={idx} className="px-3 py-1.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                                    {s.trim()}
                                 </span>
                              ))}
                           </div>
                        </div>
                        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-premium relative overflow-hidden">
                           <div className="flex items-center gap-2 mb-6">
                              <Sparkles size={16} className="text-primary-500" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Professional</span>
                           </div>
                           <p className="text-slate-600 text-sm font-medium leading-relaxed italic relative z-10">
                              "{profile.profile?.description || 'No business narrative provided.'}"
                           </p>
                           <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-slate-50 blur-3xl rounded-full" />
                        </div>
                     </div>

                     {/* Reviews Section */}
                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2">
                             <MessageSquare size={20} className="text-slate-900" />
                             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Public Feedback ({reviews.length})</h3>
                          </div>
                       </div>
                       
                       {reviews.length === 0 ? (
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] p-16 text-center">
                             <Star size={40} className="mx-auto mb-4 text-slate-200" />
                             <p className="text-slate-500 font-bold text-sm">No verification reviews yet. Complete your first job to build reputation.</p>
                          </div>
                       ) : (
                          <div className="grid grid-cols-1 gap-4">
                             {reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-premium group hover:border-primary-100 transition-all flex flex-col md:flex-row gap-6 md:items-center">
                                   <div className="shrink-0 flex flex-col items-center gap-2 px-6 py-4 bg-slate-50 rounded-2xl group-hover:bg-primary-50 transition-colors">
                                      <div className="flex items-center gap-0.5">
                                         {[1, 2, 3, 4, 5].map((s) => (
                                           <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} className={s <= review.rating ? "text-amber-400" : "text-slate-200"} />
                                         ))}
                                      </div>
                                      <span className="text-[10px] font-black text-slate-900">{review.rating}.0 / 5.0</span>
                                   </div>
                                   <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                         <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-widest">{review.jobServiceType}</span>
                                         <span className="text-[10px] font-bold text-slate-300 uppercase">{formatReviewDate(review.createdAt)}</span>
                                      </div>
                                      <p className="text-sm font-medium text-slate-600 italic">"{review.comment}"</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
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

export default ProviderProfile;
