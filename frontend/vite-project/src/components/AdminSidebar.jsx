import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, LogOut } from "lucide-react";

const links = [
  { to: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/admin/providers", icon: <Briefcase size={18} />, label: "Providers" },
  { to: "/admin/users", icon: <Users size={18} />, label: "Users" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-6 py-6 border-b border-gray-800">
        <h2 className="text-white font-bold text-xl">⚡ Kaam Admin</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition text-sm px-4 py-2 w-full"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}