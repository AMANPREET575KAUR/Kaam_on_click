import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NotificationToast from "../components/NotificationToast";
import { motion, AnimatePresence } from "framer-motion";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <NotificationToast />
        <main className="flex-1 mt-20 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-72 transition-all duration-500">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;