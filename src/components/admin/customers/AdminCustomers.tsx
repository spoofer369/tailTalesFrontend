import { useEffect, useState, useRef } from "react";
import {
  Search,
  Users,
  Ban,
  CheckCircle,
  Star,
  Award,
  ShoppingBag,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchCustomers, updateUser } from "@/store/slices/adminSlice";

type SegmentFilter = "all" | "new" | "regular" | "vip" | "affiliate";

function getSegment(customer: {
  created_at: string;
  is_active: boolean;
}): string {
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(customer.created_at).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  if (daysSinceCreated <= 30) return "new";
  return "regular";
}

function getSegmentBadge(segment: string) {
  const badges: Record<string, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    regular: "bg-gray-100 text-gray-700 border-gray-200",
    vip: "bg-purple-50 text-purple-700 border-purple-200",
    affiliate: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return badges[segment] || badges.regular;
}

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

export default function AdminCustomers() {
  const dispatch = useAppDispatch();
  const { customers, customersTotal, customersLoading } = useAppSelector(
    (s) => s.admin,
  );
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>("all");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params: Record<string, unknown> = { page, limit: 10 };
    if (debouncedSearch) params.search = debouncedSearch;
    dispatch(fetchCustomers(params));
  }, [dispatch, page, debouncedSearch]);

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
    customerId: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openMenu === customerId) {
      setOpenMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.right - 192 });
    setOpenMenu(customerId);
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await dispatch(updateUser({ id, data: { is_active: !currentStatus } })).unwrap();
      showToast({ type: "success", title: currentStatus ? "Customer blocked" : "Customer unblocked" });
    } catch {
      showToast({ type: "error", title: "Failed to update customer status" });
    }
    setOpenMenu(null);
  };

  // Filter by segment
  const filteredCustomers =
    segmentFilter === "all"
      ? customers
      : customers.filter((c) => getSegment(c) === segmentFilter);

  // Stats
  const activeCount = customers.filter((c) => c.is_active).length;
  const vipCount = customers.filter((c) => getSegment(c) === "vip").length;
  const affiliateCount = customers.filter(
    (c) => getSegment(c) === "affiliate",
  ).length;

  const statCards = [
    {
      label: "Total Customers",
      value: customersTotal,
      borderColor: "border-l-violet-500",
      textColor: "text-violet-700",
    },
    {
      label: "Active",
      value: activeCount,
      borderColor: "border-l-emerald-500",
      textColor: "text-emerald-700",
    },
    {
      label: "VIP",
      value: vipCount,
      borderColor: "border-l-purple-500",
      textColor: "text-purple-700",
    },
    {
      label: "Affiliates",
      value: affiliateCount,
      borderColor: "border-l-indigo-500",
      textColor: "text-indigo-700",
    },
  ];

  const menuCustomer =
    openMenu !== null ? customers.find((c) => c.id === openMenu) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Customer Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage customers, segments, and affiliate program
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border border-gray-200 rounded-xl p-4 border-l-4 ${stat.borderColor} shadow-sm`}
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-10"
          />
        </div>
        <select
          value={segmentFilter}
          onChange={(e) => {
            setSegmentFilter(e.target.value as SegmentFilter);
            setPage(1);
          }}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
        >
          <option value="all">All Segments</option>
          <option value="new">New</option>
          <option value="regular">Regular</option>
          <option value="vip">VIP</option>
          <option value="affiliate">Affiliate</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {customersLoading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Segment
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">
                    Activity
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">
                    Stats
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden xl:table-cell">
                    Affiliate
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const segment = getSegment(customer);
                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs text-white font-medium">
                              {customer.username
                                ? customer.username
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
                              {customer.username || "—"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {customer.email ||
                                customer.phone_number ||
                                "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Segment */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border font-medium ${getSegmentBadge(segment)}`}
                        >
                          {segment === "vip" && (
                            <Star className="w-3 h-3" />
                          )}
                          {segment === "affiliate" && (
                            <Award className="w-3 h-3" />
                          )}
                          {segment.toUpperCase()}
                        </span>
                      </td>

                      {/* Activity */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-sm text-gray-900">
                          Joined{" "}
                          {new Date(
                            customer.created_at,
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {timeAgo(
                            customer.updated_at || customer.created_at,
                          )}
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-900">— orders</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-900">₹0</span>
                          </div>
                        </div>
                      </td>

                      {/* Affiliate */}
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-sm text-gray-400">—</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {customer.is_active !== false ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium">
                            <Ban className="w-3 h-3" />
                            Blocked
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => toggleMenu(customer.id, e)}
                          className="text-gray-400 hover:text-gray-700 h-8 px-2 cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fixed-position dropdown */}
      {openMenu !== null && menuCustomer && (
        <div
          ref={menuRef}
          className="fixed w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-100"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            onClick={() =>
              handleToggleStatus(menuCustomer.id, menuCustomer.is_active)
            }
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${
              menuCustomer.is_active !== false
                ? "text-red-600 hover:bg-red-50"
                : "text-emerald-600 hover:bg-emerald-50"
            }`}
          >
            {menuCustomer.is_active !== false ? (
              <>
                <Ban className="w-4 h-4" />
                Block Customer
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Unblock Customer
              </>
            )}
          </button>
        </div>
      )}

      {/* Pagination */}
      {customersTotal > 10 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {Math.ceil(customersTotal / 10)}
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
              disabled={page >= Math.ceil(customersTotal / 10)}
              onClick={() => setPage(page + 1)}
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
