//provider dashboard browse jobs

import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import { MapPin, DollarSign, Briefcase, Filter, CheckCircle, MessageSquare, XCircle, Calendar } from "lucide-react";

function JobFeed() {
  const [jobs, setJobs] = useState([]);
  const [bidPrices, setBidPrices] = useState({});
  const [bidMessages, setBidMessages] = useState({});
  const [loadingBids, setLoadingBids] = useState({});
  const [selectedService, setSelectedService] = useState("");
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [bidIdMap, setBidIdMap] = useState({});
  const [cancellingBids, setCancellingBids] = useState({});

  const serviceTypes = ["All", "Plumbing", "Electrician", "Carpenter", "Cleaning", "Painting", "AC Repair"];

  const fetchMyBids = async () => {
    const token = localStorage.getItem("token");
    const query = `{ myBids { id jobId status } }`;
    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );
      const bids = res.data.data.myBids;
      const ids = new Set(bids.filter(b => b.status !== "CANCELLED").map(b => String(b.jobId)));
      const map = {};
      bids.filter(b => b.status !== "CANCELLED").forEach(b => { map[String(b.jobId)] = b.id; });
      setAppliedJobIds(ids);
      setBidIdMap(map);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobs = async (serviceType = "") => {
    const token = localStorage.getItem("token");
    const serviceFilter = serviceType && serviceType !== "All" ? `serviceType: "${serviceType}"` : "";
    
    const query = `
    {
      jobs${serviceFilter ? `(${serviceFilter})` : ''}{
        id
        serviceType
        description
        city
        state
        budgetMin
        budgetMax
        date
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setJobs(res.data.data.jobs);
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to fetch jobs. Please try again.");
    }
  };

  useEffect(() => {
    fetchMyBids();
  }, []);

  useEffect(() => {
    fetchJobs(selectedService);
  }, [selectedService]);

  const handleBidChange = (jobId, value) => {
    setBidPrices({
      ...bidPrices,
      [jobId]: value,
    });
  };

  const handleMessageChange = (jobId, value) => {
    setBidMessages({
      ...bidMessages,
      [jobId]: value,
    });
  };

  const placeBid = async (jobId) => {
    const price = bidPrices[jobId];
    const message = bidMessages[jobId] || "I can complete this job professionally.";
    const token = localStorage.getItem("token");

    if (!price) {
      alert("Enter bid price first");
      return;
    }

    const job = jobs.find(j => j.id === jobId);
    if (price < job.budgetMin || price > job.budgetMax) {
      alert(`Bid must be between ₹${job.budgetMin} and ₹${job.budgetMax}`);
      return;
    }

    setLoadingBids({ ...loadingBids, [jobId]: true });

    const escapedMessage = message.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const query = `
    mutation {
      placeBid(
        jobId:${jobId}
        bidPrice:${price}
        message:"${escapedMessage}"
      ){
        id
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (res.data.errors) {
        alert(res.data.errors[0].message);
        return;
      }
      alert("Bid placed successfully!");
      setBidPrices({ ...bidPrices, [jobId]: "" });
      setBidMessages({ ...bidMessages, [jobId]: "" });
      setAppliedJobIds(prev => new Set([...prev, String(jobId)]));
      setBidIdMap(prev => ({ ...prev, [String(jobId)]: res.data.data.placeBid.id }));
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to place bid. Please try again.");
    } finally {
      setLoadingBids({ ...loadingBids, [jobId]: false });
    }
  };

  const cancelBid = async (jobId) => {
    const bidId = bidIdMap[String(jobId)];
    if (!bidId) return;
    const token = localStorage.getItem("token");
    setCancellingBids(prev => ({ ...prev, [jobId]: true }));

    const query = `mutation { cancelBid(bidId: ${bidId}) { id } }`;
    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );
      if (res.data.errors) {
        alert(res.data.errors[0].message);
        return;
      }
      setAppliedJobIds(prev => {
        const next = new Set(prev);
        next.delete(String(jobId));
        return next;
      });
      setBidIdMap(prev => {
        const next = { ...prev };
        delete next[String(jobId)];
        return next;
      });
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to cancel bid.");
    } finally {
      setCancellingBids(prev => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Job Feed</h1>
          <p className="text-zinc-600">
            Browse available jobs and place your bids
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter size={18} className="text-zinc-400" strokeWidth={1.5} />
              <span className="text-sm font-medium text-zinc-700">Filter by service:</span>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((service) => (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service === "All" ? "" : service)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      (service === "All" && !selectedService) || selectedService === service
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <Briefcase className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
            <p className="text-zinc-600">
              {selectedService ? `No ${selectedService} jobs available` : "No jobs available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const hasApplied = appliedJobIds.has(String(job.id));
              return (
                <div
                  key={job.id}
                  className={`bg-white rounded-xl border p-6 transition-colors flex flex-col ${
                    hasApplied
                      ? "border-green-200 bg-green-50/30"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {/* Service Badge + Applied Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">
                      <Briefcase size={12} strokeWidth={2} />
                      {job.serviceType}
                    </span>
                    {hasApplied && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        <CheckCircle size={12} strokeWidth={2} />
                        Applied
                      </span>
                    )}
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
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 mb-3">
                    <DollarSign size={14} strokeWidth={2} />
                    <span>
                      ₹{job.budgetMin} - ₹{job.budgetMax}
                    </span>
                  </div>

                  {/* Date & Time */}
                  {job.date && (
                    <div className="flex items-center gap-2 text-sm text-zinc-600 mb-4 pb-4 border-b border-zinc-100">
                      <Calendar size={14} strokeWidth={1.5} />
                      <span>
                        {new Date(job.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        {" at "}
                        {new Date(job.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                  {!job.date && <div className="mb-4 pb-4 border-b border-zinc-100" />}

                  {/* Bid section */}
                  {hasApplied ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                        <CheckCircle size={16} strokeWidth={1.5} />
                        Bid Submitted
                      </div>
                      <button
                        onClick={() => cancelBid(job.id)}
                        disabled={cancellingBids[job.id]}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle size={16} strokeWidth={1.5} />
                        {cancellingBids[job.id] ? "Cancelling..." : "Cancel Bid"}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder={`Enter bid (₹${job.budgetMin}-₹${job.budgetMax})`}
                        value={bidPrices[job.id] || ""}
                        onChange={(e) => handleBidChange(job.id, e.target.value)}
                        min={job.budgetMin}
                        max={job.budgetMax}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors"
                      />
                      <textarea
                        placeholder="Write a message to the customer..."
                        value={bidMessages[job.id] || ""}
                        onChange={(e) => handleMessageChange(job.id, e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors resize-none"
                      />
                      <button
                        onClick={() => placeBid(job.id)}
                        disabled={loadingBids[job.id]}
                        className="w-full px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingBids[job.id] ? "Placing..." : "Place Bid"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default JobFeed;
