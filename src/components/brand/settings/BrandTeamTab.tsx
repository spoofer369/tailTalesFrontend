import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  UserCircle,
  MoreVertical,
  Trash2,
  Shield,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store";
import { useToast } from "@/hooks/useToast";
import { listUsersApi, type ITeamMember } from "@/services/userService";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import DeleteTeamMemberDialog from "./DeleteTeamMemberDialog";

const BRAND_ROLES = [
  {
    value: "brand_admin",
    label: "Owner",
    description: "Full access to all features and settings",
    badgeClass: "bg-violet-100 text-violet-700 border border-violet-200",
  },
  {
    value: "brand_manager",
    label: "Admin",
    description: "Manage products, posts, and users",
    badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  {
    value: "brand_staff",
    label: "Viewer",
    description: "View-only access to dashboard",
    badgeClass: "bg-green-100 text-green-700 border border-green-200",
  },
];

function getRoleBadge(role: string) {
  const r = BRAND_ROLES.find((b) => b.value === role);
  return {
    label: r?.label || role,
    className: r?.badgeClass || "bg-gray-100 text-gray-700",
  };
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getMemberDisplayName(member: ITeamMember): string {
  if (member.profile?.first_name) {
    return `${member.profile.first_name} ${member.profile.last_name || ""}`.trim();
  }
  return member.username;
}

export default function BrandTeamTab() {
  const { showToast } = useToast();
  const { brand } = useAppSelector((s) => s.brandDashboard);

  const [members, setMembers] = useState<ITeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ── Fetch team members ──
  const fetchMembers = useCallback(async () => {
    if (!brand) return;
    setIsLoading(true);
    try {
      const res = await listUsersApi({
        limit: 100,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      if (res.success && res.data) {
        const brandMembers = res.data.filter((u) => u.brand_id === brand.id);
        setMembers(brandMembers);
      }
    } catch {
      showToast({ type: "error", title: "Failed to load team members" });
    } finally {
      setIsLoading(false);
    }
  }, [brand, showToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Close menu on outside click
  useEffect(() => {
    if (openMenuId === null) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  // ── Filter members by search ──
  const filtered = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.username.toLowerCase().includes(q) ||
      m.phone_number.includes(q) ||
      (m.profile?.first_name || "").toLowerCase().includes(q) ||
      (m.profile?.last_name || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your brand team members
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Search */}
      {members.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team members…"
            className="pl-9"
          />
        </div>
      )}

      {/* Team Table */}
      <Card>
        {isLoading ? (
          <CardContent className="py-12">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full" />
                  <div className="flex-1 h-4 bg-gray-100 rounded" />
                  <div className="w-20 h-4 bg-gray-100 rounded" />
                  <div className="w-16 h-4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        ) : filtered.length === 0 ? (
          <CardContent className="py-16 text-center">
            <UserCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">
              {search ? "No members found" : "No team members yet"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {search
                ? "Try a different search term"
                : "Add team members to collaborate on your brand dashboard"}
            </p>
            {!search && (
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-violet-600 hover:bg-violet-700 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            )}
          </CardContent>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Last Active</span>
              <span>Actions</span>
            </div>

            {/* Table Rows */}
            <div>
              {filtered.map((member) => {
                const badge = getRoleBadge(member.role);
                const displayName = getMemberDisplayName(member);

                return (
                  <div
                    key={member.id}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-violet-600">
                          {(
                            member.profile?.first_name?.[0] ||
                            member.username[0]
                          ).toUpperCase()}
                          {(
                            member.profile?.last_name?.[0] || ""
                          ).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.phone_number}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Active
                      </span>
                    </div>

                    {/* Last Active */}
                    <div className="text-sm text-gray-500">
                      {getRelativeTime(member.updated_at || member.created_at)}
                    </div>

                    {/* Actions — three-dot menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === member.id ? null : member.id,
                          );
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === member.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                id: member.id,
                                name: displayName,
                              });
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Role Permissions
          </h3>
          <div className="space-y-4">
            {BRAND_ROLES.map((role) => (
              <div key={role.value} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {role.label}
                  </p>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <AddTeamMemberDialog
        open={showAddDialog}
        brandName={brand?.name || ""}
        onClose={() => setShowAddDialog(false)}
        onSuccess={fetchMembers}
      />

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteTeamMemberDialog
          memberId={deleteTarget.id}
          memberName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchMembers}
        />
      )}
    </div>
  );
}
