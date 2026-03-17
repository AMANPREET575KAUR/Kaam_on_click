import { useState } from "react";
import axios from "axios";
import config from "../config";
import AuthLayout from "../layout/AuthLayout";
import { states } from "../data/states";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Lock, MapPin, Briefcase, CheckCircle2, AlertCircle, ChevronDown, Phone, ArrowRight } from "lucide-react";
import ServiceSelector from "../components/ServiceSelector";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const servicesList = [
    "Plumbing", "Electrician", "Cleaning", "Carpenter", "Painter", "AC Repair", "Appliance Repair",
  ];

  const toggleService = (service) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    
    if (!name || !email || !password || !state || !phone) {
      setError("Please fill in all required fields including your phone line.");
      return;
    }

    if (role === "PROVIDER" && services.length === 0) {
      setError("Please select at least one professional service.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let query;
      let variables;

      if (role === "CUSTOMER") {
        query = `
        mutation RegisterCustomer($name: String!, $email: String!, $password: String!, $phone: String!, $state: String!) {
          registerCustomer(name: $name, email: $email, password: $password, phone: $phone, state: $state) {
            id
          }
        }
        `;
        variables = { name, email, password, phone, state };
      } else {
        query = `
        mutation RegisterProvider($name: String!, $email: String!, $password: String!, $phone: String!, $state: String!, $city: String!, $services: String!, $experienceYears: Int!, $description: String!) {
          registerProvider(name: $name, email: $email, password: $password, phone: $phone, state: $state, city: $city, services: $services, experienceYears: $experienceYears, description: $description) {
            id
          }
        }
        `;
        variables = { 
          name, email, password, phone, state, 
          city: "Default City", 
          services: services.join(","), 
          experienceYears: 1, 
          description: "Professional Service Provider" 
        };
      }

      const res = await axios.post(config.API_URL, { query, variables });
      
      if (res.data.errors) {
        console.error("GraphQL Errors:", res.data.errors);
        throw new Error(res.data.errors[0].message);
      }
      
      alert("Registration successful! Redirecting to login...");
      navigate("/");
    } catch (err) {
      console.error("Registration Exception:", err);
      setError(err.response?.data?.errors?.[0]?.message || err.message || "Registration failed. Database synchronization error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full pb-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center lg:text-left"
        >
          <h2 className="text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
            Create Account
          </h2>
          <p className="text-slate-500 font-medium">
            Create your account to continue.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4 shadow-lg shadow-red-500/5 transition-all">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <p className="text-xs font-black uppercase tracking-widest text-red-600 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-10">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
            Identity Profile
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "CUSTOMER", label: "Hire Help", icon: CheckCircle2, desc: "Get things done" },
              { id: "PROVIDER", label: "Work", icon: Briefcase, desc: "Earn on your terms" },
            ].map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setRole(id); setError(""); }}
                className={`relative flex flex-col p-5 rounded-[2rem] border-2 transition-all duration-500 text-left group ${
                  role === id ? "border-slate-950 bg-slate-950 shadow-2xl shadow-slate-200 translate-y-[-2px]" : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <Icon size={24} className={`mb-4 transition-colors duration-500 ${role === id ? "text-primary-400" : "text-slate-300 group-hover:text-slate-400"}`} />
                <span className={`text-sm font-black mb-1 tracking-tight ${role === id ? "text-white" : "text-slate-900"}`}>{label}</span>
                <span className={`text-[10px] uppercase tracking-[0.15em] font-black ${role === id ? "text-slate-500" : "text-slate-300"}`}>{desc}</span>
                {role === id && (
                  <motion.div layoutId="role-indicator" className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <div className="relative group/input">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Identity (Email)</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Line</label>
              <div className="relative group/input">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                  placeholder="+91 XXXX XXXX"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Passkey</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Operational State</label>
              <div className="relative group/input">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select territory</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {role === "PROVIDER" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4"
              >
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Professional Excellence (Services)</label>
                <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 shadow-inner">
                  <ServiceSelector
                    services={servicesList}
                    selectedServices={services}
                    onToggle={toggleService}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-6">
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
                  <span>Create Account</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-10 pt-10 border-t border-slate-100">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Registered Partner? <Link to="/" className="text-primary-600 hover:text-primary-700 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Register;
