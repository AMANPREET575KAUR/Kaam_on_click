import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, Briefcase, Eye, User, Settings, Gavel, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
    <aside className="hidden lg:flex w-72 h-screen bg-white border-r border-slate-100 flex-col fixed left-0 top-0 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="p-8 pb-10">
        <Link to="/dashboard" className="flex items-center gap-4 group">
          <div className="w-11 h-11 rounded-2xl bg-slate-950 flex items-center justify-center shadow-premium relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-black text-2xl relative z-10 antialiased tracking-tighter">K</span>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-500/20 to-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-950 font-black text-xl tracking-tight leading-none mb-1.5 uppercase antialiased">
              KaamOnClick
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                {userRole || 'Member'}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive
                  ? "bg-primary-50 text-primary-600 border border-primary-100"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className={`transition-colors duration-300 ${isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className="tracking-tight">{label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active-pill"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary-600 shadow-lg shadow-primary-500/50"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account Section */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100 group hover:border-primary-100 hover:bg-primary-50/30 transition-all duration-300">
          <Link
            to="/settings"
            className={`flex items-center gap-4 px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
              location.pathname === "/settings"
                ? "bg-white text-primary-600 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Settings size={20} strokeWidth={location.pathname === "/settings" ? 2.5 : 1.5} />
            <span className="tracking-tight">Settings</span>
          </Link>
          
          <div className="mt-4 pt-4 border-t border-slate-200/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <Sparkles size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-900 tracking-tight uppercase">Premium Membership</span>
              <span className="text-[9px] font-medium text-slate-400 leading-none mt-1 group-hover:text-primary-600">Upgrade for pro results</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;