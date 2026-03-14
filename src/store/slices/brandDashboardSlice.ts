import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IBrand } from "@/interface";
import { getBrandByIdApi, updateBrandApi } from "@/services/brandService";
import type { CreateBrandPayload } from "@/interface";

// ── State ──
interface BrandDashboardState {
  brand: IBrand | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: BrandDashboardState = {
  brand: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

// ── Async Thunks ──

export const fetchBrand = createAsyncThunk<
  IBrand,
  number,
  { rejectValue: string }
>("brandDashboard/fetchBrand", async (brandId, { rejectWithValue }) => {
  try {
    const response = await getBrandByIdApi(brandId);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch brand data",
    );
  }
});

export const updateBrand = createAsyncThunk<
  IBrand,
  { id: number; data: Partial<CreateBrandPayload> },
  { rejectValue: string }
>("brandDashboard/updateBrand", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateBrandApi(id, data);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update brand",
    );
  }
});

// ── Slice ──

const brandDashboardSlice = createSlice({
  name: "brandDashboard",
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
    resetDashboard() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrand.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrand.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brand = action.payload;
      })
      .addCase(fetchBrand.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch brand data";
      })
      // update brand
      .addCase(updateBrand.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.isSaving = false;
        state.brand = action.payload;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload || "Failed to update brand";
      });
  },
});

export const { clearDashboardError, resetDashboard } =
  brandDashboardSlice.actions;
export default brandDashboardSlice.reducer;

