import { useEffect } from "react";
import { Shield, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchTeamUsers,
  updateUser,
  deleteUser,
} from "@/store/slices/adminSlice";

export default function AdminUsers() {
  const dispatch = useAppDispatch();
  const { teamUsers, teamLoading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchTeamUsers());
  }, [dispatch]);

  const adminUsers = teamUsers.filter((u) =>
    ["super_admin", "brand_admin", "brand_manager", "brand_staff"].includes(
      u.role,
    ),
  );

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    dispatch(updateUser({ id, data: { is_active: !currentStatus } }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
            Super Admin
          </span>
        );
      case "brand_admin":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
            Brand Admin
          </span>
        );
      case "brand_manager":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            Brand Manager
          </span>
        );
      case "brand_staff":
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-cyan-50 text-cyan-700 font-medium">
            Brand Staff
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {role}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Team Management
        </h1>
        <p className="text-sm text-gray-500">Manage admin and staff users</p>
      </div>

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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                  User
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                  Role
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">
                  Joined
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
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                        {user.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.phone_number || "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-50 text-red-700">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleToggleStatus(user.id, user.is_active)
                        }
                        className={`h-8 text-xs cursor-pointer ${user.is_active ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      {user.role !== "super_admin" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:bg-red-50 h-8 px-2 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
