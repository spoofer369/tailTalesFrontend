import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IBrand } from "@/interfaces";
import { getBrandByIdApi } from "@/services/brandService";

// ── State ──
interface BrandDashboardState {
  brand: IBrand | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BrandDashboardState = {
  brand: null,
  isLoading: false,
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
      });
  },
});

export const { clearDashboardError, resetDashboard } =
  brandDashboardSlice.actions;
export default brandDashboardSlice.reducer;
