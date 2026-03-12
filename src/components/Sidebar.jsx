import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, Briefcase, Eye, User, Settings, Gavel } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const userRole = localStorage.getItem("userRole");

  const customerNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/create-job", label: "Create Job", icon: Plus },
    { path: "/view-bids", label: "My Jobs & Bids", icon: Eye },
  ];

  const providerNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/job-feed", label: "Browse Jobs", icon: Briefcase },
    { path: "/my-bids", label: "My Bids", icon: Gavel },
    { path: "/my-profile", label: "My Profile", icon: User },
  ];

  const navItems = userRole === "CUSTOMER" ? customerNavItems : providerNavItems;

  return (
    <div className="w-64 h-screen bg-white border-r border-zinc-200 fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#09090b] flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#09090b] font-semibold text-base tracking-tight leading-none">
              KaamOnClick
            </span>
            <span className="text-xs text-zinc-400 mt-0.5 capitalize">
              {userRole?.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon size={18} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="p-4 border-t border-zinc-200">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/settings"
              ? "bg-zinc-900 text-white"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <Settings size={18} strokeWidth={1.5} />
          Settings
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;