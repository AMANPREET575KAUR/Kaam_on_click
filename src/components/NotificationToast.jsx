//privider notification for new jobs in their area of expertise, with option to view job details or dismiss notification
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
          "http://localhost:4000/graphql",
          { query },
          { headers: { authorization: token } }
        );

        const jobs = res.data.data?.newJobsForProvider || [];
        
        // notifcation that dismissed
        const dismissed = JSON.parse(localStorage.getItem("dismissedNotifs") || "[]");
        // rather than dismissed,new
        const newJobs = jobs.filter((j) => !dismissed.includes(String(j.id)));

        // Show max 3 at a time
        setNotifications(newJobs.slice(0, 3));
      } catch (error) {
        // if api fails
      }
    };

    fetchNewJobs();//calling function

    // check for new jobs every min
    const interval = setInterval(fetchNewJobs, 60000);
    return () => clearInterval(interval);
  }, [token, userRole]);

  // get old dismissed
  const dismissNotification = (jobId) => {
    const dismissed = JSON.parse(localStorage.getItem("dismissedNotifs") || "[]");
    //add new dismissed
    dismissed.push(String(jobId));
    localStorage.setItem("dismissedNotifs", JSON.stringify(dismissed));
    setNotifications((prev) => prev.filter((n) => n.id !== jobId));
  };

  const handleClick = (jobId) => {
    dismissNotification(jobId);
    navigate("/job-feed");
  };
  // hide component if not needed
  if (userRole !== "PROVIDER" || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {notifications.map((job) => (// loop through each notification
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
                  {/* cleaner in rajpura,punjab */}
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
