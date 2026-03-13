//provider dashboard my bids
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import { DollarSign, MapPin, Briefcase, Clock, CheckCircle, XCircle, Loader2, Star } from "lucide-react";

function MyBids() {
  const [bids, setBids] = useState([]); // store list of bids from server
  const [loading, setLoading] = useState(true); //controls loading spinner
  const [filter, setFilter] = useState("ALL"); //possible values: ALL, PENDING, ACCEPTED, REJECTED, COMPLETED 

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    const token = localStorage.getItem("token");
    const query = `{
      myBids {
        id
        jobId
        bidPrice
        message
        status
        job {
          id serviceType description city state budgetMin budgetMax status
          review { rating comment }
        }
      }
    }`;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );
      setBids(res.data.data.myBids);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBids = filter === "ALL"
    ? bids
    : filter === "COMPLETED"
      ? bids.filter(b => b.job?.status === "COMPLETED")
      : bids.filter(b => b.status === filter);

  const statusConfig = {
    PENDING: { label: "Pending", icon: Clock, color: "bg-amber-50 text-amber-700 border-amber-200" },
    ACCEPTED: { label: "Accepted", icon: CheckCircle, color: "bg-green-50 text-green-700 border-green-200" },
    REJECTED: { label: "Rejected", icon: XCircle, color: "bg-red-50 text-red-600 border-red-200" },
  };

  // counts bids for each status
  const counts = {
    ALL: bids.length,
    PENDING: bids.filter(b => b.status === "PENDING").length,
    ACCEPTED: bids.filter(b => b.status === "ACCEPTED").length,
    REJECTED: bids.filter(b => b.status === "REJECTED").length,
    COMPLETED: bids.filter(b => b.job?.status === "COMPLETED").length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Bids</h1>
          <p className="text-zinc-600">Track all your bids and their status</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { key: "ALL", label: "Total", value: counts.ALL, color: "bg-zinc-50 border-zinc-200" },
            { key: "PENDING", label: "Pending", value: counts.PENDING, color: "bg-amber-50 border-amber-200" },
            { key: "ACCEPTED", label: "Accepted", value: counts.ACCEPTED, color: "bg-green-50 border-green-200" },
            { key: "REJECTED", label: "Rejected", value: counts.REJECTED, color: "bg-red-50 border-red-200" },
            { key: "COMPLETED", label: "Completed", value: counts.COMPLETED, color: "bg-zinc-50 border-zinc-200" },
          ].map(({ key, label, value, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`p-4 rounded-xl border text-left transition-all ${
                filter === key ? `${color} ring-2 ring-zinc-900/10` : "bg-white border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-zinc-900">{value}</p>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-zinc-400" size={32} />
          </div>
        ) : filteredBids.length === 0 ? (
          <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
            <Briefcase className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
            <p className="text-zinc-600">
              {filter === "ALL" ? "No bids placed yet. Browse jobs to get started!" : `No ${filter.toLowerCase()} bids`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBids.map((bid) => {
              const config = statusConfig[bid.status] || statusConfig.PENDING;
              const StatusIcon = config.icon;
              return (
                <div
                  key={bid.id}
                  className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:border-zinc-300 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">
                          <Briefcase size={12} strokeWidth={2} />
                          {bid.job?.serviceType || "Service"}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
                          <StatusIcon size={12} strokeWidth={2} />
                          {config.label}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-zinc-500">Your bid</p>
                        <p className="text-lg font-bold text-zinc-900">₹{bid.bidPrice}</p>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-700 mb-3 line-clamp-2">
                      {bid.job?.description || "Job description not available"}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {bid.job?.city}, {bid.job?.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        Budget: ₹{bid.job?.budgetMin}-{bid.job?.budgetMax}
                      </span>
                    </div>

                    {bid.message && (
                      <div className="mt-3 pt-3 border-t border-zinc-100">
                        <p className="text-xs text-zinc-500 mb-1">Your message</p>
                        <p className="text-sm text-zinc-600 italic">"{bid.message}"</p>
                      </div>
                    )}

                    {/* Review section for completed jobs */}
                    {bid.job?.status === "COMPLETED" && bid.job?.review && (
                      <div className="mt-3 pt-3 border-t border-zinc-100 bg-amber-50/50 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold text-zinc-900">Customer Review</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={star <= bid.job.review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-300"}
                            />
                          ))}
                          <span className="text-sm font-medium text-zinc-700 ml-1">{bid.job.review.rating}/5</span>
                        </div>
                        {bid.job.review.comment && (
                          <p className="text-sm text-zinc-600 italic">"{bid.job.review.comment}"</p>
                        )}
                      </div>
                    )}

                    {bid.job?.status === "COMPLETED" && !bid.job?.review && (
                      <div className="mt-3 pt-3 border-t border-zinc-100">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full">
                          <CheckCircle size={12} />
                          Job Completed — No review yet
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyBids;
