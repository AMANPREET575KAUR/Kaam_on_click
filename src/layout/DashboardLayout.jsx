import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NotificationToast from "../components/NotificationToast";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <Header />
      <NotificationToast />
      <main className="ml-64 mt-16 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;