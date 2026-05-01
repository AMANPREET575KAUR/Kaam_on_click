import { useState } from "react";
import axios from "axios";
import config from "../config";
import AuthLayout from "../layout/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase, AlertCircle, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  
  const handleAdminLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/provider/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Admin login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW — Google Sign-In handler
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, uid } = result.user;

      // Send to backend
      const res = await fetch("/api/provider/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          email: email,
          googleId: uid
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("profileCompleted", String(data.user.profileCompleted));
        localStorage.setItem("userState", data.user.state || "");

        if (!data.user.profileCompleted) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (role === "ADMIN") {
      await handleAdminLogin();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const query = `
      mutation Login($email: String!, $password: String!, $role: String!) {
        login(email: $email, password: $password, role: $role) {
          token
          user {
            id
            role
            name
            state
            profileCompleted
            isVerified
          }
        }
      }
      `;

      const res = await axios.post(config.API_URL, { query, variables: { email, password, role } });

      if (res.data.errors) throw new Error(res.data.errors[0].message);

      const { token, user } = res.data.data.login;

      if (user.role === "PROVIDER" && !user.isVerified) {
        localStorage.setItem("pendingEmail", email);
        navigate("/verify-otp");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userState", user.state || "");
      localStorage.setItem("profileCompleted", String(user.profileCompleted));

      if (!user.profileCompleted) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password && !isLoading) login();
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center lg:text-left"
        >
          <h2 className="text-3xl font-bold text-slate-950 tracking-tight mb-3">
            Welcome Back
          </h2>
          <p className="text-slate-500 font-medium">
            Sign in to access your dashboard.
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
            Sign in as
          </label>
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 relative overflow-hidden">
            {[
              { id: "CUSTOMER", label: "Customer", icon: User },
              { id: "PROVIDER", label: "Provider", icon: Briefcase },
              { id: "ADMIN",    label: "Admin",    icon: ShieldCheck },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setRole(id); setError(""); }}
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  role === id ? "text-slate-950" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {role === id && (
                  <motion.div
                    layoutId="active-role"
                    className={`absolute inset-0 shadow-sm rounded-xl ${
                      id === "ADMIN" ? "bg-slate-900" : "bg-white"
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={18} className={`relative z-10 ${role === "ADMIN" && id === "ADMIN" ? "text-white" : ""}`} />
                <span className={`relative z-10 ${role === "ADMIN" && id === "ADMIN" ? "text-white" : ""}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {role === "PROVIDER" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-400 mt-2 ml-1">
              🔒 New providers must be verified by admin before accessing dashboard
            </motion.p>
          )}
          {role === "ADMIN" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-slate-400 mt-2 ml-1">
              🔐 Admin access only — restricted to authorized personnel
            </motion.p>
          )}
        </div>

        {/* ✅ NEW — Google Sign-In Button (only for CUSTOMER) */}
        {role === "CUSTOMER" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-700 font-bold rounded-2xl py-3.5 transition-all duration-300 shadow-sm"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <>
                  {/* Google Icon */}
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-semibold">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
          </motion.div>
        )}

        {/* Form Fields */}
        <div className="space-y-5 mb-6">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
              Email Address
            </label>
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="group">
            <div className="flex items-center justify-between mb-2 ml-1">
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              {role !== "ADMIN" && (
                <Link to="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative group/input">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyPress={handleKeyPress}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={login}
          disabled={isLoading}
          className={`w-full disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl group relative overflow-hidden ${
            role === "ADMIN"
              ? "bg-slate-800 hover:bg-slate-700 shadow-slate-300"
              : "bg-slate-950 hover:bg-slate-900 shadow-slate-200"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{role === "ADMIN" ? "Access Admin Dashboard" : "Sign In to Your Account"}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.button>

        {/* Footer */}
        {role !== "ADMIN" && (
          <p className="text-center text-slate-500 font-medium mt-10">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold transition-colors underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}

export default Login;