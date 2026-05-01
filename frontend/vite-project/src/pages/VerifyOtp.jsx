import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation {
            verifyOtp(email: "${email}", otp: "${otp}") {
              success
              message
            }
          }`
        })
      });

      const data = await res.json();

      if (data.errors) throw new Error(data.errors[0].message);

      if (data.data.verifyOtp.success) {
        setSuccess("Email verified! Redirecting to login...");
        localStorage.removeItem("pendingEmail");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);
    setError("");
    try {
      const res = await fetch("/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation { resendOtp(email: "${email}") { success message } }`
        })
      });
      const data = await res.json();
      if (data.data?.resendOtp?.success) {
        setSuccess("New OTP sent to your email!");
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center lg:text-left"
        >
          <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-950 tracking-tight mb-3">
            Verify Your Email
          </h2>
          <p className="text-slate-500 font-medium">
            Enter the 6-digit OTP sent to
          </p>
          <p className="text-slate-800 font-bold mt-1">{email}</p>
        </motion.div>

        {/* Error */}
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

        {/* Success */}
        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <p className="text-sm font-medium text-emerald-600">{success}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
            Enter OTP
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            placeholder="_ _ _ _ _ _"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-2xl font-bold tracking-[0.5em] text-center focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-300"
          />
          <p className="text-xs text-slate-400 mt-2 ml-1">OTP expires in 10 minutes</p>
        </div>

        {/* Verify Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={verifyOtp}
          disabled={loading || otp.length < 6}
          className="w-full bg-slate-950 hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 group mb-4"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>

        {/* Resend OTP */}
        <button
          onClick={resendOtp}
          disabled={resending}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-semibold transition py-2"
        >
          <RefreshCw size={15} className={resending ? "animate-spin" : ""} />
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </AuthLayout>
  );
}