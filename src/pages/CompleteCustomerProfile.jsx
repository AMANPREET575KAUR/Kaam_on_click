import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Home, Phone, Building2, ArrowRight } from "lucide-react";
import { states } from "../data/states";
import { motion } from "framer-motion";

function CompleteCustomerProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!address || !city || !state) {
      setError("Address, city and state are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const mutation = `
        mutation {
          completeCustomerProfile(
            phone: "${phone}"
            address: "${address}"
            houseNumber: "${houseNumber}"
            city: "${city}"
            state: "${state}"
          ) {
            id
            profileCompleted
          }
        }
      `;

      await axios.post(
        "http://localhost:4000/graphql",
        { query: mutation },
        { headers: { authorization: token } }
      );

      localStorage.setItem("profileCompleted", "true");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0]?.message || "Failed to complete profile";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-sm p-8"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Complete Your Profile</h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Just a few details before you start posting jobs
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Phone (optional) */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Phone Number <span className="text-zinc-400">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={1.5} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* House Number */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              House / Flat Number
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={1.5} />
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="E.g. B-204, Tower 3"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-zinc-400" size={18} strokeWidth={1.5} />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                rows={2}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={1.5} />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              State <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={1.5} />
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-8 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Select your state</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl py-3 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CompleteCustomerProfile;
