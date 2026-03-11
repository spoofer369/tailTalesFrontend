import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IBrand, IUser } from "@/interfaces";
import {
  fetchDashboardStatsApi,
  fetchBrandsApi,
  updateBrandApi,
  fetchBrandByIdApi,
  deleteBrandApi,
  fetchCustomersApi,
  fetchTeamUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
} from "@/services/adminService";
import type { IDashboardStats } from "@/services/adminService";

// Cache duration: 2 minutes
const CACHE_MS = 2 * 60 * 1000;

interface AdminState {
  stats: IDashboardStats | null;
  statsLoading: boolean;
  statsLastFetched: number;
  brands: IBrand[];
  brandsCount: number;
  brandsTotalPages: number;
  brandsLoading: boolean;
  brandsLastFetched: number;
  selectedBrand: IBrand | null;
  selectedBrandLoading: boolean;
  customers: IUser[];
  customersTotal: number;
  customersTotalPages: number;
  customersLoading: boolean;
  customersLastFetched: number;
  teamUsers: IUser[];
  teamLoading: boolean;
  teamLastFetched: number;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  statsLoading: false,
  statsLastFetched: 0,
  brands: [],
  brandsCount: 0,
  brandsTotalPages: 0,
  brandsLoading: false,
  brandsLastFetched: 0,
  selectedBrand: null,
  selectedBrandLoading: false,
  customers: [],
  customersTotal: 0,
  customersTotalPages: 0,
  customersLoading: false,
  customersLastFetched: 0,
  teamUsers: [],
  teamLoading: false,
  teamLastFetched: 0,
  error: null,
};

// ── Thunks ──

export const fetchDashboardStats = createAsyncThunk<
  IDashboardStats,
  void,
  { rejectValue: string; state: { admin: AdminState } }
>("admin/fetchStats", async (_, { rejectWithValue, getState }) => {
  const { statsLastFetched, stats } = getState().admin;
  if (stats && Date.now() - statsLastFetched < CACHE_MS) return stats;
  try {
    return await fetchDashboardStatsApi();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to load stats",
    );
  }
});

export const fetchBrands = createAsyncThunk<
  { data: IBrand[]; count: number; totalPages: number },
  Record<string, unknown>,
  { rejectValue: string }
>("admin/fetchBrands", async (params, { rejectWithValue }) => {
  try {
    return await fetchBrandsApi(params);
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to load brands",
    );
  }
});

export const updateBrand = createAsyncThunk<
  IBrand,
  { id: number; data: Partial<IBrand> },
  { rejectValue: string }
>("admin/updateBrand", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateBrandApi(id, data);
    return res.data;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update brand",
    );
  }
});

export const fetchBrandById = createAsyncThunk<
  IBrand,
  number,
  { rejectValue: string }
>("admin/fetchBrandById", async (id, { rejectWithValue }) => {
  try {
    const res = await fetchBrandByIdApi(id);
    return res.data;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to load brand",
    );
  }
});

export const deleteBrand = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("admin/deleteBrand", async (id, { rejectWithValue }) => {
  try {
    await deleteBrandApi(id);
    return id;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete brand",
    );
  }
});

export const fetchCustomers = createAsyncThunk<
  { data: IUser[]; count: number; totalPages: number; currentPage: number },
  Record<string, unknown>,
  { rejectValue: string }
>("admin/fetchCustomers", async (params, { rejectWithValue }) => {
  try {
    return await fetchCustomersApi(params);
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to load customers",
    );
  }
});

export const fetchTeamUsers = createAsyncThunk<
  { data: IUser[] },
  void,
  { rejectValue: string; state: { admin: AdminState } }
>("admin/fetchTeam", async (_, { rejectWithValue, getState }) => {
  const { teamLastFetched, teamUsers } = getState().admin;
  if (teamUsers.length > 0 && Date.now() - teamLastFetched < CACHE_MS) {
    return { data: teamUsers };
  }
  try {
    return await fetchTeamUsersApi();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to load team",
    );
  }
});

export const updateUser = createAsyncThunk<
  IUser,
  { id: number; data: Partial<IUser> },
  { rejectValue: string }
>("admin/updateUser", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(id, data);
    return res.data;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update user",
    );
  }
});

export const createUser = createAsyncThunk<
  IUser,
  Record<string, unknown>,
  { rejectValue: string }
