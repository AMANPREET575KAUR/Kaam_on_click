import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Guest";

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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={`h-20 flex items-center justify-between px-6 lg:px-12 fixed right-0 left-0 lg:left-72 top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center gap-4 ml-auto">
        {/* Profile Dropdown */}
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
