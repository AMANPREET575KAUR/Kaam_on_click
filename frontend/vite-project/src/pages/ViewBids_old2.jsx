import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { DollarSign, MessageSquare, UserCheck, Briefcase, MapPin, Star, Award, Loader2 } from "lucide-react";

function ViewBids() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingBid, setSelectingBid] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);

  const fetchMyJobs = async () => {
    const token = localStorage.getItem("token");

    const query = `
    {
      myJobs {
        id
        serviceType
        description
        city
        state
        budgetMin
        budgetMax
        status
      }
    }
    `;

    try {
      const res = await axios.post(
        config.API_URL,
        { query },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setJobs(res.data.data.myJobs);
    } catch (error) {
      console.log(error);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchBids = async (jobId) => {
    setSelectedJob(jobId);
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const query = `
  {
   bids(jobId: ${jobId}) {
    id
    jobId
    bidPrice
    message
    provider {
      id
      name
      email
      phone
      state
      profile {
        services
        experienceYears
        description
        city
        rating
      }
    }
   }
  }
  `;

    try {
      const res = await axios.post(
        config.API_URL,
        { query },
        { headers: { authorization: token } }
      );
      setBids(res.data.data.bids);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch bids.");
      setBids([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBid = async (bidId) => {
    const token = localStorage.getItem("token");
    setSelectingBid(bidId);

    const query = `
  mutation{
   selectBid(bidId:${bidId}){
    id
   }
  }
  `;

    try {
      const res = await axios.post(
        config.API_URL,
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
      alert("Provider selected successfully!");
      fetchMyJobs();
      setBids([]);
      setSelectedJob(null);
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to select provider. Please try again.");
    } finally {
      setSelectingBid(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Jobs & Bids</h1>
          <p className="text-zinc-600">
            View your posted jobs and review bids from providers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* My Jobs - Left Panel */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Your Posted Jobs
            </h2>
            {jobsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-zinc-400" size={28} />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-zinc-200 p-8 text-center">
                <Briefcase className="mx-auto mb-3 text-zinc-300" size={36} strokeWidth={1.5} />
                <p className="text-zinc-600 text-sm">No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedJob === job.id
                        ? "border-zinc-900 shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                    onClick={() => fetchBids(job.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">
                        {job.serviceType}
                      </span>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        job.status === "OPEN" ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-700"
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 mb-2 line-clamp-2">{job.description}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {job.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        ₹{job.budgetMin}-{job.budgetMax}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bids - Right Panel */}
          <div className="lg:col-span-3">
            {!selectedJob ? (
              <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center h-full flex items-center justify-center">
                <div>
                  <MessageSquare className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
                  <p className="text-zinc-600">Select a job to view bids</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Received Bids {bids.length > 0 && `(${bids.length})`}
                </h2>
                {isLoading ? (
                  <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                    <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto" />
                  </div>
                ) : bids.length === 0 ? (
                  <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
                    <MessageSquare className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
                    <p className="text-zinc-600">No bids received yet</p>
                  </div>
                ) : (
                  bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
                    >
                      {/* Provider Header */}
                      <div className="bg-zinc-50 p-5 border-b border-zinc-200">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold shrink-0">
                            {bid.provider.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-zinc-900 mb-1">
                              {bid.provider.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 mb-2">
                              <span className="flex items-center gap-1">
                                <MapPin size={11} />
                                {bid.provider.profile?.city}
                              </span>
                              <span className="flex items-center gap-1">
                                <Award size={11} />
                                {bid.provider.profile?.experienceYears}+ yrs
                              </span>
                              <span className="flex items-center gap-1">
                                <Star size={11} fill="currentColor" />
                                {bid.provider.profile?.rating || 5.0}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {bid.provider.profile?.services?.split(",").slice(0, 3).map((service, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-700 text-xs rounded"
                                >
                                  {service.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bid Details */}
                      <div className="p-5">
                        {/* Bid Amount & Action */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-100">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                              <DollarSign className="text-green-600" size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-zinc-600">Bid Amount</p>
                              <p className="text-xl font-bold text-zinc-900">₹{bid.bidPrice}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => selectBid(bid.id)}
                            disabled={selectingBid === bid.id || jobs.find(j => j.id === selectedJob)?.status !== "OPEN"}
                            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <UserCheck size={16} strokeWidth={1.5} />
                            {selectingBid === bid.id ? "Selecting..." : 
                             jobs.find(j => j.id === selectedJob)?.status !== "OPEN" ? "Already Assigned" : "Select"}
                          </button>
                        </div>

                        {/* Message */}
                        <div className="mb-4">
                          <p className="text-xs font-medium text-zinc-600 mb-2 flex items-center gap-1.5">
                            <MessageSquare size={12} strokeWidth={1.5} />
                            Message
                          </p>
                          <p className="text-sm text-zinc-700">{bid.message}</p>
                        </div>

                        {/* Contact Info */}
                        <div className="pt-3 border-t border-zinc-100">
                          <p className="text-xs font-medium text-zinc-600 mb-2">Contact</p>
                          <div className="flex flex-wrap gap-3 text-xs text-zinc-600">
                            <span>{bid.provider.email}</span>
                            <span>{bid.provider.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewBids;

