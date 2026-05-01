import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users, Briefcase, ClipboardList, TrendingUp,
  LogOut, LayoutDashboard, ShieldCheck, ChevronRight,
  CheckCircle, XCircle
} from "lucide-react";

function AdminSidebar({ active }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const links = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/providers", icon: Briefcase, label: "Providers" },
    { to: "/admin/users", icon: Users, label: "Users" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 flex flex-col fixed left-0 top-0 z-40">
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} className="text-slate-950" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">KaamOnClick</p>
            <p className="text-slate-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const isActive = active === label;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {label}
              {isActive && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition text-sm font-semibold px-4 py-3 w-full rounded-xl hover:bg-slate-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [stats, setStats] = useState({
    totalUsers: 0, totalProviders: 0, totalJobs: 0, totalBids: 0
  });
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);  // ✅ NEW
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "admin-token": token
      };

      // Fetch stats
      const statsRes = await fetch("/graphql", {
        method: "POST", headers,
        body: JSON.stringify({
          query: `query { adminStats { totalUsers totalProviders totalJobs totalBids } }`
        })
      });
      const statsData = await statsRes.json();
      if (statsData.data?.adminStats) setStats(statsData.data.adminStats);

      // Fetch recent providers
      const provRes = await fetch("/graphql", {
        method: "POST", headers,
        body: JSON.stringify({
          query: `query { adminAllProviders { id name email isVerified skills rating createdAt } }`
        })
      });
      const provData = await provRes.json();
      if (provData.data?.adminAllProviders)
        setProviders(provData.data.adminAllProviders.slice(0, 5));

      // Fetch recent users
      const userRes = await fetch("/graphql", {
        method: "POST", headers,
        body: JSON.stringify({
          query: `query { adminAllUsers { id name email isVerified createdAt } }`
        })
      });
      const userData = await userRes.json();
      if (userData.data?.adminAllUsers)
        setUsers(userData.data.adminAllUsers.slice(0, 5));

      // ✅ NEW — Fetch assigned jobs
      const assignedRes = await fetch("/graphql", {
        method: "POST", headers,
        body: JSON.stringify({
          query: `query {
            adminAssignedJobs {
              jobId serviceType
              customerName customerEmail
              providerName providerEmail providerSkills
              status city date
            }
          }`
        })
      });
      const assignedData = await assignedRes.json();
      if (assignedData.data?.adminAssignedJobs)
        setAssignedJobs(assignedData.data.adminAssignedJobs);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Customers",  value: stats.totalUsers,     icon: Users,         light: "bg-blue-50",    text: "text-blue-600",   border: "border-blue-100"   },
    { label: "Total Providers",  value: stats.totalProviders, icon: Briefcase,     light: "bg-violet-50",  text: "text-violet-600", border: "border-violet-100" },
    { label: "Total Jobs",       value: stats.totalJobs,      icon: ClipboardList, light: "bg-emerald-50", text: "text-emerald-600",border: "border-emerald-100"},
    { label: "Total Bids",       value: stats.totalBids,      icon: TrendingUp,    light: "bg-orange-50",  text: "text-orange-600", border: "border-orange-100" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar active="Dashboard" />

      <main className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
            <div className="w-7 h-7 bg-slate-950 rounded-lg flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Administrator</p>
              <p className="text-xs text-slate-400">Full Access</p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map(({ label, value, icon: Icon, light, text, border }) => (
            <div key={label} className={`bg-white rounded-2xl p-5 shadow-sm border ${border}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-500">{label}</p>
                <div className={`${light} p-2.5 rounded-xl`}>
                  <Icon size={18} className={text} />
                </div>
              </div>
              <p className="text-4xl font-bold text-slate-950">
                {loading ? "—" : value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Providers + Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Recent Providers */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-950">Recent Providers</h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest registered providers</p>
              </div>
              <Link to="/admin/providers" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {loading ? (
                <p className="text-center text-slate-400 py-8 text-sm">Loading...</p>
              ) : providers.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-sm">No providers yet</p>
              ) : providers.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-600 text-sm shrink-0">
                    {p.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 truncate">{p.email}</p>
                  </div>
                  {p.isVerified ? (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle size={11} /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                      <XCircle size={11} /> Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-950">Recent Customers</h2>
                <p className="text-xs text-slate-400 mt-0.5">Latest registered customers</p>
              </div>
              <Link to="/admin/users" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {loading ? (
                <p className="text-center text-slate-400 py-8 text-sm">Loading...</p>
              ) : users.length === 0 ? (
                <p className="text-center text-slate-400 py-8 text-sm">No customers yet</p>
              ) : users.map((u) => (
                <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                    {u.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <p className="text-xs text-slate-400 shrink-0">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    }) : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ✅ NEW — Provider → Customer Assignments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-950">Provider ↔ Customer Assignments</h2>
              <p className="text-xs text-slate-400 mt-0.5">All active and completed job assignments</p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
              {assignedJobs.length} assignments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Provider</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">Loading...</td>
                  </tr>
                ) : assignedJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <p className="text-slate-400 font-medium">No assignments yet</p>
                      <p className="text-slate-300 text-xs mt-1">Assignments appear when a customer selects a provider for a job</p>
                    </td>
                  </tr>
                ) : assignedJobs.map((job) => (
                  <tr key={job.jobId} className="hover:bg-slate-50 transition">

                    {/* Service */}
                    <td className="px-6 py-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">
                        {job.serviceType}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                          {job.customerName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{job.customerName}</p>
                          <p className="text-slate-400 text-xs">{job.customerEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs shrink-0">
                          {job.providerName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{job.providerName}</p>
                          <p className="text-slate-400 text-xs">{job.providerEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* City */}
                    <td className="px-6 py-4 text-slate-500 text-xs">{job.city}</td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {job.status === "COMPLETED" ? (
                        <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full">
                          Completed
                        </span>
                      ) : job.status === "ASSIGNED" ? (
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full">
                          Assigned
                        </span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}