import { useState } from "react";
import axios from "axios";
import config from "../config";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase, AlertCircle, Sparkles, Zap, Shield, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    if (!email || !password || !role) {
      setError("Please fill in all fields");
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
            profileCompleted
          }
        }
      }
      `;

      const res = await axios.post(
        config.API_URL,
        {
          query,
          variables: { email, password, role }
        }
      );

      if (res.data.errors) {
        throw new Error(res.data.errors[0].message);
      }

      const { token, user } = res.data.data.login;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/30 to-blue-400/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              
              {/* Left Side - Hero Section */}
              <div className="hidden md:block bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Star className="text-white" size={24} />
                      </div>
                      <h1 className="text-3xl font-bold text-white">KaamOnClick</h1>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                      One Tap. Problem Gone.
                    </h2>
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                      Connect with verified professionals for all your home services. 
                      From plumbing to electrical work, find the right expert in seconds.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Zap className="text-white" size={20} />
                        </div>
                        <span className="text-white/90">Instant Service Matching</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Shield className="text-white" size={20} />
                        </div>
                        <span className="text-white/90">Verified Professionals</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Sparkles className="text-white" size={20} />
                        </div>
                        <span className="text-white/90">Affordable Pricing</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="p-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600 font-medium">
                      Sign in to access your dashboard
                    </p>
                  </div>

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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sign in as
                    </label>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1 rounded-2xl flex gap-1 relative overflow-hidden border border-blue-200">
                      {[
                        { id: "CUSTOMER", label: "Customer", icon: User },
                        { id: "PROVIDER", label: "Provider", icon: Briefcase },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setRole(id);
                            setError("");
                          }}
                          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${role === id ? "text-white" : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                          {role === id && (
                            <motion.div
                              layoutId="active-role"
                              className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 shadow-lg rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <Icon size={18} className="relative z-10" />
                          <span className="relative z-10">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6 mb-8">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Password
                        </label>
                        <Link to="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={login}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Your Account</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </motion.button>

                  {/* Footer */}
                  <p className="text-center text-gray-600 font-medium mt-8">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-700 font-bold transition-colors underline-offset-4 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
