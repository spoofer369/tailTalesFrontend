import api from "./api";
import type { IApiResponse, IBrand, IUser } from "@/interfaces";

// ── Dashboard Stats ──
export interface IDashboardStats {
  totalBrands: number;
  pendingKYC: number;
  activeCustomers: number;
  totalProducts: number;
  recentBrands: IBrand[];
}

export const fetchDashboardStatsApi = async (): Promise<IDashboardStats> => {
  // Parallel calls for brands, customers, and products
  const [brandsRes, customersRes, productsRes] = await Promise.all([
    api.get("/brands", {
      params: { limit: 5, sortBy: "created_at", sortOrder: "desc" },
    }),
    api.get("/users", { params: { role: "customer", limit: 1 } }).catch(() => ({ data: { count: 0 } })),
    api.get("/products", { params: { limit: 1 } }).catch(() => ({ data: { count: 0 } })),
  ]);

  const brands = brandsRes.data;
  const recentBrands: IBrand[] = brands.data || [];
  const totalBrands: number = brands.count || 0;

  const pendingKYC = recentBrands.filter(
    (b) => b.status === "pending_review",
  ).length;

  const activeCustomers: number = customersRes.data?.count || 0;
  const totalProducts: number = productsRes.data?.count || 0;

  return {
    totalBrands,
    pendingKYC,
    activeCustomers,
    totalProducts,
    recentBrands,
  };
};

// ── Brands ──
export const fetchBrandsApi = async (
  params: Record<string, unknown> = {},
): Promise<{ data: IBrand[]; count: number; totalPages: number }> => {
  const res = await api.get("/brands", { params });
  return res.data;
};

export const updateBrandApi = async (
  id: number,
  data: Partial<IBrand>,
): Promise<IApiResponse<IBrand>> => {
  const res = await api.put(`/brands/${id}`, data);
  return res.data;
};

export const fetchBrandByIdApi = async (
  id: number,
): Promise<IApiResponse<IBrand>> => {
  const res = await api.get(`/brands/${id}`);
  return res.data;
};

export const deleteBrandApi = async (
  id: number,
): Promise<IApiResponse<null>> => {
  const res = await api.delete(`/brands/${id}`);
  return res.data;
};

// ── Customers (users with role=customer) ──
export const fetchCustomersApi = async (
  params: Record<string, unknown> = {},
): Promise<{
  data: IUser[];
  count: number;
  totalPages: number;
  currentPage: number;
}> => {
  const res = await api.get("/users", {
    params: { ...params, role: "customer" },
  });
  return res.data;
};

// ── Team/Admin Users ──
export const fetchTeamUsersApi = async (): Promise<{ data: IUser[] }> => {
  const res = await api.get("/users/all");
  return res.data;
};

export const createUserApi = async (
  data: Record<string, unknown>,
): Promise<IApiResponse<IUser>> => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateUserApi = async (
  id: number,
  data: Partial<IUser>,
): Promise<IApiResponse<IUser>> => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const deleteUserApi = async (
  id: number,
): Promise<IApiResponse<null>> => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
