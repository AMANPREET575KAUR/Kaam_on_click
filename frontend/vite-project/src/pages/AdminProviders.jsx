import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users, Briefcase, LayoutDashboard, ShieldCheck,
  ChevronRight, LogOut, CheckCircle, XCircle,
  Star, Search
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

export default function AdminProviders() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [providers, setProviders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // ✅ FIXED — moved here inside AdminProviders
  const [sending, setSending] = useState("");
  const [toast, setToast] = useState("");

  // ✅ FIXED — moved here inside AdminProviders
  const sendOTP = async (email, name) => {
    setSending(email);
    try {
      const res = await fetch("/api/provider/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name })
      });
      const data = await res.json();
      if (data.success) {
        setToast(`✅ OTP sent to ${email}`);
      } else {
        setToast(`❌ Failed to send OTP`);
      }
    } catch (err) {
      setToast("❌ Error sending OTP");
    } finally {
      setSending("");
      setTimeout(() => setToast(""), 4000);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchProviders();
  }, []);

  useEffect(() => {
    let result = providers;
    if (search)
      result = result.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
      );
    if (filter === "VERIFIED") result = result.filter(p => p.isVerified);
    if (filter === "PENDING") result = result.filter(p => !p.isVerified);
    setFiltered(result);
  }, [search, filter, providers]);

  const fetchProviders = async () => {
    try {
      const res = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token
        },
        body: JSON.stringify({
          query: `query { adminAllProviders { id name email isVerified skills rating createdAt } }`
        })
      });
      const data = await res.json();
      if (data.data?.adminAllProviders) {
        setProviders(data.data.adminAllProviders);
        setFiltered(data.data.adminAllProviders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifiedCount = providers.filter(p => p.isVerified).length;
  const pendingCount = providers.filter(p => !p.isVerified).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar active="Providers" />

      <main className="flex-1 ml-64 p-8">

        {/* ✅ Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg ${
            toast.startsWith("✅") ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
          }`}>
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-950">All Providers</h1>
          <p className="text-slate-500 text-sm mt-1">
            {providers.length} providers registered on the platform
          </p>
        </div>

        {/* Mini stat row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl px-5 py-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-950">{providers.length}</p>
          </div>
          <div className="bg-white rounded-xl px-5 py-4 border border-emerald-100 shadow-sm">
            <p className="text-xs text-emerald-600 font-semibold mb-1">Verified</p>
            <p className="text-2xl font-bold text-emerald-600">{verifiedCount}</p>
          </div>
          <div className="bg-white rounded-xl px-5 py-4 border border-amber-100 shadow-sm">
            <p className="text-xs text-amber-600 font-semibold mb-1">Pending OTP</p>
            <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "VERIFIED", "PENDING"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  filter === f
                    ? "bg-slate-950 text-white"
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Skills</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    Loading providers...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No providers found
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition">

                  {/* Provider name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center font-bold text-violet-600 shrink-0">
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-xs bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                      {p.skills || "—"}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-700">{p.rating || "0"}</span>
                    </div>
                  </td>

                  {/* Status + Send OTP button */}
                  <td className="px-6 py-4">
                    {p.isVerified ? (
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full">
                          <XCircle size={12} /> Pending
                        </span>
                        <button
                          onClick={() => sendOTP(p.email, p.name)}
                          disabled={sending === p.email}
                          className="flex items-center gap-1 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
                        >
                          {sending === p.email ? "Sending..." : "Send OTP"}
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })
                      : "—"}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}