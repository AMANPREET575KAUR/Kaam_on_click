import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobNotifications } from "../hooks/useJobNotifications";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false); // ✅ NEW
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null); // ✅ NEW

  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Guest";
  const userState = localStorage.getItem("userState"); // ✅ NEW

  // ✅ NEW — Firebase real-time notifications (only for providers)
  const { notifications, unreadCount } = useJobNotifications(
    userRole === "PROVIDER" ? userState : null
  );

  const profilePath = userRole === "CUSTOMER" ? "/customer-profile" : "/my-profile";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      // ✅ NEW — close notifications on outside click
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`h-20 flex items-center justify-between px-6 lg:px-12 fixed right-0 left-0 lg:left-72 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center gap-4 ml-auto">

        {/* ✅ NEW — Notification Bell (only for providers) */}
        {userRole === "PROVIDER" && (
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 transition"
            >
              <Bell size={20} className="text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <p className="font-bold text-slate-800">🔔 Job Alerts</p>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-50 text-red-500 font-bold px-2 py-1 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-2xl mb-2">🔕</p>
                        <p className="text-slate-400 text-sm font-medium">No new job alerts</p>
                        <p className="text-slate-300 text-xs mt-1">New jobs in your area will appear here</p>
                      </div>
                    ) : notifications.map((n) => (
                      <div
                        key={n.jobId}
                        onClick={() => { navigate("/job-feed"); setShowNotifications(false); }}
                        className="px-4 py-3 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-sm">🔧</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800">{n.serviceType}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {n.city} • ₹{n.budgetMin}–₹{n.budgetMax}
                            </p>
                            <p className="text-xs text-slate-300 mt-1">
                              {new Date(n.postedAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                          {!n.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-slate-100">
                      <button
                        onClick={() => { navigate("/job-feed"); setShowNotifications(false); }}
                        className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 transition"
                      >
                        View All Jobs →
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Profile Dropdown — unchanged */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <User size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">
                {userName.split(" ")[0]}
              </p>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5">
                {userRole}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-slate-100 shadow-premium p-2 z-50 origin-top-right"
              >
                <div className="px-3 py-2 border-b border-slate-50 mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Settings</p>
                </div>

                <button
                  onClick={() => { navigate(profilePath); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all text-left"
                >
                  <User size={18} />
                  My Profile
                </button>

                <button
                  onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all text-left"
                >
                  <Settings size={18} />
                  Settings
                </button>

                <div className="my-2 border-t border-slate-50" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all text-left"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Header;