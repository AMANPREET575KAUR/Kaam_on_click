import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Phone, Camera, MapPin, Building2, Clock, Wrench, FileText, ArrowRight } from "lucide-react";
import { states } from "../data/states";
import { motion } from "framer-motion";

function CompleteProviderProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [services, setServices] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const servicesList = [
    "Plumbing", "Electrician", "Cleaning", "Carpenter",
    "Painter", "AC Repair", "Appliance Repair"
  ];

  const toggleService = (service) => {
    if (services.includes(service)) {
      setServices(services.filter((s) => s !== service));
    } else {
      setServices([...services, service]);
    }
  };

  const handleSubmit = async () => {
    if (!phone) { setError("Phone number is required"); return; }
    if (!profilePicture) { setError("Profile picture is required"); return; }
    if (!experienceYears) { setError("Experience years is required"); return; }
    if (services.length === 0) { setError("Please select at least one service"); return; }
    if (!city || !state) { setError("City and state are required"); return; }

    setIsLoading(true);
    setError("");

    try {
      const mutation = `
        mutation {
          completeProviderProfile(
            phone: "${phone}"
            profilePicture: "${profilePicture}"
            experienceYears: ${parseInt(experienceYears)}
            services: "${services.join(",")}"
            city: "${city}"
            state: "${state}"
            description: "${description}"
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
          <h1 className="text-2xl font-bold text-zinc-900">Complete Your Provider Profile</h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Fill in your details to start receiving job requests
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Phone (mandatory) */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
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

          {/* Profile Picture Upload (mandatory) */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Profile Picture <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {profilePicture ? (
                <img src={profilePicture} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-zinc-100 border-2 border-dashed border-zinc-300 flex items-center justify-center">
                  <Camera className="text-zinc-400" size={24} strokeWidth={1.5} />
                </div>
              )}
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors">
                  <Camera size={16} strokeWidth={1.5} />
                  {profilePicture ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        setError("Image must be less than 2MB");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => setProfilePicture(reader.result);
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <p className="text-xs text-zinc-400 mt-1">JPG, PNG — max 2MB</p>
              </div>
            </div>
          </div>

          {/* Experience Years (mandatory) */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Years of Experience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} strokeWidth={1.5} />
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="How many years?"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Your Services <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {servicesList.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    services.includes(s)
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {s}
                </button>
              ))}
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              About You
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-zinc-400" size={18} strokeWidth={1.5} />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell customers about your skills and experience..."
                rows={3}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 focus:bg-white transition-all resize-none"
              />
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
                Complete Profile & Continue
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default CompleteProviderProfile;
