import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBrand } from "@/store/slices/brandDashboardSlice";
import BrandSidebar from "@/components/brand/BrandSidebar";
import BrandOverview from "@/components/brand/BrandOverview";
import ComingSoonPlaceholder from "@/components/brand/ComingSoonPlaceholder";

const breadcrumbMap: Record<string, string> = {
  "/brand/dashboard": "Dashboard",
  "/brand/dashboard/analytics": "Analytics",
  "/brand/dashboard/products": "Products",
  "/brand/dashboard/posts": "Posts",
  "/brand/dashboard/leads": "Leads",
  "/brand/dashboard/sponsored": "Sponsored",
  "/brand/dashboard/community": "Community",
  "/brand/dashboard/billing": "Billing",
  "/brand/dashboard/brand": "Brand",
};

export default function BrandDashboardPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { brand } = useAppSelector((s) => s.brandDashboard);

  const currentPath = location.pathname;
  const currentLabel = breadcrumbMap[currentPath] || "Dashboard";

  // Fetch brand data on mount
  useEffect(() => {
    if (user?.brand_id && !brand) {
      dispatch(fetchBrand(user.brand_id));
    }
  }, [dispatch, user?.brand_id, brand]);

  return (
    <div className="flex h-screen bg-gray-50">
      <BrandSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Brand</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-gray-900 font-medium">{currentLabel}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route index element={<BrandOverview />} />
            <Route
              path="analytics"
              element={<ComingSoonPlaceholder title="Analytics" />}
            />
            <Route
              path="products"
              element={<ComingSoonPlaceholder title="Products management" />}
            />
            <Route
              path="posts"
              element={<ComingSoonPlaceholder title="Posts management" />}
            />
            <Route
              path="leads"
              element={<ComingSoonPlaceholder title="Leads management" />}
            />
            <Route
              path="sponsored"
              element={<ComingSoonPlaceholder title="Sponsored content" />}
            />
            <Route
              path="community"
              element={<ComingSoonPlaceholder title="Community" />}
            />
            <Route
              path="billing"
              element={<ComingSoonPlaceholder title="Billing" />}
            />
            <Route
              path="brand"
              element={<ComingSoonPlaceholder title="Brand settings" />}
            />
            <Route
              path="*"
              element={<Navigate to="/brand/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
