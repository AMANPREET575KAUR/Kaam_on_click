import { useState } from "react";
import axios from "axios";
import config from "../config";
import { states } from "../data/states";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, Lock, MapPin, Briefcase, CheckCircle2, AlertCircle, ChevronDown, Sparkles, Phone, ArrowRight, Star, Zap, Shield, Building } from "lucide-react";
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
    
    console.log("Registration attempt initialized:", { role, name, email, state, services });

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

      console.log("Sending GraphQL Mutation with variables...");
      const res = await axios.post(config.API_URL, { query, variables });
      
      if (res.data.errors) {
        console.error("GraphQL Errors:", res.data.errors);
        throw new Error(res.data.errors[0].message);
      }
      
      console.log("Registration Successful!");
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden">
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
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-400/30 to-primary-400/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-secondary-400/20 to-accent-400/20 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-20 left-20 text-primary-400/50"
      >
        <Star size={40} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-32 right-32 text-secondary-400/50"
      >
        <Zap size={32} />
      </motion.div>
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-32 left-32 text-accent-400/50"
      >
        <Shield size={36} />
      </motion.div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/20 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              
              {/* Left Side - Hero Section */}
              <div className="hidden md:block bg-hero-gradient p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Building className="text-white" size={24} />
                      </div>
                      <h1 className="text-3xl font-bold text-white">KaamOnClick</h1>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                      Join India's Premier Service Network
                    </h2>
                    <p className="text-white/90 text-lg mb-8 leading-relaxed">
                      Whether you're looking for reliable service providers or want to grow your business, 
                      we connect you with opportunities that matter.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Star className="text-white" size={20} />
                        </div>
                        <span className="text-white/90">Verified Professionals</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Zap className="text-white" size={20} />
                        </div>
                        <span className="text-white/90">Instant Connections</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Shield className="text-white" size={20} />
                        </div>
                        <span className="text-white/90">Secure Payments</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Side - Registration Form */}
              <div className="p-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-3">
                      Create Account
                    </h2>
                    <p className="text-slate-600 font-medium">
                      Join our community of service professionals and customers
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
                        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4 flex items-start gap-3">
                          <AlertCircle className="text-danger-500 shrink-0" size={20} />
                          <p className="text-sm font-medium text-danger-600">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Role Selector */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      I want to
                    </label>
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-1 rounded-2xl flex gap-1 relative overflow-hidden border border-primary-200">
                      {[
                        { id: "CUSTOMER", label: "Hire Services", icon: CheckCircle2 },
                        { id: "PROVIDER", label: "Provide Services", icon: Briefcase },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setRole(id);
                            setError("");
                          }}
                          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${role === id ? "text-white" : "text-slate-600 hover:text-slate-800"
                            }`}
                        >
                          {role === id && (
                            <motion.div
                              layoutId="active-role"
                              className="absolute inset-0 bg-premium-gradient shadow-lg rounded-xl"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                          <Icon size={18} className="relative z-10" />
                          <span className="relative z-10">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-300"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-300"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-300"
                          placeholder="Create a strong password"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        State
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-300 appearance-none"
                        >
                          <option value="">Select your state</option>
                          {states.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Services Section for Providers */}
                    {role === "PROVIDER" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <label className="block text-sm font-semibold text-slate-700">
                          Services You Offer
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {servicesList.map((service) => (
                            <button
                              key={service}
                              type="button"
                              onClick={() => toggleService(service)}
                              className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                                services.includes(service)
                                  ? "border-primary-500 bg-primary-50 text-primary-700"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {service}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-premium-gradient hover:shadow-premium disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </motion.button>
                  </form>

                  {/* Footer */}
                  <p className="text-center text-slate-600 font-medium mt-8">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-700 font-bold transition-colors underline-offset-4 hover:underline"
                    >
                      Sign in
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

export default Register;
