import { useState } from "react";
import axios from "axios";
import config from "../config";
import DashboardLayout from "../layout/DashboardLayout";
import { Search, DollarSign, MessageSquare, UserCheck } from "lucide-react";

function ViewBids() {
  const [jobId, setJobId] = useState("");
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingBid, setSelectingBid] = useState(null);

  const fetchBids = async () => {
    if (!jobId) {
      alert("Please enter a job ID");
      return;
    }

    setIsLoading(true);

    const query = `
  {
   bids(jobId:${jobId}){
    id
    bidPrice
    message
   }
  }
  `;

    try {
      const res = await axios.post(config.API_URL, { query });
      setBids(res.data.data.bids);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch bids. Please check the job ID.");
      setBids([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBid = async (bidId) => {
    setSelectingBid(bidId);

    const query = `
  mutation{
   selectBid(bidId:${bidId}){
    id
   }
  }
  `;

    try {
      await axios.post(config.API_URL, { query });
      alert("Provider selected successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to select provider. Please try again.");
    } finally {
      setSelectingBid(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">View Bids</h1>
          <p className="text-zinc-600">
            Review bids from providers and select the best one
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
          <label className="block text-sm font-medium text-zinc-900 mb-3">
            Enter Job ID
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Job ID"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-colors"
            />
            <button
              onClick={fetchBids}
              disabled={isLoading}
              className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search size={16} strokeWidth={1.5} />
              {isLoading ? "Loading..." : "Load Bids"}
            </button>
          </div>
        </div>

        {/* Bids List */}
        {bids.length === 0 ? (
          jobId && !isLoading && (
            <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
              <MessageSquare className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
              <p className="text-zinc-600">No bids found for this job</p>
            </div>
          )
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">
              Received Bids ({bids.length})
            </h2>
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="bg-white rounded-xl border border-zinc-200 p-6 hover:border-zinc-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  {/* Bid Price */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <DollarSign className="text-green-600" size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-600">Bid Amount</p>
                      <p className="text-xl font-bold text-zinc-900">₹{bid.bidPrice}</p>
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => selectBid(bid.id)}
                    disabled={selectingBid === bid.id}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <UserCheck size={16} strokeWidth={1.5} />
                    {selectingBid === bid.id ? "Selecting..." : "Select Provider"}
                  </button>
                </div>

                {/* Message */}
                <div className="pt-4 border-t border-zinc-100">
                  <p className="text-xs font-medium text-zinc-600 mb-2 flex items-center gap-1.5">
                    <MessageSquare size={12} strokeWidth={1.5} />
                    Provider Message
                  </p>
                  <p className="text-sm text-zinc-700">{bid.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ViewBids;
