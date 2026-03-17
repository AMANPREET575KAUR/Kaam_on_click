import { useState } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { Briefcase, MapPin, Calendar, ArrowRight, Sparkles, CheckCircle, Info, LayoutGrid, MapPinned, CreditCard, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { states } from "../data/states";

function CreateJob() {
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const servicesList = ["Plumbing", "Electrician", "Carpenter", "Cleaning", "Painting", "AC Repair"];

  const createJob = async () => {
    const token = localStorage.getItem("token");
    if (!service || !description || !address || !city || !state || !budgetMin || !budgetMax || !jobDate) {
      return;
    }
    setIsLoading(true);

    const query = `
    mutation {
      createJob(
        serviceType:"${service}"
        description:"${description.replace(/\n/g, "\\n")}"
        address:"${address}"
        city:"${city}"
        state:"${state}"
        budgetMin:${budgetMin}
        budgetMax:${budgetMax}
        date:"${jobDate}"
      ){ id }
    }`;

    try {
      await axios.post(config.API_URL, { query }, { headers: { authorization: token } });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setService(""); setDescription(""); setAddress(""); setCity(""); setState(""); setBudgetMin(""); setBudgetMax(""); setJobDate("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3 text-primary-600 font-bold uppercase tracking-widest text-[10px]">
              <Sparkles size={14} />
              <span>Priority Listing Enabled</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create New Request</h1>
            <p className="text-slate-500 font-medium mt-1">Provide details of your project to receive high-quality bids from elite providers.</p>
          </div>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-6 bg-emerald-500 rounded-[2rem] text-white flex items-center justify-between shadow-xl shadow-emerald-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                   <CheckCircle size={24} strokeWidth={3} />
                </div>
                <div>
                   <h3 className="text-lg font-black">Project Posted Successfully!</h3>
                   <p className="text-emerald-50 text-sm font-medium">Top providers in your area will bid shortly.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all">Dismiss</button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium">
              <div className="space-y-8">
                {/* Service Selection */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><LayoutGrid size={18} /></div>
                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Select Category</label>
                  </div>
                  <div className="relative group/input">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a service category</option>
                      {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Info size={18} /></div>
                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Project Details</label>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe exactly what you need help with. Include any specific requirements or potential issues..."
                    rows="6"
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all resize-none shadow-inner"
                  />
                </div>

                {/* Location Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State</label>
                    <div className="relative group/input">
                      <MapPinned className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select State</option>
                        {states?.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <div className="relative group/input">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Complete Service Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House No, Floor, Landmark, Pincode"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all placeholder:text-slate-300 shadow-inner"
                  />
                </div>

                {/* Date & Budget Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Clock size={16} /></div>
                         <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Preferred Date</label>
                      </div>
                      <div className="relative group/input">
                         <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-primary-500 transition-colors" size={20} />
                         <input
                           type="datetime-local"
                           value={jobDate}
                           onChange={(e) => setJobDate(e.target.value)}
                           min={new Date().toISOString().slice(0, 16)}
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all cursor-pointer"
                         />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CreditCard size={16} /></div>
                         <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Budget (Estimate)</label>
                      </div>
                      <div className="flex gap-3">
                         <div className="relative flex-1">
                            <input
                              type="number"
                              placeholder="Min"
                              value={budgetMin}
                              onChange={(e) => setBudgetMin(e.target.value)}
                              className="w-full pl-8 pr-3 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                            />
                         </div>
                         <div className="relative flex-1">
                            <input
                              type="number"
                              placeholder="Max"
                              value={budgetMax}
                              onChange={(e) => setBudgetMax(e.target.value)}
                              className="w-full pl-8 pr-3 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                            />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Final Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={createJob}
                  disabled={isLoading}
                  className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 group relative overflow-hidden mt-8"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Project Request</span>
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.button>
              </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateJob;
