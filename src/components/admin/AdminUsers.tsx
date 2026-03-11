import { useEffect, useState, useRef } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Plus,
  X,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchTeamUsers,
  updateUser,
  deleteUser,
  createUser,
} from "@/store/slices/adminSlice";

type AdminRole = "super_admin" | "brand_admin" | "brand_manager" | "brand_staff";

const roleDescriptions: Record<AdminRole, string> = {
  super_admin: "Full platform access with all permissions",
  brand_admin: "Manage brands, customers, and content",
  brand_manager: "Handle customer support and queries",
  brand_staff: "View-only access to analytics and reports",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  brand_admin: "Admin",
  brand_manager: "Support",
  brand_staff: "Analyst",
};

const roleBadgeColors: Record<string, string> = {
  super_admin: "bg-purple-100 text-purple-700 border-purple-200",
  brand_admin: "bg-indigo-100 text-indigo-700 border-indigo-200",
  brand_manager: "bg-blue-100 text-blue-700 border-blue-200",
  brand_staff: "bg-gray-100 text-gray-700 border-gray-200",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { teamUsers, teamLoading } = useAppSelector((s) => s.admin);

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phone_number: "",
    role: "brand_admin" as AdminRole,
  });
  const [addLoading, setAddLoading] = useState(false);

  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchTeamUsers());
  }, [dispatch]);

  const adminUsers = teamUsers;

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    if (openMenu !== null) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [openMenu]);

  // Close menu on scroll
  useEffect(() => {
    if (openMenu === null) return;
    const close = () => setOpenMenu(null);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [openMenu]);

  const toggleMenu = (
    userId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openMenu === userId) {
      setOpenMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 192 });
    setOpenMenu(userId);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await dispatch(updateUser({ id, data: { is_active: !currentStatus } })).unwrap();
      toast.success(currentStatus ? "User deactivated" : "User activated");
    } catch {
      toast.error("Failed to update user status");
    }
    setOpenMenu(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success("User removed successfully");
    } catch {
      toast.error("Failed to remove user");
    }
    setOpenMenu(null);
  };

  const handleAddUser = async () => {
    if (!newUser.username.trim()) return;
    if (!newUser.phone_number.trim()) return;
    setAddLoading(true);
    try {
      const [firstName, ...lastParts] = newUser.username.trim().split(" ");
      const lastName = lastParts.join(" ") || "";
      let phone = newUser.phone_number.trim().replace(/[\s\-()]/g, "");
      if (!phone.startsWith("+")) phone = `+91${phone}`;
      await dispatch(
        createUser({
          username: newUser.username.trim(),
          phone_number: phone,
          role: newUser.role,
          first_name: firstName,
          last_name: lastName,
        }),
      ).unwrap();
      toast.success(`Admin user added successfully!`);
      setShowAddUser(false);
      setNewUser({ username: "", email: "", phone_number: "", role: "brand_admin" });
      // Re-fetch to get fresh data with profile
      dispatch(fetchTeamUsers());
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message || "Failed to add user");
    } finally {
      setAddLoading(false);
    }
  };

  const menuUser =
    openMenu !== null ? teamUsers.find((u) => u.id === openMenu) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Team</h1>
          <p className="text-sm text-gray-500">
            Manage internal team members
          </p>
        </div>
        <Button
          onClick={() => setShowAddUser(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {teamLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : adminUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No team members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    User
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">
                    Last Active
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-linear-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs text-white font-medium">
                            {user.username
                              ? user.username
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "?"}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.username || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email || user.phone_number || "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border font-medium ${roleBadgeColors[user.role] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                      >
                        {user.role === "super_admin" && (
                          <Shield className="w-3 h-3" />
                        )}
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="text-sm text-gray-600">
                        {timeAgo(user.updated_at || user.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => toggleMenu(user.id, e)}
                        className="text-gray-400 hover:text-gray-700 h-8 px-2 cursor-pointer"
                        disabled={user.role === "super_admin"}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Permissions Panel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Role Permissions
        </h2>
        <div className="space-y-3">
          {(Object.entries(roleDescriptions) as [AdminRole, string][]).map(
            ([role, description]) => (
              <div key={role} className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {roleLabels[role]}
                  </div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Fixed-position dropdown */}
      {openMenu !== null && menuUser && menuUser.role !== "super_admin" && (
        <div
          ref={menuRef}
          className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-100"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            onClick={() => handleToggleStatus(menuUser.id, menuUser.is_active)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            {menuUser.is_active ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => handleDelete(menuUser.id)}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            Remove User
          </button>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddUser(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Admin User
              </h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  placeholder="Full name"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  value={newUser.phone_number}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone_number: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role <span className="text-red-600">*</span>
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      role: e.target.value as AdminRole,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm cursor-pointer"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="brand_admin">Admin</option>
                  <option value="brand_manager">Support</option>
                  <option value="brand_staff">Analyst</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {roleDescriptions[newUser.role]}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => setShowAddUser(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                onClick={handleAddUser}
                disabled={addLoading}
              >
                {addLoading ? "Adding..." : "Add User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
