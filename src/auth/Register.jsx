import { useState } from "react";
import axios from "axios";
import AuthLayout from "../layout/AuthLayout";
import { states } from "../data/states";
import FloatingInput from "../components/FloatingInput";
import ServiceSelector from "../components/ServiceSelector";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Lock, MapPin, Briefcase, CheckCircle2 } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("");

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const servicesList = [
    "Plumbing",
    "Electrician",
    "Cleaning",
    "Carpenter",
    "Painter",
    "AC Repair",
    "Appliance Repair",
  ];

  const toggleService = (service) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const register = async () => {
    if (!name || !email || !password || !state) {
      setError("Please fill in all required fields");
      return;
    }

    if (role === "PROVIDER" && services.length === 0) {
      setError("Please select at least one service");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let query;

      if (role === "CUSTOMER") {
        query = `
        mutation{
         registerCustomer(
          name:"${name}"
          email:"${email}"
          password:"${password}"
          phone:"9999999999"
          state:"${state}"
         ){id}
        }
        `;
      } else {
        query = `
        mutation{
         registerProvider(
          name:"${name}"
          email:"${email}"
          password:"${password}"
          phone:"9999999999"
          state:"${state}"
          city:"city"
          services:"${services.join(",")}"
          experienceYears:3
          description:"provider"
         ){id}
        }
        `;
      }

      await axios.post(
        "http://localhost:4000/graphql",
        { query }
      );

      // Success - redirect to login
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      const errorMessage = err.response?.data?.errors?.[0]?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-zinc-500 mt-1.5">
            Get started — it only takes a minute.
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

        {/* Role selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            I want to
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "CUSTOMER", label: "Hire a Pro", icon: CheckCircle2, desc: "Find professionals" },
              { id: "PROVIDER", label: "Offer Services", icon: Briefcase, desc: "Earn on your skills" },
            ].map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                onClick={() => setRole(id)}
                className={`rounded-xl p-3.5 text-left transition-all duration-150 border-2 ${
                  role === id
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
              >
                <Icon
                  size={20}
                  className={`mb-2 ${role === id ? "text-white" : "text-zinc-400"}`}
                />
                <p
                  className={`font-semibold text-sm ${
                    role === id ? "text-white" : "text-zinc-600"
                  }`}
                >
                  {label}
                </p>
                <p className={`text-xs mt-0.5 ${role === id ? "text-zinc-400" : "text-zinc-400"}`}>{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <FloatingInput
          label="Full Name"
          icon={User}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />

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
        <FloatingInput
          label="Password"
          type="password"
          icon={Lock}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        {/* State dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-700 mb-1.5">
            State
          </label>
          <div className="relative">
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-150 ${
                state ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              <MapPin size={18} strokeWidth={1.5} />
            </div>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setError("");
              }}
              className={`w-full bg-zinc-50 border rounded-xl py-2.5 pl-10 pr-8 text-sm text-zinc-900 focus:outline-none transition-all duration-150 appearance-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-zinc-900/10 ${
                state
                  ? "border-zinc-900"
                  : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <option value="">Select your state</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Services — provider only */}
        <AnimatePresence mode="wait">
          {role === "PROVIDER" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5"
            >
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Your expertise
              </label>
              <ServiceSelector
                services={servicesList}
                selectedServices={services}
                onToggle={toggleService}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          onClick={register}
          disabled={isLoading}
          className="w-full bg-[#09090b] hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl py-2.5 transition-all duration-150 flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-zinc-900 hover:text-zinc-700 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;