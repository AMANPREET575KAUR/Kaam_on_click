//customer my jobs and bids
import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layout/DashboardLayout";
import {
  DollarSign, MessageSquare, UserCheck, Briefcase, MapPin,
  Star, Award, Loader2, Eye, EyeOff, CheckCircle2, X, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ViewBids() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectingBid, setSelectingBid] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Profile modal
  const [profileModal, setProfileModal] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Review modal
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchMyJobs = async () => {
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
        date
        status
        assignedTo
        assignedProvider {
          id
          name
          email
          phone
          state
          isPublic
          language
          profile {
            services
            experienceYears
            description
            city
            rating
            totalReviews
            profilePicture
          }
        }
        review {
          id
          rating
          comment
        }
        createdAt
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
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

    const query = `
    {
      bids(jobId: ${jobId}) {
        id
        jobId
        bidPrice
        message
        status
        provider {
          id
          name
          email
          phone
          state
          isPublic
          language
          profile {
            services
            experienceYears
            description
            city
            rating
            totalReviews
            profilePicture
          }
        }
      }
    }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );
      setBids(res.data.data.bids);
    } catch (error) {
      console.log(error);
      setBids([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBid = async (bidId) => {
    setSelectingBid(bidId);

    const query = `
      mutation {
        selectBid(bidId: ${bidId}) { id }
      }
    `;

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
      alert("Provider selected successfully!");
      fetchMyJobs();
      setBids([]);
      setSelectedJob(null);
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to select provider.");
    } finally {
      setSelectingBid(null);
    }
  };

  const viewProfile = async (providerId) => {
    setProfileLoading(true);
    setProfileError("");

    const query = `
      {
        providerProfile(userId: ${providerId}) {
          id
          name
          email
          phone
          state
          isPublic
          language
          profile {
            services
            experienceYears
            description
            city
            rating
            totalReviews
            profilePicture
          }
        }
      }
    `;

    try {
      const res = await axios.post(
        "http://localhost:4000/graphql",
        { query },
        { headers: { authorization: token } }
      );
      if (res.data.errors) {
        setProfileError(res.data.errors[0].message);
        setProfileModal({ private: true });
      } else {
        setProfileModal(res.data.data.providerProfile);
      }
    } catch (error) {
      const msg = error.response?.data?.errors?.[0]?.message || "Failed to load profile";
      if (msg.includes("private")) {
        setProfileModal({ private: true });
      } else {
        setProfileError(msg);
        setProfileModal({ private: true, errorMsg: msg });
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const markJobCompleted = async () => {
    if (reviewRating < 1 || reviewRating > 5) {
      alert("Please give a rating between 1 and 5 stars");
      return;
    }

    setReviewLoading(true);

    const query = `
      mutation {
        markJobCompleted(
          jobId: ${reviewModal.id}
          rating: ${reviewRating}
          comment: "${reviewComment.replace(/"/g, '\\"')}"
        ) { id status }
      }
    `;

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
      alert("Job marked as completed! Thank you for your review.");
      setReviewModal(null);
      setReviewRating(0);
      setReviewComment("");
      fetchMyJobs();
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.[0]?.message;
      alert(errorMsg || "Failed to complete job.");
    } finally {
      setReviewLoading(false);
    }
  };

  const currentJob = jobs.find((j) => j.id === selectedJob);

  // Separate jobs by status
  const openJobs = jobs.filter((j) => j.status === "OPEN");
  const assignedJobs = jobs.filter((j) => j.status === "ASSIGNED" || j.status === "IN_PROGRESS");
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">My Jobs & Bids</h1>
          <p className="text-zinc-600">View your posted jobs, manage bids, and track progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Panel — Jobs */}
          <div className="lg:col-span-2 space-y-6">
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
              <>
                {/* Open Jobs */}
                {openJobs.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Open Jobs</h2>
                    <div className="space-y-3">
                      {openJobs.map((job) => (
                        <JobCard key={job.id} job={job} selectedJob={selectedJob} onClick={() => fetchBids(job.id)} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Assigned / Selected Candidates */}
                {assignedJobs.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Selected Candidates</h2>
                    <div className="space-y-3">
                      {assignedJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl border border-zinc-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">{job.serviceType}</span>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700">ASSIGNED</span>
                          </div>
                          <p className="text-sm text-zinc-700 mb-3 line-clamp-2">{job.description}</p>

                          {/* Assigned Provider */}
                          {job.assignedProvider && (
                            <div className="bg-zinc-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                  {job.assignedProvider.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-zinc-900 text-sm">{job.assignedProvider.name}</p>
                                  <p className="text-xs text-zinc-500">{job.assignedProvider.phone}</p>
                                </div>
                                <button
                                  onClick={() => viewProfile(job.assignedProvider.id)}
                                  className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-1"
                                >
                                  <Eye size={12} /> Profile
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Mark Complete Button */}
                          <button
                            onClick={() => setReviewModal(job)}
                            className="w-full px-4 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={16} />
                            Mark as Completed
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Jobs */}
                {completedJobs.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">Completed Jobs</h2>
                    <div className="space-y-3">
                      {completedJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-xl border border-zinc-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">{job.serviceType}</span>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">COMPLETED</span>
                          </div>
                          <p className="text-sm text-zinc-700 mb-3 line-clamp-2">{job.description}</p>

                          {/* Provider who completed the job */}
                          {job.assignedProvider && (
                            <div className="bg-zinc-50 rounded-lg p-3 mb-3">
                              <p className="text-xs text-zinc-500 mb-2">Completed by</p>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                  {job.assignedProvider.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-zinc-900 text-sm">{job.assignedProvider.name}</p>
                                  <p className="text-xs text-zinc-500">{job.assignedProvider.phone}</p>
                                </div>
                                <button
                                  onClick={() => viewProfile(job.assignedProvider.id)}
                                  className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-1"
                                >
                                  <Eye size={12} /> Profile
                                </button>
                              </div>
                            </div>
                          )}

                          {job.review && (
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={12} fill={i < job.review.rating ? "currentColor" : "none"} className={i < job.review.rating ? "text-amber-500" : "text-zinc-300"} />
                                ))}
                              </div>
                              <span>Your review: "{job.review.comment}"</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Panel — Bids */}
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
                    <div key={bid.id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                      {/* Provider Header */}
                      <div className="bg-zinc-50 p-5 border-b border-zinc-200">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold shrink-0">
                            {bid.provider.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-zinc-900 mb-1">{bid.provider.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 mb-2">
                              <span className="flex items-center gap-1"><MapPin size={11} />{bid.provider.profile?.city}</span>
                              <span className="flex items-center gap-1"><Award size={11} />{bid.provider.profile?.experienceYears}+ yrs</span>
                              <span className="flex items-center gap-1"><Star size={11} fill="currentColor" />{bid.provider.profile?.rating || 0} ({bid.provider.profile?.totalReviews || 0})</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {bid.provider.profile?.services?.split(",").slice(0, 3).map((service, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-700 text-xs rounded">{service.trim()}</span>
                              ))}
                            </div>
                          </div>
                          {/* View Profile Button */}
                          <button
                            onClick={() => viewProfile(bid.provider.id)}
                            className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors flex items-center gap-1 shrink-0"
                          >
                            <Eye size={12} /> View Profile
                          </button>
                        </div>
                      </div>

                      {/* Bid Details */}
                      <div className="p-5">
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

                          {bid.status === "ACCEPTED" ? (
                            <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">Accepted</span>
                          ) : bid.status === "REJECTED" ? (
                            <span className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">Rejected</span>
                          ) : bid.status === "CANCELLED" ? (
                            <span className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">Cancelled</span>
                          ) : (
                            <button
                              onClick={() => selectBid(bid.id)}
                              disabled={selectingBid === bid.id || currentJob?.status !== "OPEN"}
                              className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                              <UserCheck size={16} strokeWidth={1.5} />
                              {selectingBid === bid.id ? "Selecting..." : currentJob?.status !== "OPEN" ? "Already Assigned" : "Select"}
                            </button>
                          )}
                        </div>

                        <div className="mb-4">
                          <p className="text-xs font-medium text-zinc-600 mb-2 flex items-center gap-1.5">
                            <MessageSquare size={12} strokeWidth={1.5} /> Message
                          </p>
                          <p className="text-sm text-zinc-700">{bid.message}</p>
                        </div>

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

      {/* ─── Profile Modal ─── */}
      <AnimatePresence>
        {profileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setProfileModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-zinc-900">Provider Profile</h3>
                <button onClick={() => setProfileModal(null)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={20} />
                </button>
              </div>

              {profileModal.private ? (
                <div className="text-center py-8">
                  <EyeOff className="mx-auto mb-3 text-zinc-300" size={40} />
                  <p className="font-medium text-zinc-900 mb-1">Private Profile</p>
                  <p className="text-sm text-zinc-500">This provider has set their profile to private</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Photo + Name */}
                  <div className="flex items-center gap-4">
                    {profileModal.profile?.profilePicture ? (
                      <img src={profileModal.profile.profilePicture} alt="" className="w-16 h-16 rounded-full object-cover border border-zinc-200" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xl font-bold">
                        {profileModal.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-zinc-900 text-lg">{profileModal.name}</h4>
                      <p className="text-sm text-zinc-500">{profileModal.profile?.city}, {profileModal.state}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.round(profileModal.profile?.rating || 0) ? "currentColor" : "none"} className={i < Math.round(profileModal.profile?.rating || 0) ? "text-amber-500" : "text-zinc-300"} />
                      ))}
                    </div>
                    <span className="text-sm text-zinc-600">{profileModal.profile?.rating || 0} ({profileModal.profile?.totalReviews || 0} reviews)</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Experience</span>
                      <span className="text-zinc-900 font-medium">{profileModal.profile?.experienceYears}+ years</span>
                    </div>
                    {profileModal.language && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Language</span>
                        <span className="text-zinc-900 font-medium">{profileModal.language}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Contact</span>
                      <span className="text-zinc-900 font-medium">{profileModal.phone}</span>
                    </div>
                  </div>

                  {/* Services */}
                  {profileModal.profile?.services && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-2">Services</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profileModal.profile.services.split(",").map((s, i) => (
                          <span key={i} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs rounded-full">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {profileModal.profile?.description && (
                    <div>
                      <p className="text-xs font-medium text-zinc-500 mb-1">About</p>
                      <p className="text-sm text-zinc-700">{profileModal.profile.description}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Review Modal ─── */}
      <AnimatePresence>
        {reviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setReviewModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-zinc-200 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-zinc-900">Complete Job & Review</h3>
                <button onClick={() => setReviewModal(null)} className="text-zinc-400 hover:text-zinc-600">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4 p-3 bg-zinc-50 rounded-lg">
                <p className="text-sm font-medium text-zinc-900">{reviewModal.serviceType}</p>
                <p className="text-xs text-zinc-500">{reviewModal.description}</p>
              </div>

              {/* Star Rating */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={star <= reviewRating ? "currentColor" : "none"}
                        className={star <= reviewRating ? "text-amber-500" : "text-zinc-300"}
                      />
                    </button>
                  ))}
                  {reviewRating > 0 && <span className="ml-2 text-sm text-zinc-600">{reviewRating}/5</span>}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Written Review</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this provider..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-colors resize-none"
                />
              </div>

              <button
                onClick={markJobCompleted}
                disabled={reviewLoading || reviewRating === 0}
                className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {reviewLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Mark Complete & Submit Review
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

function JobCard({ job, selectedJob, onClick }) {
  return (
    <div
      className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
        selectedJob === job.id ? "border-zinc-900 shadow-sm" : "border-zinc-200 hover:border-zinc-300"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-1 bg-zinc-900 text-white text-xs font-medium rounded-full">{job.serviceType}</span>
        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
          job.status === "OPEN" ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-700"
        }`}>
          {job.status}
        </span>
      </div>
      <p className="text-sm text-zinc-700 mb-2 line-clamp-2">{job.description}</p>
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><MapPin size={12} />{job.city}</span>
        <span className="flex items-center gap-1"><DollarSign size={12} />₹{job.budgetMin}-{job.budgetMax}</span>
      </div>
      {job.date && (
        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1.5">
          <Calendar size={12} />
          <span>{new Date(job.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {new Date(job.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      )}
    </div>
  );
}

export default ViewBids;
