import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  FileText,
  Users,
  Zap,
  MessageCircle,
  CreditCard,
  Building,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch, useAppSelector } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";

const mainNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/brand/dashboard",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    path: "/brand/dashboard/analytics",
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    path: "/brand/dashboard/products",
  },
  {
    id: "posts",
    label: "Posts",
    icon: FileText,
    path: "/brand/dashboard/posts",
  },
  {
    id: "leads",
    label: "Leads",
    icon: Users,
    path: "/brand/dashboard/leads",
  },
  {
    id: "sponsored",
    label: "Sponsored",
    icon: Zap,
    path: "/brand/dashboard/sponsored",
  },
  {
    id: "community",
    label: "Community",
    icon: MessageCircle,
    path: "/brand/dashboard/community",
  },
];

const bottomNavItems = [
  {
    id: "billing",
    label: "Billing",
    icon: CreditCard,
    path: "/brand/dashboard/billing",
  },
  {
    id: "brand",
    label: "Brand",
    icon: Building,
    path: "/brand/dashboard/brand",
  },
];

export default function BrandSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { brand } = useAppSelector((s) => s.brandDashboard);

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/brand/dashboard") return currentPath === path;
    return currentPath.startsWith(path);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/brand/login", { replace: true });
  };

  const renderNavItem = (item: (typeof mainNavItems)[0]) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    return (
      <button
        key={item.id}
        onClick={() => navigate(item.path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm cursor-pointer ${
          active
            ? "bg-violet-50 text-violet-700 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <Icon className={`w-[18px] h-[18px] ${active ? "text-violet-600" : ""}`} />
        {item.label}
      </button>
    );
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {brand?.logo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              className="w-9 h-9 rounded-lg object-cover"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Building className="w-4.5 h-4.5 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-gray-900 truncate">
              {brand?.name || "Vividly"}
            </h1>
            <p className="text-xs text-gray-400">Brand Platform</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {mainNavItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 pb-2">
        <Separator className="mb-2" />
        <div className="space-y-0.5">
          {bottomNavItems.map(renderNavItem)}
        </div>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-white">
              {user?.username?.charAt(0).toUpperCase() || "B"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.username || "Brand Owner"}
            </div>
            <div className="text-xs text-gray-400 capitalize">
              {user?.role?.replace("_", " ") || "Owner"}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
