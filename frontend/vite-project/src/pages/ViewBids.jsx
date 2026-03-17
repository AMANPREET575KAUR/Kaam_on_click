import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import {
  DollarSign, MessageSquare, UserCheck, Briefcase, MapPin,
  Star, Award, Loader2, Eye, EyeOff, CheckCircle2, X, Calendar,
  ArrowRight, ShieldCheck, Clock, User, Phone, Mail, ChevronRight,
  Sparkles, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ViewBids() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingBid, setSelectingBid] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Profile modal
  const [profileModal, setProfileModal] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Review modal
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchMyJobs = async () => {
    const query = `{
      myJobs {
        id serviceType description city state budgetMin budgetMax date status assignedTo
        assignedProvider {
          id name email phone state isPublic language
          profile { services experienceYears description city rating totalReviews profilePicture }
        }
        review { id rating comment }
        createdAt
      }
    }`;

    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setJobs(res.data.data.myJobs);
    } catch (error) { console.log(error); } finally { setJobsLoading(false); }
  };

  useEffect(() => { fetchMyJobs(); }, []);

  const fetchBids = async (jobId) => {
    setSelectedJob(jobId);
    setIsLoading(true);
    const query = `{
      bids(jobId: ${jobId}) {
        id jobId bidPrice message status
        provider {
          id name email phone state isPublic language
          profile { services experienceYears description city rating totalReviews profilePicture }
        }
      }
    }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setBids(res.data.data.bids);
    } catch (error) { console.log(error); setBids([]); } finally { setIsLoading(false); }
  };

  const selectBid = async (bidId) => {
    setSelectingBid(bidId);
    const query = `mutation { selectBid(bidId: ${bidId}) { id } }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      if (res.data.errors) { alert(res.data.errors[0].message); return; }
      fetchMyJobs();
      setBids([]);
      setSelectedJob(null);
    } catch (error) { alert(error.response?.data?.errors?.[0]?.message || "Failed to select provider."); } finally { setSelectingBid(null); }
  };

  const viewProfile = async (providerId) => {
    setProfileLoading(true);
    setProfileError("");
    const query = `{
      providerProfile(userId: ${providerId}) {
        id name email phone state isPublic language
        profile { services experienceYears description city rating totalReviews profilePicture }
      }
    }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      if (res.data.errors) { setProfileError(res.data.errors[0].message); setProfileModal({ private: true }); }
      else { setProfileModal(res.data.data.providerProfile); }
    } catch (error) {
      const msg = error.response?.data?.errors?.[0]?.message || "Failed to load profile";
      setProfileModal({ private: true, errorMsg: msg });
    } finally { setProfileLoading(false); }
  };

  const markJobCompleted = async () => {
    if (reviewRating < 1 || reviewRating > 5) { alert("Please give a rating between 1 and 5 stars"); return; }
    setReviewLoading(true);
    const query = `mutation {
      markJobCompleted(jobId: ${reviewModal.id}, rating: ${reviewRating}, comment: "${reviewComment.replace(/"/g, '\\"')}") { id status }
    }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      if (res.data.errors) { alert(res.data.errors[0].message); return; }
      setReviewModal(null); setReviewRating(0); setReviewComment(""); fetchMyJobs();
    } catch (error) { alert(error.response?.data?.errors?.[0]?.message || "Failed to complete job."); } finally { setReviewLoading(false); }
  };

  const currentJob = jobs.find((j) => j.id === selectedJob);
  const openJobs = jobs.filter((j) => j.status === "OPEN");
  const assignedJobs = jobs.filter((j) => j.status === "ASSIGNED" || j.status === "IN_PROGRESS");
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");

  const getStatusBadge = (status) => {
    const styles = {
      OPEN: "bg-emerald-50 text-emerald-600 border-emerald-100",
      ASSIGNED: "bg-primary-50 text-primary-600 border-primary-100",
      COMPLETED: "bg-slate-100 text-slate-500 border-slate-200",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (jobsLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles size={14} />
              <span>Project Lifecycle Tracking</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Your Bookings</h1>
            <p className="text-slate-500 font-medium mt-1">Review proposals, track progress, and finalize completed projects.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Scrollable Job Sidebar */}
          <div className="lg:col-span-5 space-y-8 h-fit lg:sticky lg:top-24">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-premium">
                <Briefcase className="mx-auto mb-6 text-slate-200" size={48} strokeWidth={1} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No active projects</h3>
                <p className="text-slate-500 text-sm mb-6">Create your first job request to start receiving bids.</p>
                <button className="bg-slate-950 text-white px-6 py-3 rounded-xl font-bold text-sm">Post a Job</button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Active Section */}
                {openJobs.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
                      Accepting Bids <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    </h2>
                    <div className="grid gap-4">
                      {openJobs.map((job) => (
                        <JobItem key={job.id} job={job} isActive={selectedJob === job.id} onClick={() => fetchBids(job.id)} getStatusBadge={getStatusBadge} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned Section */}
                {assignedJobs.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">In Progress</h2>
                    <div className="grid gap-4">
                      {assignedJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-premium relative group">
                          <div className="flex items-center justify-between mb-4">
                             <span className="px-3 py-1 bg-primary-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{job.serviceType}</span>
                             <div className="flex items-center gap-1.5 text-[10px] font-black text-primary-600 uppercase tracking-widest">
                                <Clock size={12} strokeWidth={3} /> Active
                             </div>
                          </div>
                          <h4 className="font-black text-slate-900 mb-4 leading-tight">{job.description}</h4>
                          
                          {job.assignedProvider && (
                            <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex items-center gap-4 border border-slate-100">
                               <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-white font-black text-xl shadow-lg overflow-hidden">
                                  {job.assignedProvider.profile?.profilePicture ? (
                                    <img src={job.assignedProvider.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    job.assignedProvider.name?.charAt(0)
                                  )}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="font-bold text-slate-900 text-sm truncate">{job.assignedProvider.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{job.assignedProvider.phone}</p>
                               </div>
                               <button onClick={() => viewProfile(job.assignedProvider.id)} className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-primary-500 hover:shadow-sm transition-all">
                                  <User size={18} />
                               </button>
                            </div>
                          )}

                          <button
                            onClick={() => setReviewModal(job)}
                            className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group"
                          >
                            <CheckCircle2 size={16} /> Mark Completed
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History Section */}
                {completedJobs.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 text-right">Completed</h2>
                    <div className="grid gap-4 opacity-70 hover:opacity-100 transition-opacity">
                      {completedJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm grayscale hover:grayscale-0 transition-all">
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.serviceType}</span>
                             <CheckCircle2 size={14} className="text-emerald-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 leading-tight mb-4">{job.description}</p>
                          {job.review && (
                             <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={10} fill={i < job.review.rating ? "currentColor" : "none"} className={i < job.review.rating ? "text-amber-400" : "text-slate-200"} />
                                ))}
                             </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Proposal List Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!selectedJob ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center h-[600px] flex flex-col items-center justify-center shadow-premium"
                >
                  <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mb-8 text-primary-300">
                     <TrendingUp size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Select a project to explore</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Tap on an active job on the left to review incoming candidate proposals and profiles.</p>
                </motion.div>
              ) : (
                <motion.div 
                   key={selectedJob}
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                >
                  <div className="bg-slate-950 rounded-[2rem] p-8 text-white mb-10 shadow-xl relative overflow-hidden">
                     <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary-600/20 blur-[80px] rounded-full" />
                     <h2 className="text-2xl font-black mb-2 tracking-tight">Proposals for {currentJob?.serviceType}</h2>
                     <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span>{bids.length} Offers Received</span>
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span>Budget Cap: ₹{currentJob?.budgetMax}</span>
                     </div>
                  </div>

                  {isLoading ? (
                    <div className="h-64 flex flex-col items-center justify-center">
                       <Loader2 className="animate-spin text-primary-500" size={32} />
                    </div>
                  ) : bids.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-premium">
                       <MessageSquare size={48} className="mx-auto mb-6 text-slate-100" />
                       <h3 className="text-xl font-black text-slate-900">Waiting for providers</h3>
                       <p className="text-slate-500 font-medium">Bids usually arrive within 24 hours of posting.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {bids.map((bid) => (
                        <motion.div 
                          layout
                          key={bid.id} 
                          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden group hover:border-primary-100 transition-all duration-500"
                        >
                          <div className="p-8">
                             <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Provider Info Card */}
                                <div className="w-full md:w-56 shrink-0 space-y-4">
                                   <div className="flex items-center gap-4">
                                      <div className="w-16 h-16 rounded-[1.25rem] bg-slate-950 flex items-center justify-center text-white font-black text-2xl shadow-lg relative overflow-hidden">
                                         {bid.provider.profile?.profilePicture ? (
                                           <img src={bid.provider.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                                         ) : (
                                           <>
                                             {bid.provider.name.charAt(0)}
                                             <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent" />
                                           </>
                                         )}
                                      </div>
                                      <div>
                                         <h4 className="font-black text-slate-900 text-lg leading-none mb-1">{bid.provider.name}</h4>
                                         <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-xs font-black">{bid.provider.profile?.rating || "New"}</span>
                                         </div>
                                      </div>
                                   </div>
                                   <div className="space-y-2 pt-2">
                                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                         <MapPin size={12} /> {bid.provider.profile?.city || bid.provider.state}
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                         <ShieldCheck size={12} className="text-emerald-500" /> Verified Expert
                                      </div>
                                   </div>
                                   <button 
                                      onClick={() => viewProfile(bid.provider.id)}
                                      className="w-full py-3 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                   >
                                      <User size={14} /> Full Portfolio
                                   </button>
                                </div>

                                {/* Proposal Content */}
                                <div className="flex-1 flex flex-col">
                                   <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-50">
                                      <div className="flex flex-col">
                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proposal Quote</span>
                                         <span className="text-4xl font-black text-slate-950 tracking-tighter">₹{bid.bidPrice}</span>
                                      </div>
                                      {bid.status === "PENDING" && (
                                         <button
                                           onClick={() => selectBid(bid.id)}
                                           disabled={selectingBid === bid.id}
                                           className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20 transition-all transform hover:scale-[1.02] flex items-center gap-2"
                                         >
                                            {selectingBid === bid.id ? <Loader2 className="animate-spin" size={16} /> : <UserCheck size={16} strokeWidth={3} />}
                                            Accept Quote
                                         </button>
                                      )}
                                      {bid.status !== "PENDING" && (
                                         <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(bid.status)}`}>
                                            {bid.status}
                                         </span>
                                      )}
                                   </div>
                                   
                                   <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                         <MessageSquare size={12} /> Provider Note
                                      </div>
                                      <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                                         "{bid.message}"
                                      </p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {profileModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setProfileModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                 onClick={() => setProfileModal(null)}
                 className="absolute top-6 right-6 p-3 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 transition-all z-10"
              >
                 <X size={20} />
              </button>

              {profileModal.private ? (
                 <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                       <EyeOff size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Portfolio Locked</h3>
                    <p className="text-slate-500 font-medium">This professional has restricted access to their full profile details.</p>
                 </div>
              ) : (
                <div className="flex flex-col">
                   <div className="bg-slate-950 p-10 text-white relative flex flex-col items-center">
                      <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-primary-600/30 blur-[80px] rounded-full" />
                     <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center text-slate-950 font-black text-4xl mb-6 shadow-xl relative z-10 overflow-hidden">
                       {profileModal.profile?.profilePicture ? (
                        <img src={profileModal.profile.profilePicture} alt="" className="w-full h-full object-cover" />
                       ) : (
                        profileModal.name?.charAt(0)
                       )}
                     </div>
                      <h3 className="text-2xl font-black relative z-10">{profileModal.name}</h3>
                      <div className="flex items-center gap-2 text-primary-400 font-black text-xs uppercase tracking-widest mt-2 relative z-10">
                         <Star size={14} fill="currentColor" /> {profileModal.profile?.rating || "Verified Specialist"}
                      </div>
                   </div>
                   <div className="p-10 space-y-8">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Experience</p>
                            <p className="text-lg font-black text-slate-900">{profileModal.profile?.experienceYears}+ Years</p>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Reputation</p>
                            <p className="text-lg font-black text-slate-900">{profileModal.profile?.totalReviews || 0} Reviews</p>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                               <div className="p-2 bg-slate-50 rounded-lg"><Phone size={14} /></div> {profileModal.phone}
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm font-bold">
                               <div className="p-2 bg-slate-50 rounded-lg"><Mail size={14} /></div> {profileModal.email}
                            </div>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">About Specialist</p>
                         <p className="text-slate-600 text-sm font-medium leading-relaxed italic line-clamp-4">
                            "{profileModal.profile?.description || 'No description provided by professional.'}"
                         </p>
                      </div>
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setReviewModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-md p-10 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-10 text-center">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} strokeWidth={2.5} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-950 tracking-tight">Project Complete</h3>
                 <p className="text-slate-500 font-medium mt-1">Rate the service provided by the professional.</p>
              </div>

              <div className="space-y-8">
                 <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <button
                           key={star}
                           onClick={() => setReviewRating(star)}
                           className="transition-transform active:scale-90"
                         >
                           <Star
                             size={44}
                             fill={star <= reviewRating ? "currentColor" : "none"}
                             className={star <= reviewRating ? "text-amber-400 drop-shadow-lg" : "text-slate-100"}
                           />
                         </button>
                       ))}
                    </div>
                    {reviewRating > 0 && <span className="mt-4 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Perfect Choice!</span>}
                 </div>

                 <textarea
                   value={reviewComment}
                   onChange={(e) => setReviewComment(e.target.value)}
                   placeholder="Briefly describe your experience..."
                   rows={4}
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all resize-none shadow-inner"
                 />

                 <button
                   onClick={markJobCompleted}
                   disabled={reviewLoading || reviewRating === 0}
                   className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
                 >
                   {reviewLoading ? <Loader2 className="animate-spin" size={20} /> : "Finalize & Pay Pro"}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function JobItem({ job, isActive, onClick, getStatusBadge }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-3xl border p-6 cursor-pointer transition-all duration-500 relative overflow-hidden flex flex-col ${
        isActive ? "border-primary-500 shadow-xl shadow-primary-500/10 ring-1 ring-primary-500" : "border-slate-100 shadow-premium hover:border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {getStatusBadge(job.status)}
        <ChevronRight size={18} className={`transition-transform duration-500 ${isActive ? "rotate-90 text-primary-500" : "text-slate-300"}`} />
      </div>
      <h4 className={`font-black tracking-tight leading-tight mb-4 ${isActive ? "text-primary-600" : "text-slate-900"}`}>{job.serviceType} Support</h4>
      <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-6">
        {job.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">EST. BUDGET</span>
            <span className="text-sm font-black text-slate-900 leading-none">₹{job.budgetMin}-{job.budgetMax}</span>
         </div>
         {job.date && (
            <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 text-[10px] font-black text-slate-400 uppercase">
               {new Date(job.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </div>
         )}
      </div>
      {isActive && (
         <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-primary-500/5 blur-[20px] rounded-full" />
      )}
    </motion.div>
  );
}

export default ViewBids;
