import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users, Briefcase, LayoutDashboard, ShieldCheck,
  ChevronRight, LogOut, Search, CheckCircle, User
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

export default function AdminUsers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(users);
      return;
    }
    setFiltered(
      users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "admin-token": token
        },
        body: JSON.stringify({
          query: `query { adminAllUsers { id name email isVerified createdAt } }`
        })
      });
      const data = await res.json();
      if (data.data?.adminAllUsers) {
        setUsers(data.data.adminAllUsers);
        setFiltered(data.data.adminAllUsers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Avatar background colors cycle
  const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
    "bg-cyan-100 text-cyan-600",
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar active="Users" />

      <main className="flex-1 ml-64 p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-950">All Customers</h1>
          <p className="text-slate-500 text-sm mt-1">
            {users.length} customers registered on the platform
          </p>
        </div>

        {/* Mini stat row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl px-5 py-4 border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-500 font-semibold mb-1">Total Customers</p>
            <p className="text-3xl font-bold text-slate-950">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl px-5 py-4 border border-blue-100 shadow-sm">
            <p className="text-xs text-blue-600 font-semibold mb-1">Showing Results</p>
            <p className="text-3xl font-bold text-blue-600">{filtered.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Account Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
                      <p className="text-slate-400 text-sm">Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No customers found</p>
                      <p className="text-slate-400 text-xs">Try a different search term</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((u, index) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">

                  {/* Customer name + avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                        {getInitials(u.name)}
                      </div>
                      <p className="font-semibold text-slate-800">{u.name}</p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-slate-500">
                    {u.email}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                      <CheckCircle size={12} /> Active
                    </span>
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "—"}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400 font-medium">
                Showing {filtered.length} of {users.length} customers
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}