import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, User, Briefcase } from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import config from "../config";

function ForgotPassword() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !newPassword || !confirmPassword || !role) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const query = `
        mutation ResetPassword($email: String!, $role: String!, $newPassword: String!) {
          resetPassword(email: $email, role: $role, newPassword: $newPassword) {
            id
          }
        }
      `;

      const res = await axios.post(config.API_URL, {
        query,
        variables: { email: email.trim().toLowerCase(), role, newPassword }
      });

      if (res.data.errors) {
        throw new Error(res.data.errors[0].message);
      }

      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.message || "Could not reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-950 tracking-tight mb-3">
            Reset Password
          </h2>
          <p className="text-slate-500 font-medium">
            Enter your account email and set a new password.
          </p>
        </motion.div>

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

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <p className="text-sm font-medium text-emerald-700">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
              Account type
            </label>
            <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 relative overflow-hidden">
              {[
                { id: "CUSTOMER", label: "Customer", icon: User },
                { id: "PROVIDER", label: "Provider", icon: Briefcase },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${role === id ? "text-slate-950" : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {role === id && (
                    <motion.div
                      layoutId="forgot-role"
                      className="absolute inset-0 bg-white shadow-sm rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 group relative overflow-hidden"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.button>
        </form>

        <p className="text-center text-slate-500 font-medium mt-10">
          Remembered your password?{" "}
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-bold transition-colors underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
