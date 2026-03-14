import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { MapPin, DollarSign, Briefcase } from "lucide-react";

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [bidPrices, setBidPrices] = useState({});
  const [loadingBids, setLoadingBids] = useState({});

  const fetchJobs = async () => {
    const query = `
    {
      jobs{
        id
        serviceType
        description
        city
        state
        budgetMin
        budgetMax
      }
    }
    `;

    const res = await axios.post(config.API_URL, { query });
    setJobs(res.data.data.jobs);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleBidChange = (jobId, value) => {
    setBidPrices({
      ...bidPrices,
      [jobId]: value,
    });
  };

  const placeBid = async (jobId) => {
    const price = bidPrices[jobId];

    if (!price) {
      alert("Enter bid price first");
      return;
    }

    setLoadingBids({ ...loadingBids, [jobId]: true });

    const query = `
    mutation {
      placeBid(
        jobId:${jobId}
        bidPrice:${price}
        message:"I can complete this job"
      ){
        id
      }
    }
    `;

    try {
      await axios.post(config.API_URL, { query });
      alert("Bid placed successfully!");
      setBidPrices({ ...bidPrices, [jobId]: "" });
    } catch (error) {
      console.log(error);
      alert("Failed to place bid. Please try again.");
    } finally {
      setLoadingBids({ ...loadingBids, [jobId]: false });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Job Feed</h1>
          <p className="text-zinc-600">
            Browse available jobs and place your bids
          </p>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <Briefcase className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
            <p className="text-zinc-600">No jobs available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 transition-colors flex flex-col"
              >
                {/* Service Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">
                    <Briefcase size={12} strokeWidth={2} />
                    {job.serviceType}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-700 mb-4 flex-1 line-clamp-3">
                  {job.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-zinc-600 mb-3">
                  <MapPin size={14} strokeWidth={1.5} />
                  <span>
                    {job.city}, {job.state}
                  </span>
                </div>

                {/* Budget */}
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-4 pb-4 border-b border-zinc-100">
                  <DollarSign size={14} strokeWidth={2} />
                  <span>
                    ₹{job.budgetMin} - ₹{job.budgetMax}
                  </span>
                </div>

                {/* Bid Input */}
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Enter your bid amount"
                    value={bidPrices[job.id] || ""}
                    onChange={(e) => handleBidChange(job.id, e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-colors"
                  />
                  <button
                    onClick={() => placeBid(job.id)}
                    disabled={loadingBids[job.id]}
                    className="w-full px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingBids[job.id] ? "Placing..." : "Place Bid"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default JobFeed;
