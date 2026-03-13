import { useState } from "react";
import axios from "axios";
import AuthLayout from "../layout/AuthLayout";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingInput from "../components/FloatingInput";

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
      mutation{
       login(
        email:"${email}"
        password:"${password}"
        role:"${role}"
       ){
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
        "http://localhost:4000/graphql",
        { query }
      );

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
      const errorMessage = err.response?.data?.errors?.[0]?.message || "Invalid email or password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && email && password && !isLoading) {
      login();
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Heading */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-zinc-500 mt-1.5">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Login as
          </label>
          <div className="grid grid-cols-2 gap-2.5">
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
                className={`rounded-xl p-3 text-left transition-all duration-150 border-2 flex items-center gap-2 ${
                  role === id
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                }`}
              >
                <Icon size={16} />
                <span className="font-semibold text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <FloatingInput
          label="Email"
          type="email"
          icon={Mail}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        {/* Password */}
        <div className="mb-1.5">
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
                password ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              <Lock size={18} strokeWidth={1.5} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              className={`w-full bg-zinc-50 border rounded-xl py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all duration-150 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 ${
                password
                  ? "border-zinc-900"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="mb-6 flex justify-end">
          <Link
            to="#"
            className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          onClick={login}
          disabled={isLoading}
          className="w-full bg-[#09090b] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl py-2.5 transition-all duration-150 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight size={15} />
            </>
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-zinc-900 hover:text-zinc-700 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;