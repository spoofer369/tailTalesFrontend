import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ConsumerAuthPage from "./pages/auth/ConsumerAuthPage";
import BrandLoginPage from "./pages/auth/BrandLoginPage";
import BrandRegisterPage from "./pages/auth/BrandRegisterPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAppDispatch } from "./store";
import { checkAuth } from "./store/slices/authSlice";

function App() {
  const dispatch = useAppDispatch();

  // Restore session on app startup if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<ConsumerAuthPage />} />
        <Route path="/brand/login" element={<BrandLoginPage />} />
        <Route path="/brand/register" element={<BrandRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin/dashboard/*"
          element={
            <ProtectedRoute
              allowedRoles={["super_admin"]}
              redirectTo="/admin/login"
            >
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
