import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";

import BrandLoginPage from "@/pages/auth/BrandLoginPage";
import BrandRegisterPage from "@/pages/auth/BrandRegisterPage";
import AdminLoginPage from "@/pages/auth/AdminLoginPage";
import AdminSignupPage from "@/pages/auth/AdminSignupPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import BrandDashboardPage from "@/pages/brand/BrandDashboardPage";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { ROUTES, BRAND_ALLOWED_ROLES } from "@/constant";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />


      <Route path={ROUTES.BRAND_LOGIN} element={<BrandLoginPage />} />
      <Route path={ROUTES.BRAND_REGISTER} element={<BrandRegisterPage />} />
      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
      <Route path={ROUTES.ADMIN_SIGNUP} element={<AdminSignupPage />} />

      {/* Brand Dashboard (Protected) */}
      <Route
        path={`${ROUTES.BRAND_DASHBOARD}/*`}
        element={
          <ProtectedRoute
            allowedRoles={[...BRAND_ALLOWED_ROLES]}
            redirectTo={ROUTES.BRAND_LOGIN}
          >
            <BrandDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard (Protected) */}
      <Route
        path={`${ROUTES.ADMIN_DASHBOARD}/*`}
        element={
          <ProtectedRoute
            allowedRoles={["super_admin"]}
            redirectTo={ROUTES.ADMIN_LOGIN}
          >
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
