import { useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Star,
  MessageSquare,
  TrendingUp,
  Eye,
  Globe,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBrand } from "@/store/slices/brandDashboardSlice";

export default function BrandOverview() {
  const dispatch = useAppDispatch();
  const { brand, isLoading, error } = useAppSelector(
    (s) => s.brandDashboard,
  );
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (user?.brand_id && !brand) {
      dispatch(fetchBrand(user.brand_id));
    }
  }, [dispatch, user?.brand_id, brand]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-60 bg-gray-100 rounded-xl" />
          <div className="h-60 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => user?.brand_id && dispatch(fetchBrand(user.brand_id))}
            className="text-sm text-violet-600 hover:underline cursor-pointer"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  // No brand linked
  if (!brand) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No brand data available.</p>
          <p className="text-sm text-gray-400 mt-1">
            Please complete your brand registration first.
          </p>
        </CardContent>
      </Card>
    );
  }

  const metrics = brand.metrics || {
    total_products: 0,
    total_orders: 0,
    avg_rating: 0,
    total_reviews: 0,
  };

  const statCards = [
    {
      label: "Total Products",
      value: metrics.total_products,
      icon: Package,
      color: "text-violet-600 bg-violet-50",
      trend: null,
    },
    {
      label: "Total Orders",
      value: metrics.total_orders,
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50",
      trend: null,
    },
    {
      label: "Avg Rating",
      value: metrics.avg_rating > 0 ? metrics.avg_rating.toFixed(1) : "—",
      icon: Star,
      color: "text-amber-600 bg-amber-50",
      trend: null,
    },
    {
      label: "Total Reviews",
      value: metrics.total_reviews,
      icon: MessageSquare,
      color: "text-emerald-600 bg-emerald-50",
      trend: null,
    },
  ];

  const productCount =
    (brand as unknown as { products?: unknown[] }).products?.length ?? 0;
  const postCount =
    (brand as unknown as { posts?: unknown[] }).posts?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Welcome back, {user?.username || "there"}!
        </h1>
        <p className="text-sm text-gray-500">
          Here's what's happening with your brand today
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="py-5 hover:shadow-md transition-shadow">
              <CardContent className="px-5 py-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Brand Info + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Brand Profile</CardTitle>
            <CardDescription>
              Your public brand information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-4">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {brand.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {brand.name}
                </h3>
                <span
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full mt-1 ${
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
                      ? "Pending Review"
                      : brand.status?.replace("_", " ")}
                </span>
                {brand.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Contact & Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {brand.contact_info?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {brand.contact_info.email}
                </div>
              )}
              {brand.contact_info?.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {brand.contact_info.phone}
                </div>
              )}
              {brand.website_url && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a
                    href={brand.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline truncate"
                  >
                    {brand.website_url.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {brand.social_media?.instagram && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <a
                    href={brand.social_media.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:underline truncate"
                  >
                    Instagram
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Current brand activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Active Products</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {productCount}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Active Posts</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {postCount}
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Verification</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    brand.verification_status || brand.is_verified
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {brand.verification_status || brand.is_verified
                    ? "Verified"
                    : "Pending"}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    brand.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {brand.status?.replace("_", " ")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
