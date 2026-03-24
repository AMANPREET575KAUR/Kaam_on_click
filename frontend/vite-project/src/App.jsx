import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignupCustomer from "./pages/SignupCustomer";
import SignupProvider from "./pages/SignupProvider";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import JobFeed from "./pages/JobFeed";
import ViewBids from "./pages/ViewBids";
import MyBids from "./pages/MyBids";
import ProviderProfile from "./pages/ProviderProfile";
import CustomerProfile from "./pages/CustomerProfile";
import Settings from "./pages/Settings";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./components/protectedRoutes";
import CompleteCustomerProfile from "./pages/CompleteCustomerProfile";
import CompleteProviderProfile from "./pages/CompleteProviderProfile";
import ForgotPassword from "./pages/ForgotPassword";

function CompleteProfileRouter() {
  const role = localStorage.getItem("userRole");
  return role === "PROVIDER" ? <CompleteProviderProfile /> : <CompleteCustomerProfile />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfileRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute>
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job-feed"
          element={
            <ProtectedRoute>
              <JobFeed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-bids"
          element={
            <ProtectedRoute>
              <ViewBids />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bids"
          element={
            <ProtectedRoute>
              <MyBids />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <ProviderProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer-profile"
          element={
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;