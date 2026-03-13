//customer and provider both dashboard will be implemented here with conditional rendering based on user role
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { Briefcase, DollarSign, Check, Clock, Plus, Eye, TrendingUp, ArrowRight, MapPin, Loader2, CheckCircle } from "lucide-react";

function Dashboard() {
  const userRole = localStorage.getItem("userRole"); // choose customer or provider
  const userName = localStorage.getItem("userName") || "User";
  const navigate = useNavigate();
  const [stats, setStats] = useState(null); // to store stats data from backend,totaljobs,openjobs,completejobs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats(); // to load dashboard
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

    //api request
    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );
      setStats(res.data.data.dashboardStats); // stores dashboard data inside
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //returns tailwind css color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-zinc-100 text-zinc-900",
      amber: "bg-amber-50 text-amber-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
      teal: "bg-teal-50 text-teal-600",
    };
    return colors[color] || colors.zinc;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="animate-spin text-zinc-400" size={32} />
        </div>
      </DashboardLayout>
    );
  }

  // ========== CUSTOMER DASHBOARD ==========
  if (userRole === "CUSTOMER") {
    const customerStats = [ // create array of stats
      { label: "Total Jobs Posted", value: stats?.totalJobs || 0, icon: Briefcase, color: "zinc" },
      { label: "Open Jobs", value: stats?.openJobs || 0, icon: Clock, color: "amber" },
      { label: "Active / Assigned", value: stats?.assignedJobs || 0, icon: TrendingUp, color: "green" },
      { label: "Completed", value: stats?.completedJobs || 0, icon: CheckCircle, color: "teal" },
      { label: "Bids Received", value: stats?.totalBids || 0, icon: DollarSign, color: "purple" },
    ];

    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-1">
              
              Welcome back, {userName.split(" ")[0]} 
            </h1>
            <p className="text-zinc-500">
              Manage your jobs and review bids from service providers.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {customerStats.map(({ label, value, icon: Icon, color }) => (  //creates grid for each stat
              <div
                key={label}
                className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-zinc-900">{value}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg ${getColorClasses(color)} flex items-center justify-center`}>
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => navigate("/create-job")}
              className="flex items-center gap-4 p-5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Plus size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-sm">Post a New Job</p>
                <p className="text-xs text-zinc-400 mt-0.5">Get bids from skilled providers</p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-60" />
            </button>
            <button
              onClick={() => navigate("/view-bids")}
              className="flex items-center gap-4 p-5 bg-white border border-zinc-200 text-zinc-900 rounded-xl hover:bg-zinc-50 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                <Eye size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-sm">My Jobs & Bids</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {stats?.pendingBids ? `${stats.pendingBids} pending bids to review` : "Review received bids"}
                </p>
              </div>
              <ArrowRight size={16} className="ml-auto opacity-40" />
            </button>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-xl border border-zinc-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-zinc-900">Recent Jobs</h2>
              {stats?.recentJobs?.length > 0 && (
                <button
                  onClick={() => navigate("/view-bids")}
                  className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  View all
                </button>
              )}
            </div>
            {stats?.recentJobs?.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="mx-auto mb-3 text-zinc-300" size={28} strokeWidth={1.5} />
                <p className="text-sm text-zinc-500">No jobs posted yet. Create your first job!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentJobs?.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate("/view-bids")}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                      <Briefcase size={16} className="text-zinc-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{job.serviceType} — {job.description}</p>
                      <p className="text-xs text-zinc-500">{job.city}, {job.state} · ₹{job.budgetMin}-{job.budgetMax}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      job.status === "OPEN" ? "bg-green-50 text-green-700" :
                      job.status === "ASSIGNED" ? "bg-zinc-100 text-zinc-900" :
                      job.status === "COMPLETED" ? "bg-teal-50 text-teal-700" :
                      "bg-zinc-100 text-zinc-600"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ========== PROVIDER DASHBOARD ==========
  const providerStats = [
    { label: "Total Bids Placed", value: stats?.totalBids || 0, icon: Briefcase, color: "zinc" },
    { label: "Pending Bids", value: stats?.pendingBids || 0, icon: Clock, color: "amber" },
    { label: "Accepted Bids", value: stats?.acceptedBids || 0, icon: Check, color: "green" },
    { label: "Jobs Completed", value: stats?.completedJobs || 0, icon: CheckCircle, color: "teal" },
    { label: "Success Rate", value: stats?.totalBids > 0 ? `${Math.round((stats?.acceptedBids / stats?.totalBids) * 100)}%` : "—", icon: TrendingUp, color: "purple" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-1">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="text-zinc-500">
            Find new jobs, track your bids, and grow your business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {providerStats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
                  <p className="text-2xl font-bold text-zinc-900">{value}</p>
                </div>
                <div className={`w-9 h-9 rounded-lg ${getColorClasses(color)} flex items-center justify-center`}>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/job-feed")}
            className="flex items-center gap-4 p-5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Briefcase size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-sm">Browse Available Jobs</p>
              <p className="text-xs text-zinc-400 mt-0.5">Find and bid on new opportunities</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-60" />
          </button>
          <button
            onClick={() => navigate("/my-bids")}
            className="flex items-center gap-4 p-5 bg-white border border-zinc-200 text-zinc-900 rounded-xl hover:bg-zinc-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
              <Eye size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold text-sm">My Bids</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {stats?.pendingBids ? `${stats.pendingBids} bids awaiting response` : "Track your bid history"}
              </p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-40" />
          </button>
        </div>

        {/* Recent Bids */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Recent Bids</h2>
            {stats?.recentBids?.length > 0 && (
              <button
                onClick={() => navigate("/my-bids")}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                View all
              </button>
            )}
          </div>
          {stats?.recentBids?.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto mb-3 text-zinc-300" size={28} strokeWidth={1.5} />
              <p className="text-sm text-zinc-500">No bids placed yet. Browse jobs to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentBids?.map((bid) => (
                <div
                  key={bid.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                    <DollarSign size={16} className="text-zinc-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {bid.job?.serviceType || "Job"} — ₹{bid.bidPrice}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {bid.job?.city}, {bid.job?.state} · Budget ₹{bid.job?.budgetMin}-{bid.job?.budgetMax}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    bid.status === "PENDING" ? "bg-amber-50 text-amber-700" :
                    bid.status === "ACCEPTED" ? "bg-green-50 text-green-700" :
                    "bg-red-50 text-red-600"
                  }`}>
                    {bid.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;