>("admin/createUser", async (data, { rejectWithValue }) => {
  try {
    const res = await createUserApi(data);
    return res.data;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create user",
    );
  }
});

export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await deleteUserApi(id);
    return id;
  } catch (e: unknown) {
    const err = e as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete user",
    );
  }
});

// ── Slice ──

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
    clearSelectedBrand(state) {
      state.selectedBrand = null;
    },
  },
  extraReducers: (builder) => {
    // Stats
    builder
      .addCase(fetchDashboardStats.pending, (s) => {
        s.statsLoading = true;
        s.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (s, a) => {
        s.statsLoading = false;
        s.stats = a.payload;
        s.statsLastFetched = Date.now();
      })
      .addCase(fetchDashboardStats.rejected, (s, a) => {
        s.statsLoading = false;
        s.error = a.payload || "Error";
      });
    // Brands
    builder
      .addCase(fetchBrands.pending, (s) => {
        s.brandsLoading = true;
      })
      .addCase(fetchBrands.fulfilled, (s, a) => {
        s.brandsLoading = false;
        s.brands = a.payload.data;
        s.brandsCount = a.payload.count;
        s.brandsTotalPages = a.payload.totalPages;
        s.brandsLastFetched = Date.now();
      })
      .addCase(fetchBrands.rejected, (s, a) => {
        s.brandsLoading = false;
        s.error = a.payload || "Error";
      });
    // Update brand
    builder.addCase(updateBrand.fulfilled, (s, a) => {
      const idx = s.brands.findIndex((b) => b.id === a.payload.id);
      if (idx !== -1) s.brands[idx] = a.payload;
      if (s.selectedBrand?.id === a.payload.id) s.selectedBrand = a.payload;
    });
    // Fetch brand by ID
    builder
      .addCase(fetchBrandById.pending, (s) => {
        s.selectedBrandLoading = true;
      })
      .addCase(fetchBrandById.fulfilled, (s, a) => {
        s.selectedBrandLoading = false;
        s.selectedBrand = a.payload;
      })
      .addCase(fetchBrandById.rejected, (s, a) => {
        s.selectedBrandLoading = false;
        s.error = a.payload || "Error";
      });
    // Delete brand
    builder.addCase(deleteBrand.fulfilled, (s, a) => {
      s.brands = s.brands.filter((b) => b.id !== a.payload);
      s.brandsCount = Math.max(0, s.brandsCount - 1);
      if (s.selectedBrand?.id === a.payload) s.selectedBrand = null;
    });
    // Customers
    builder
      .addCase(fetchCustomers.pending, (s) => {
        s.customersLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (s, a) => {
        s.customersLoading = false;
        s.customers = a.payload.data;
        s.customersTotal = a.payload.count;
        s.customersTotalPages = a.payload.totalPages;
        s.customersLastFetched = Date.now();
      })
      .addCase(fetchCustomers.rejected, (s, a) => {
        s.customersLoading = false;
        s.error = a.payload || "Error";
      });
    // Team
    builder
      .addCase(fetchTeamUsers.pending, (s) => {
        s.teamLoading = true;
      })
      .addCase(fetchTeamUsers.fulfilled, (s, a) => {
        s.teamLoading = false;
        s.teamUsers = a.payload.data;
        s.teamLastFetched = Date.now();
      })
      .addCase(fetchTeamUsers.rejected, (s, a) => {
        s.teamLoading = false;
        s.error = a.payload || "Error";
      });
    // Update user
    builder.addCase(updateUser.fulfilled, (s, a) => {
      const idx = s.teamUsers.findIndex((u) => u.id === a.payload.id);
      if (idx !== -1) s.teamUsers[idx] = a.payload;
      const cIdx = s.customers.findIndex((u) => u.id === a.payload.id);
      if (cIdx !== -1) s.customers[cIdx] = a.payload;
    });
    // Delete user
    builder.addCase(deleteUser.fulfilled, (s, a) => {
      s.teamUsers = s.teamUsers.filter((u) => u.id !== a.payload);
    });
    // Create user
    builder.addCase(createUser.fulfilled, (s, a) => {
      s.teamUsers.push(a.payload);
    });
  },
});

export const { clearAdminError, clearSelectedBrand } = adminSlice.actions;
export default adminSlice.reducer;
