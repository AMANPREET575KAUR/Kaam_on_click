import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { MapPin, DollarSign, Briefcase, Filter, CheckCircle, MessageSquare, XCircle, Calendar, Search, SlidersHorizontal, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [bidPrices, setBidPrices] = useState({});
  const [bidMessages, setBidMessages] = useState({});
  const [loadingBids, setLoadingBids] = useState({});
  const [selectedService, setSelectedService] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [bidIdMap, setBidIdMap] = useState({});
  const [cancellingBids, setCancellingBids] = useState({});

  const serviceTypes = ["All", "Plumbing", "Electrician", "Carpenter", "Cleaning", "Painting", "AC Repair"];

  const fetchMyBids = async () => {
    const token = localStorage.getItem("token");
    const query = `{ myBids { id jobId status } }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      const bids = res.data.data.myBids;
      const ids = new Set(bids.filter(b => b.status !== "CANCELLED").map(b => String(b.jobId)));
      const map = {};
      bids.filter(b => b.status !== "CANCELLED").forEach(b => { map[String(b.jobId)] = b.id; });
      setAppliedJobIds(ids);
      setBidIdMap(map);
    } catch (error) { console.log(error); }
  };

  const fetchJobs = async (serviceType = "") => {
    const token = localStorage.getItem("token");
    const serviceFilter = serviceType && serviceType !== "All" ? `serviceType: "${serviceType}"` : "";
    const query = `{ jobs${serviceFilter ? `(${serviceFilter})` : ''}{ id serviceType description city state budgetMin budgetMax date } }`;

    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setJobs(res.data.data.jobs);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { fetchMyBids(); }, []);
  useEffect(() => { fetchJobs(selectedService); }, [selectedService]);

  const placeBid = async (jobId) => {
    const price = bidPrices[jobId];
    const message = bidMessages[jobId] || "I can complete this job professionally.";
    const token = localStorage.getItem("token");
    if (!price) { alert("Enter bid price first"); return; }
    setLoadingBids({ ...loadingBids, [jobId]: true });
    const escapedMessage = message.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const query = `mutation { placeBid(jobId:${jobId}, bidPrice:${price}, message:"${escapedMessage}"){ id } }`;

    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      if (res.data.errors) { alert(res.data.errors[0].message); return; }
      setAppliedJobIds(prev => new Set([...prev, String(jobId)]));
      setBidIdMap(prev => ({ ...prev, [String(jobId)]: res.data.data.placeBid.id }));
    } catch (error) { console.log(error); } finally { setLoadingBids({ ...loadingBids, [jobId]: false }); }
  };

  const cancelBid = async (jobId) => {
    const bidId = bidIdMap[String(jobId)];
    if (!bidId) return;
    const token = localStorage.getItem("token");
    setCancellingBids(prev => ({ ...prev, [jobId]: true }));
    const query = `mutation { cancelBid(bidId: ${bidId}) { id } }`;
    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      if (res.data.errors) { alert(res.data.errors[0].message); return; }
      setAppliedJobIds(prev => { const next = new Set(prev); next.delete(String(jobId)); return next; });
    } catch (error) { console.log(error); } finally { setCancellingBids(prev => ({ ...prev, [jobId]: false })); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
             <div className="flex items-center gap-2 mb-3 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
                <Sparkles size={14} />
                <span>Market Insights: High Demand</span>
             </div>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Available Opportunities</h1>
             <p className="text-slate-500 font-medium mt-1">Discover jobs that match your expertise and grow your client base.</p>
          </div>
          <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-premium flex items-center gap-2">
             <div className="p-2 text-slate-400"><Search size={18} /></div>
             <input type="text" placeholder="Search by description..." className="text-sm font-medium border-none focus:outline-none bg-transparent w-48 pr-4" />
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium">
           <div className="flex items-center gap-4 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100 shadow-sm">
                 <SlidersHorizontal size={18} />
              </div>
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest mr-2">Filter Excellence:</span>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((service) => (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service === "All" ? "" : service)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-300 ${
                      (service === "All" && !selectedService) || selectedService === service
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Jobs Grid */}
        <AnimatePresence mode="popLayout">
          {jobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center shadow-premium"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Briefcase size={48} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Market is quiet right now</h3>
              <p className="text-slate-500 font-medium">Try changing your filters or check back in a few minutes.</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {jobs.map((job) => {
                const hasApplied = appliedJobIds.has(String(job.id));
                return (
                  <motion.div
                    key={job.id}
                    layout
                    whileHover={{ y: -6 }}
                    className={`bg-white rounded-[2.5rem] border overflow-hidden p-8 transition-all duration-500 relative group flex flex-col ${
                      hasApplied ? "border-emerald-100 shadow-emerald-500/5 bg-emerald-50/10" : "border-slate-100 shadow-premium hover:border-primary-100"
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg group-hover:bg-primary-600 transition-colors duration-500 shrink-0">
                          <Briefcase size={28} />
                       </div>
                       {hasApplied && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                             <CheckCircle size={12} strokeWidth={3} />
                             Active Bid
                          </div>
                       )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4 mb-8">
                       <h3 className="text-xl font-black text-slate-950 tracking-tight leading-snug line-clamp-2">
                          {job.serviceType} Professional Need
                       </h3>
                       <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                          {job.description}
                       </p>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-3 mb-8 pb-8 border-b border-slate-100">
                       <div className="flex items-center gap-3 text-slate-600 font-bold text-xs uppercase tracking-tight">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
                             <MapPin size={16} />
                          </div>
                          <span>{job.city}, {job.state}</span>
                       </div>
                       <div className="flex items-center gap-3 text-primary-600 font-bold text-xs uppercase tracking-tight">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
                             <DollarSign size={16} strokeWidth={3} />
                          </div>
                          <span className="text-lg font-black tracking-tighter">₹{job.budgetMin} - ₹{job.budgetMax}</span>
                       </div>
                    </div>

                    {/* Date Tag */}
                    {job.date && (
                       <div className="flex items-center gap-2 mb-8 text-[11px] font-bold text-slate-400 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                          <Calendar size={14} />
                          {new Date(job.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                       </div>
                    )}

                    {/* Interaction Section */}
                    <div className="mt-auto">
                      {hasApplied ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <div className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-black uppercase tracking-widest border border-emerald-100">
                              <CheckCircle size={18} strokeWidth={2.5} />
                              Bid Submitted
                           </div>
                           <button
                             onClick={() => cancelBid(job.id)}
                             disabled={cancellingBids[job.id]}
                             className="w-full py-4 text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                           >
                             <XCircle size={16} />
                             {cancellingBids[job.id] ? "Processing..." : "Withdraw Bid"}
                           </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 gap-2">
                              <div className="relative group/input">
                                 <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={16} />
                                 <input
                                   type="number"
                                   placeholder={`Quote (₹${job.budgetMin}-${job.budgetMax})`}
                                   value={bidPrices[job.id] || ""}
                                   onChange={(e) => setBidPrices({ ...bidPrices, [job.id]: e.target.value })}
                                   className="w-full py-3.5 pl-9 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300"
                                 />
                              </div>
                              <textarea
                                placeholder="Letter of intent..."
                                value={bidMessages[job.id] || ""}
                                onChange={(e) => setBidMessages({ ...bidMessages, [job.id]: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none placeholder:text-slate-300"
                              />
                           </div>
                           <button
                             onClick={() => placeBid(job.id)}
                             disabled={loadingBids[job.id]}
                             className="w-full py-4 bg-slate-950 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-200 group/btn flex items-center justify-center gap-2"
                           >
                             {loadingBids[job.id] ? "Submitting..." : "Submit Proposal"}
                             <ArrowUpRight size={18} className="translate-y-0.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                           </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default JobFeed;
