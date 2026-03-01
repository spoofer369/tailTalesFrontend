import { useEffect } from "react";
import { Building, Users, Package, Clock, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchDashboardStats } from "@/store/slices/adminSlice";

export default function AdminOverview() {
  const dispatch = useAppDispatch();
  const { stats, statsLoading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const statCards = [
    {
      label: "Total Brands",
      value: stats?.totalBrands ?? "—",
      icon: Building,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Pending KYC",
      value: stats?.pendingKYC ?? "—",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Active Customers",
      value: stats?.activeCustomers ?? "—",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Products Listed",
      value: stats?.totalProducts ?? "—",
      icon: Package,
      color: "text-violet-600 bg-violet-50",
    },
  ];

  if (statsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Platform overview and key metrics
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two cards: Recent Brands + Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Brand Signups */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Recent Brand Signups
          </h2>
          <div className="space-y-3">
            {stats?.recentBrands && stats.recentBrands.length > 0 ? (
              stats.recentBrands.map((brand) => (
                <div
                  key={brand.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {brand.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {brand.status?.replace("_", " ") || "Active"}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      brand.status === "active"
                        ? "bg-emerald-50 text-emerald-700"
                        : brand.status === "pending_review"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {brand.status === "active"
                      ? "Active"
                      : brand.status === "pending_review"
                        ? "Pending"
                        : brand.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                No brands yet
              </p>
            )}
          </div>
        </div>

        {/* Platform Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Platform Activity
          </h2>
          <div className="space-y-4">
            {[
              { label: "Total Brands", value: stats?.totalBrands || 0 },
              { label: "Products Listed", value: stats?.totalProducts || 0 },
              { label: "Active Customers", value: stats?.activeCustomers || 0 },
              { label: "Pending KYC", value: stats?.pendingKYC || 0 },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-gray-500">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
