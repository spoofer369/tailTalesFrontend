import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  UserCog,
  LogOut,
  Shield,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "brands",
    label: "Brands",
    icon: Building,
    path: "/admin/dashboard/brands",
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    path: "/admin/dashboard/customers",
  },
  { id: "team", label: "Team", icon: UserCog, path: "/admin/dashboard/team" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") return currentPath === path;
    return currentPath.startsWith(path);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Vividly</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm cursor-pointer ${
                  active
                    ? "bg-violet-50 text-violet-700 font-medium border border-violet-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.username || "Admin"}
            </div>
            <div className="text-xs text-gray-500">Super Admin</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
