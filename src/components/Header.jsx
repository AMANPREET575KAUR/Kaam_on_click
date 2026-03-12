// jab customer ma jata ha upar vala profile option ,myprofile,settings
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const profilePath =
    userRole === "CUSTOMER" ? "/customer-profile" : "/my-profile";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/");
  }; 

  // Close dropdown when clicking outside
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
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 fixed right-0 left-64 top-0 z-40">
      <div />

      {/* Profile Dropdown */} 
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
        >
          {/* for profie icon,create circle in background */}
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
            {/* show icon */}
            <User size={16} className="text-white" strokeWidth={2} />
          </div>
              {/* show user name  from local storage*/}
          <div className="text-left">
            <p className="text-sm font-medium text-zinc-900 leading-none">
              {userName}
            </p>
            {/* display user role */}
            <p className="text-xs text-zinc-500 capitalize mt-0.5">
              {userRole?.toLowerCase()}
            </p>
          </div>
          {/* arrow rotate on click */}
          <ChevronDown
            size={16}
            className={`text-zinc-400 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu ,conditional rendering open:show menu,closed:hide menu*/}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-zinc-200 shadow-lg py-1 z-50">
            {/* Profile Section */}
            <div className="px-4 py-3 border-b border-zinc-200">
              <p className="text-xs font-medium text-zinc-500">ACCOUNT</p>
            </div>

            {/* to profile page,and dropdown closed */}
            <button
              onClick={() => {
                navigate(profilePath);
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
            >
              <User size={16} strokeWidth={1.5} />
              My Profile
            </button>

            {/* Settings Link */}
            <button
              onClick={() => {
                navigate("/settings");
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors text-left"
            >
              <Settings size={16} strokeWidth={1.5} />
              Settings
            </button>

            {/* Divider */}
            <div className="my-1 border-t border-zinc-200" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.5} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
