//job create karne ka page, customer ke liye, form with validation, submit button, and success/error messages
import { useState } from "react";// to store form data
import axios from "axios";//http libraary to create api calls
import DashboardLayout from "../layout/DashboardLayout";
import { Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";

function CreateJob() {//react fuctional component,create jobs and return jsx
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);//when job is submitting

  const createJob = async () => { //function to create job
      const token = localStorage.getItem("token");

    if (!service || !description || !address || !city || !state || !budgetMin || !budgetMax || !jobDate) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);//show in button posting..

    //graphql mutation to create data,update,delete
    const query = `
    mutation {  
      createJob(
        serviceType:"${service}" //sending this all to backend
        description:"${description}"
        address:"${address}"
        city:"${city}" 
        state:"${state}"
        budgetMin:${budgetMin}
        budgetMax:${budgetMax}
        date:"${jobDate}"
      ){
        id   // backend create job and return id
      }
    }
    `;

    //sending request to backend using axios,post method,graphql endpoint,query in body,token in header for authentication
    try {
      await axios.post(
        "http://localhost:4000/graphql",
        { query },
        {
          headers: {
            authorization: token,
          },
        }
      );
      alert("Job posted successfully!");
      
      // Reset form
      setService("");
      setDescription("");
      setAddress("");
      setCity("");
      setState("");
      setBudgetMin("");
      setBudgetMax("");
      setJobDate("");
    } catch (error) {
      console.log(error);
      alert("Failed to post job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>  
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Create Job</h1>
          <p className="text-zinc-600">
            Post a new service request and get bids from providers
          </p>
        </div>

        {/* form */}
        <div className="bg-white rounded-xl border border-zinc-200 p-8">
          <div className="space-y-6">
            {/* service type */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Service Type
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                  strokeWidth={1.5}
                />
               {/* to select service */}
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                >
                  <option value="">Select Service</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Painting">Painting</option>
                  <option value="AC Repair">AC Repair</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Job Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the work you need done..."
                rows="4"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors resize-none"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  State
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                    strokeWidth={1.5}
                  />
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                  >
                    <option value="">Select State</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="UP">UP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-zinc-900 mb-2">
                Date & Time Needed
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  size={18}
                  strokeWidth={1.5}
                />
                <input
                  type="datetime-local"
                  value={jobDate}
                  onChange={(e) => setJobDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                />
              </div>
            </div>

            {/* Budget Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Minimum Budget (₹)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                    strokeWidth={1.5}
                  />
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Min"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 mb-2">
                  Maximum Budget (₹)
                </label>
                <div className="relative">
                  <DollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    size={18}
                    strokeWidth={1.5}
                  />
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Max"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={createJob}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateJob;