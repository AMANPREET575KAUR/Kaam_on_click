import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import { X, Briefcase, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NotificationToast() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole !== "PROVIDER") return;

    const fetchNewJobs = async () => {
      try {
        const query = `
          {
            newJobsForProvider {
              id
              serviceType
              city
              state
              budgetMin
              budgetMax
              createdAt
            }
          }
        `;

        const res = await axios.post(
          config.API_URL,
          { query },
          { headers: { authorization: token } }
        );

        const jobs = res.data.data?.newJobsForProvider || [];
        
        // Only show notifications for jobs we haven't dismissed
        const dismissed = JSON.parse(localStorage.getItem("dismissedNotifs") || "[]");
        const newJobs = jobs.filter((j) => !dismissed.includes(String(j.id)));

        // Show max 3 at a time
        setNotifications(newJobs.slice(0, 3));
      } catch (error) {
        // Silently fail — notifications are non-critical
      }
    };

    fetchNewJobs();

    // Poll every 60 seconds for new jobs
    const interval = setInterval(fetchNewJobs, 60000);
    return () => clearInterval(interval);
  }, [token, userRole]);

  const dismissNotification = (jobId) => {
    const dismissed = JSON.parse(localStorage.getItem("dismissedNotifs") || "[]");
    dismissed.push(String(jobId));
    localStorage.setItem("dismissedNotifs", JSON.stringify(dismissed));
    setNotifications((prev) => prev.filter((n) => n.id !== jobId));
  };

  const handleClick = (jobId) => {
    dismissNotification(jobId);
    navigate("/job-feed");
  };

  if (userRole !== "PROVIDER" || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-xl border border-zinc-200 shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleClick(job.id)}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                <Briefcase size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">New Job Posted</p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {job.serviceType} in {job.city}, {job.state}
                </p>
                <p className="text-xs text-zinc-500 mt-1">₹{job.budgetMin} - ₹{job.budgetMax}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(job.id);
                }}
                className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 p-0.5"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-400">
              <span>Click to view</span>
              <ArrowRight size={10} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationToast;

