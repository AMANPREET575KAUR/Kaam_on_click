import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { Briefcase, DollarSign, Check, Clock, Plus, Eye, TrendingUp, ArrowRight, MapPin, Loader2, CheckCircle, Sparkles, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

function Dashboard() {
  const userRole = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName") || "User";
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const query = `{
      dashboardStats {
        totalJobs openJobs assignedJobs completedJobs
        totalBids pendingBids acceptedBids
        recentJobs { id serviceType description city state budgetMin budgetMax status }
        recentBids { id bidPrice message status job { id serviceType description city state budgetMin budgetMax status } }
      }
    }`;

    try {
      const res = await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setStats(res.data.data.dashboardStats);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      OPEN: "bg-emerald-50 text-emerald-600 border-emerald-100",
      ASSIGNED: "bg-blue-50 text-blue-600 border-blue-100",
      COMPLETED: "bg-slate-100 text-slate-900 border-slate-200",
      PENDING: "bg-amber-50 text-amber-600 border-amber-100",
      ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-100",
      REJECTED: "bg-red-50 text-red-600 border-red-100",
    };
    return statusMap[status] || "bg-slate-50 text-slate-500 border-slate-100";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin text-primary-500" size={48} strokeWidth={1.5} />
            <div className="absolute inset-0 bg-primary-500/10 blur-xl rounded-full" />
          </div>
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Initializing Dashboard</p>
        </div>
      </DashboardLayout>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // ========== CUSTOMER DASHBOARD ==========
  if (userRole === "CUSTOMER") {
    const customerStats = [
      { label: "Jobs Posted", value: stats?.totalJobs || 0, icon: Briefcase, color: "from-blue-500 to-indigo-600" },
      { label: "Active Jobs", value: stats?.openJobs || 0, icon: Zap, color: "from-amber-400 to-orange-500" },
      { label: "Completed", value: stats?.completedJobs || 0, icon: CheckCircle, color: "from-emerald-400 to-teal-500" },
      { label: "Bids Received", value: stats?.totalBids || 0, icon: DollarSign, color: "from-purple-500 to-pink-600" },
    ];

    return (
      <DashboardLayout>
        <div className="space-y-10">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-10 lg:p-16 text-white shadow-2xl">
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-600/20 blur-[100px] rounded-full" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-4 text-primary-400 uppercase tracking-widest font-black text-xs"
                >
                  <Sparkles size={14} />
                  <span>Elite Member Status</span>
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter"
                >
                  Welcome, {userName.split(" ")[0]}!
                </motion.h1>
                <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">
                  Your household projects are being handled by the best. Manage your bookings and review incoming bids below.
                </p>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => navigate("/create-job")}
                  className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <Plus size={20} strokeWidth={3} />
                  <span>Post New Job</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                   onClick={() => navigate("/view-bids")}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Eye size={20} />
                  <span>Review Bids</span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {customerStats.map(({ label, value, icon: Icon, color }) => (
              <motion.div
                key={label}
                variants={item}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium group hover:border-primary-200 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                    <Icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total {label.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{label}</span>
                  <div className="h-px w-full bg-slate-100 group-hover:bg-primary-100 transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Jobs - Main List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Job Posts</h2>
                <button onClick={() => navigate("/view-bids")} className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group">
                  View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {stats?.recentJobs?.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-premium">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs yet</h3>
                  <p className="text-slate-500 font-medium mb-6">Start by posting your first project to get bids.</p>
                  <button onClick={() => navigate("/create-job")} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">Post a Job</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {stats?.recentJobs?.slice(0, 3).map((job) => (
                    <motion.div
                      key={job.id}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate("/view-bids")}
                      className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-premium cursor-pointer group hover:border-primary-200 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white shrink-0 group-hover:bg-primary-600 transition-colors">
                          <Briefcase size={28} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <h4 className="text-lg font-black text-slate-900 leading-none tracking-tight">{job.serviceType}</h4>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm font-medium line-clamp-1 mb-3">{job.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                            <div className="flex items-center gap-1.5"><MapPin size={14} /> {job.city}, {job.state}</div>
                            <div className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500" /> ₹{job.budgetMin}-{job.budgetMax}</div>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                           <div className="hidden sm:flex flex-col items-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</span>
                              <span className="text-lg font-black text-emerald-600 leading-none">₹{job.budgetMax}</span>
                           </div>
                           <ArrowRight size={24} className="text-slate-200 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations/Help Sidebar */}
            <div className="space-y-6">
               <h2 className="text-2xl font-black text-slate-900 tracking-tight px-2">Top Services</h2>
               <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute bottom-[-20%] right-[-20%] w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                  <h3 className="text-xl font-black mb-2 leading-tight">Professional Cleaning</h3>
                  <p className="text-primary-100 text-xs font-medium mb-6 leading-relaxed">Most hired service in your area this month.</p>
                  <button className="w-full bg-white text-primary-700 py-3 rounded-xl font-black text-sm hover:scale-[1.02] transition-transform">Book Now</button>
               </div>
               <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-premium">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600"><Star size={20} fill="currentColor" /></div>
                     <h3 className="text-base font-black text-slate-900">Elite Guarantee</h3>
                  </div>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed">All our professionals go through a rigorous 3-step verification process to ensure your safety and quality of work.</p>
               </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ========== PROVIDER DASHBOARD ==========
  const providerStats = [
    { label: "Bids Placed", value: stats?.totalBids || 0, icon: Gavel, color: "from-blue-500 to-indigo-600" },
    { label: "Pending", value: stats?.pendingBids || 0, icon: Clock, color: "from-amber-400 to-orange-500" },
    { label: "Accepted", value: stats?.acceptedBids || 0, icon: Check, color: "from-emerald-400 to-teal-500" },
    { label: "Completed", value: stats?.completedJobs || 0, icon: CheckCircle, color: "from-purple-500 to-pink-600" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-10 lg:p-16 text-white shadow-2xl">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-accent-600/20 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 mb-4 text-accent-400 uppercase tracking-widest font-black text-xs"
              >
                <TrendingUp size={14} />
                <span>Growth Trajectory: +12%</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter"
              >
                Hello, {userName.split(" ")[0]}!
              </motion.h1>
              <p className="text-slate-400 text-lg max-w-lg font-medium leading-relaxed">
                Opportunity is knocking. There are <span className="text-white font-bold">{stats?.openJobs || 0} active jobs</span> waiting for your expert touch today.
              </p>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => navigate("/job-feed")}
                className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-accent-500/25 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <Briefcase size={20} />
                <span>Find New Jobs</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/my-bids")}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Plus size={20} />
                <span>Track My Bids</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {providerStats.map(({ label, value, icon: Icon, color }) => (
            <motion.div
              key={label}
              variants={item}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium group hover:border-accent-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{value}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{label} Status</span>
                <div className="h-px w-full bg-slate-100 group-hover:bg-accent-100 transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bids - Main List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Bids Activity</h2>
              <button onClick={() => navigate("/my-bids")} className="text-sm font-bold text-accent-600 hover:text-accent-700 flex items-center gap-1 group">
                Review History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {stats?.recentBids?.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-premium">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No active bids</h3>
                <p className="text-slate-500 font-medium mb-6">Head over to the job feed to start winning clients.</p>
                <button onClick={() => navigate("/job-feed")} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">Go to Job Feed</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {stats?.recentBids?.map((bid) => (
                  <motion.div
                    key={bid.id}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate("/my-bids")}
                    className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-premium cursor-pointer group hover:border-accent-200 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors">
                        <DollarSign size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h4 className="text-lg font-black text-slate-900 leading-none tracking-tight">{bid.job?.serviceType || "Job"} Entry</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(bid.status)}`}>
                            {bid.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium line-clamp-1 mb-2">Your bid: ₹{bid.bidPrice}</p>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                          <div className="flex items-center gap-1"><MapPin size={12} /> {bid.job?.city}</div>
                          <div className="flex items-center gap-1"><Clock size={12} /> New Activity</div>
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">My Quote</span>
                         <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{bid.bidPrice}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Provider Performance */}
          <div className="space-y-6">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight px-2">Performance</h2>
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium relative overflow-hidden text-center">
                <div className="w-20 h-20 rounded-full border-8 border-emerald-500 flex items-center justify-center mx-auto mb-6 relative">
                   <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                   <span className="text-xl font-black text-slate-900">88%</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">High Acceptance</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">Your bid acceptance rate is 15% higher than the average provider in your state.</p>
                <div className="flex items-center gap-2 justify-center text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                   <TrendingUp size={14} />
                   <span>Top 10% Rated</span>
                </div>
             </div>
             
             <div className="bg-gradient-to-br from-indigo-600 to-primary-700 rounded-3xl p-6 text-white shadow-xl">
                <p className="text-[10px] font-bold text-primary-200 uppercase tracking-widest mb-2">Quick Tip</p>
                <p className="text-sm font-bold leading-relaxed">Personalized messages in bids increase your win rate by up to 45%.</p>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
