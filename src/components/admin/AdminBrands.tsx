import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Trash2,
  ToggleLeft,
  Zap,
  Package,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchBrands,
  updateBrand,
  deleteBrand,
} from "@/store/slices/adminSlice";
import KycApproveDialog from "./KycApproveDialog";
import KycRejectDialog from "./KycRejectDialog";
import type { IBrand } from "@/interfaces";

type StatusFilter =
  | "all"
  | "active"
  | "pending_review"
  | "suspended"
  | "inactive";

function getKycState(brand: IBrand): "approved" | "pending" | "rejected" {
  if (brand.verification_status) return "approved";
  if (brand.status === "pending_review") return "pending";
  return "rejected";
}

export default function AdminBrands() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { brands, brandsCount, brandsLoading } = useAppSelector((s) => s.admin);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [approveDialog, setApproveDialog] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [rejectDialog, setRejectDialog] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params: Record<string, unknown> = {
      page,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "desc",
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== "all") params.status = statusFilter;
    dispatch(fetchBrands(params));
  }, [dispatch, page, debouncedSearch, statusFilter]);

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

  // Stat counts
  const pendingKyc = brands.filter(
    (b) => !b.verification_status && b.status === "pending_review",
  ).length;
  const approved = brands.filter((b) => b.verification_status).length;
  const active = brands.filter((b) => b.status === "active").length;

  const toggleMenu = (
    brandId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openMenu === brandId) {
      setOpenMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 192 }); // 192 = w-48
    setOpenMenu(brandId);
  };

  const handleApproveKyc = async () => {
    if (!approveDialog) return;
    setActionLoading(true);
    await dispatch(
      updateBrand({
        id: approveDialog.id,
        data: { verification_status: true, status: "active" } as never,
      }),
    );
    setActionLoading(false);
    setApproveDialog(null);
  };

  const handleRejectKyc = async (_reason: string) => {
    if (!rejectDialog) return;
    setActionLoading(true);
    await dispatch(
      updateBrand({
        id: rejectDialog.id,
        data: { verification_status: false, status: "suspended" } as never,
      }),
    );
    setActionLoading(false);
    setRejectDialog(null);
  };

  const handleToggleStatus = (brand: IBrand) => {
    const newStatus = brand.status === "active" ? "suspended" : "active";
    dispatch(
      updateBrand({ id: brand.id, data: { status: newStatus } as never }),
    );
    setOpenMenu(null);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteBrand(id));
    setConfirmDelete(null);
    setOpenMenu(null);
  };

  const kycBadge = (brand: IBrand) => {
    const kyc = getKycState(brand);
    switch (kyc) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
            <ShieldCheck className="w-3 h-3" /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
            <ShieldAlert className="w-3 h-3" /> Pending
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium">
            <ShieldX className="w-3 h-3" /> Rejected
          </span>
        );
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            Inactive
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium">
            <XCircle className="w-3 h-3" /> Suspended
          </span>
        );
      case "pending_review":
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {status}
          </span>
        );
    }
  };

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending_review" },
    { label: "Suspended", value: "suspended" },
  ];

  const statCards = [
    {
      label: "Total Brands",
      value: brandsCount,
      color: "border-l-violet-500",
      text: "text-violet-700",
    },
    {
      label: "Pending KYC",
      value: pendingKyc,
      color: "border-l-amber-500",
      text: "text-amber-700",
    },
    {
      label: "Approved",
      value: approved,
      color: "border-l-emerald-500",
      text: "text-emerald-700",
    },
    {
      label: "Active",
      value: active,
      color: "border-l-cyan-500",
      text: "text-cyan-700",
    },
  ];

  // Get the brand data for currently open menu
  const menuBrand =
    openMenu !== null ? brands.find((b) => b.id === openMenu) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Brand Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage brands, KYC verification, and activation status
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border border-gray-200 rounded-xl p-4 border-l-4 ${stat.color} shadow-sm`}
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search brands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-10"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                statusFilter === f.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {brandsLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : brands.length === 0 ? (
          <div className="p-12 text-center">
            <Building className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No brands found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Brand
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">
                    Owner
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden xl:table-cell">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    KYC Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Brand Status
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">
                    Activity
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => {
                  const owner = (
                    brand as IBrand & {
                      users?: { username: string; role: string }[];
                    }
                  ).users?.find((u) => u.role === "brand_admin");
                  return (
                    <tr
                      key={brand.id}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {brand.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(brand.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="text-sm text-gray-900">
                          {owner?.username || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {brand.contact_info?.email || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-sm text-gray-600">
                        {brand.categories?.length
                          ? `${brand.categories.length} categories`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">{kycBadge(brand)}</td>
                      <td className="px-4 py-3">{statusBadge(brand.status)}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />{" "}
                            {brand.metrics?.total_products ?? 0} products
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />{" "}
                            {brand.metrics?.total_reviews ?? 0} posts
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(
                                `/admin/dashboard/brands/${brand.id}/kyc`,
                              )
                            }
                            className="text-gray-400 hover:text-gray-700 h-8 px-2 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => toggleMenu(brand.id, e)}
                            className="text-gray-400 hover:text-gray-700 h-8 px-2 cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fixed-position dropdown — rendered outside table to avoid overflow clipping */}
      {openMenu !== null && menuBrand && (
        <div
          ref={menuRef}
          className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-100"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {getKycState(menuBrand) !== "approved" && (
            <>
              <button
                onClick={() => {
                  setApproveDialog({ id: menuBrand.id, name: menuBrand.name });
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> Approve KYC
              </button>
              <button
                onClick={() => {
                  setRejectDialog({ id: menuBrand.id, name: menuBrand.name });
                  setOpenMenu(null);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
              >
                <ShieldX className="w-4 h-4" /> Reject KYC
              </button>
              <div className="border-t border-gray-100 my-1" />
            </>
          )}
          {menuBrand.status !== "active" && (
            <button
              onClick={() => handleToggleStatus(menuBrand)}
              className="w-full text-left px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" /> Activate Brand
            </button>
          )}
          {menuBrand.status === "active" && (
            <button
              onClick={() => handleToggleStatus(menuBrand)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
            >
              <ToggleLeft className="w-4 h-4 text-amber-600" /> Suspend
            </button>
          )}
          <button
            onClick={() => {
              setConfirmDelete(menuBrand.id);
              setOpenMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete Brand
          </button>
        </div>
      )}

      {/* Pagination */}
      {brandsCount > 10 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {Math.ceil(brandsCount / 10)}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="cursor-pointer"
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= Math.ceil(brandsCount / 10)}
              onClick={() => setPage(page + 1)}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Brand?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              This will deactivate the brand. Brands with active products cannot
              be deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Dialogs */}
      <KycApproveDialog
        open={!!approveDialog}
        brandName={approveDialog?.name || ""}
        loading={actionLoading}
        onConfirm={handleApproveKyc}
        onCancel={() => setApproveDialog(null)}
      />
      <KycRejectDialog
        open={!!rejectDialog}
        brandName={rejectDialog?.name || ""}
        loading={actionLoading}
        onConfirm={handleRejectKyc}
        onCancel={() => setRejectDialog(null)}
      />
    </div>
  );
}
