import { Routes, Route, Navigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminBrands from "@/components/admin/AdminBrands";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminUsers from "@/components/admin/AdminUsers";
import BrandKycReviewPage from "@/components/admin/BrandKycReviewPage";

const breadcrumbMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/brands": "Brands",
  "/admin/dashboard/customers": "Customers",
  "/admin/dashboard/team": "Team",
};

export default function AdminDashboardPage() {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentLabel =
    breadcrumbMap[currentPath] ||
    (currentPath.includes("/brands/") && currentPath.endsWith("/kyc")
      ? "Brand KYC Review"
      : "Dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with breadcrumb */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Admin</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-medium">{currentLabel}</span>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="brands/:id/kyc" element={<BrandKycReviewPage />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="team" element={<AdminUsers />} />
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
