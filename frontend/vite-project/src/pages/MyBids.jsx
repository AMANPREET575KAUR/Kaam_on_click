import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { DollarSign, MapPin, Briefcase, Clock, CheckCircle, XCircle, Loader2, Star, Sparkles, Filter, ChevronRight, Gavel, Calendar, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    const token = localStorage.getItem("token");
    const query = `{
      myBids {
        id jobId bidPrice message status
        job { id serviceType description city state budgetMin budgetMax status review { rating comment } }
      }
    }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setBids(res.data.data.myBids);
    } catch (error) { console.log(error); } finally { setLoading(false); }
  };

  const filteredBids = filter === "ALL"
    ? bids
    : filter === "COMPLETED"
      ? bids.filter(b => b.job?.status === "COMPLETED")
      : bids.filter(b => b.status === filter);

  const statusConfig = {
    PENDING: { label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-50 stroke-amber-500 border-amber-100" },
    ACCEPTED: { label: "Accepted", icon: CheckCircle, color: "text-emerald-500 bg-emerald-50 stroke-emerald-500 border-emerald-100" },
    REJECTED: { label: "Rejected", icon: XCircle, color: "text-red-500 bg-red-50 stroke-red-500 border-red-100" },
  };

  const counts = {
    ALL: bids.length,
    PENDING: bids.filter(b => b.status === "PENDING").length,
    ACCEPTED: bids.filter(b => b.status === "ACCEPTED").length,
    REJECTED: bids.filter(b => b.status === "REJECTED").length,
    COMPLETED: bids.filter(b => b.job?.status === "COMPLETED").length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Consulting My Bids...</p>
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
              <span>Bid Strategy Tracker</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Outcome Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Track your proposals, manage active project cycles, and review your earnings history.</p>
          </div>
        </div>

        {/* Actionable Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {[
            { key: "ALL", label: "Global", value: counts.ALL, icon: Gavel, color: "bg-slate-950 text-white shadow-slate-200" },
            { key: "PENDING", label: "Waiting", value: counts.PENDING, icon: Clock, color: "bg-white text-amber-500 border-slate-100" },
            { key: "ACCEPTED", label: "Won", value: counts.ACCEPTED, icon: TrendingUp, color: "bg-white text-emerald-500 border-slate-100" },
            { key: "REJECTED", label: "Passed", value: counts.REJECTED, icon: XCircle, color: "bg-white text-red-500 border-slate-100" },
            { key: "COMPLETED", label: "Archive", value: counts.COMPLETED, icon: ShieldCheck, color: "bg-white text-primary-500 border-slate-100" },
          ].map(({ key, label, value, icon: Icon, color }) => (
            <button
               key={key}
               onClick={() => setFilter(key)}
               className={`relative overflow-hidden group p-6 rounded-[2rem] border transition-all duration-500 text-left ${
                  filter === key ? `${color} shadow-xl scale-[1.02] border-transparent` : "bg-white/50 border-slate-100 grayscale hover:grayscale-0 hover:bg-white"
               }`}
            >
               <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className={`p-2 rounded-xl w-fit mb-4 ${filter === key ? 'bg-white/10' : 'bg-slate-50'}`}>
                     <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${filter === key ? 'text-white/60' : 'text-slate-400'}`}>{label}</span>
                    <span className="text-3xl font-black tracking-tighter">{value}</span>
                  </div>
               </div>
               {filter === key && (
                  <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-white/5 blur-2xl rounded-full" />
               )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
           {filteredBids.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-premium flex flex-col items-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 text-slate-100">
                    <Filter size={48} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Clear as Day</h3>
                 <p className="text-slate-500 font-medium max-w-sm">No bids match your current filter. Try broadening your gaze or browsing the latest job feed.</p>
                 <button className="mt-10 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Explore Marketplace</button>
              </div>
           ) : (
              <div className="grid grid-cols-1 gap-6">
                 {filteredBids.map((bid) => {
                    const config = statusConfig[bid.status] || statusConfig.PENDING;
                    const StatusIcon = config.icon;
                    const isCompleted = bid.job?.status === "COMPLETED";

                    return (
                       <motion.div 
                          layout
                          key={bid.id}
                          className={`bg-white rounded-[2.5rem] border overflow-hidden p-8 transition-all duration-500 flex flex-col md:flex-row gap-8 relative items-center ${
                             isCompleted ? "border-primary-100 shadow-sm opacity-90" : "border-slate-100 shadow-premium hover:border-slate-200"
                          }`}
                       >
                          {/* Left: Job Summary */}
                          <div className="flex-1 space-y-4">
                             <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-slate-950 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                   {bid.job?.serviceType}
                                </span>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${config.color}`}>
                                   <StatusIcon size={12} strokeWidth={3} /> {config.label}
                                </span>
                                {isCompleted && (
                                   <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                      <CheckCircle size={12} strokeWidth={3} /> COMPLETED
                                   </span>
                                )}
                             </div>
                             <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight line-clamp-2">
                                {bid.job?.description}
                             </h3>
                             <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {bid.job?.city}, {bid.job?.state}</span>
                                <span className="flex items-center gap-1.5 py-1 px-3 bg-slate-50 rounded-lg"><Calendar size={14} /> Active Period</span>
                             </div>
                          </div>

                          {/* Middle: Bid Value */}
                          <div className="md:w-px h-12 bg-slate-100 hidden md:block" />

                          <div className="w-full md:w-fit flex flex-col items-center md:items-end shrink-0">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Your Proposed Quote</span>
                             <span className="text-4xl font-black text-slate-950 tracking-tighter">₹{bid.bidPrice}</span>
                             <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-400 uppercase">
                                Range: ₹{bid.job?.budgetMin}-₹{bid.job?.budgetMax}
                             </div>
                          </div>

                          {/* Right: Review/Outcome */}
                          <div className="w-full md:w-64 shrink-0">
                             {isCompleted && bid.job?.review ? (
                                <div className="bg-primary-50 rounded-3xl p-5 border border-primary-100 flex flex-col items-center text-center">
                                   <div className="flex items-center gap-1 mb-2">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={14} fill={s <= bid.job.review.rating ? "currentColor" : "none"} className={s <= bid.job.review.rating ? "text-amber-500" : "text-slate-200"} />
                                      ))}
                                   </div>
                                   <p className="text-[10px] font-bold text-primary-600 uppercase mb-2">Service Excellence Reward</p>
                                   <p className="text-xs font-medium text-slate-600 line-clamp-3 italic">"{bid.job.review.comment}"</p>
                                </div>
                             ) : (
                                <div className="h-full flex flex-col justify-center gap-3">
                                   <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proposal Message</p>
                                      <p className="text-xs font-medium text-slate-600 line-clamp-2 italic">"{bid.message}"</p>
                                   </div>
                                   <button className="w-full flex items-center justify-center gap-2 group text-[10px] font-black uppercase text-slate-400 hover:text-primary-500 transition-colors">
                                      View Original Job Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                   </button>
                                </div>
                             )}
                          </div>
                       </motion.div>
                    );
                 })}
              </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MyBids;
