import { useEffect, useState } from "react";
import { database } from "../config/firebase";
import { ref, onValue, off } from "firebase/database";

export function useJobNotifications(userState) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userState) return;

    // Listen to jobs in provider's state
    const jobsRef = ref(database, `notifications/${userState}`);

    onValue(jobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jobList = Object.values(data).reverse(); // latest first
        setNotifications(jobList);
        setUnreadCount(jobList.filter(j => !j.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    // Cleanup listener on unmount
    return () => off(jobsRef);
  }, [userState]);

  return { notifications, unreadCount };
}