import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./components/protectedRoutes";

import CompleteCustomerProfile from "./pages/CompleteCustomerProfile";
import CompleteProviderProfile from "./pages/CompleteProviderProfile";

function CompleteProfileRouter() {
  const role = localStorage.getItem("userRole");

  return role === "PROVIDER"
    ? <CompleteProviderProfile />
    : <CompleteCustomerProfile />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfileRouter />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;