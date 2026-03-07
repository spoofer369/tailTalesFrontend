import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { IProduct, ICategory } from "@/interfaces";
import {
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from "@/services/productService";
import { getCategoriesApi } from "@/services/categoryService";
import type { CreateProductPayload, UpdateProductPayload } from "@/interfaces";

// ── State ──

interface ProductState {
  products: IProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  categories: ICategory[];
  categoriesLoading: boolean;
}

const initialState: ProductState = {
  products: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
  categories: [],
  categoriesLoading: false,
};

// ── Thunks ──

interface FetchProductsParams {
  brand_id: number;
  page?: number;
  limit?: number;
  search?: string;
  active?: string;
  sort?: string;
}

export const fetchBrandProducts = createAsyncThunk<
  { products: IProduct[]; totalCount: number; totalPages: number; currentPage: number },
  FetchProductsParams,
  { rejectValue: string }
>("products/fetchBrandProducts", async (params, { rejectWithValue }) => {
  try {
    const response = await getProductsApi({
      brand_id: params.brand_id,
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search,
      active: params.active,
      sort: params.sort || "newest",
    });
    return {
      products: response.data,
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      currentPage: response.currentPage,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch products",
    );
  }
});

export const addProduct = createAsyncThunk<
  IProduct,
  CreateProductPayload,
  { rejectValue: string }
>("products/addProduct", async (data, { rejectWithValue }) => {
  try {
    const response = await createProductApi(data);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to create product",
    );
  }
});

export const editProduct = createAsyncThunk<
  IProduct,
  { id: number; data: UpdateProductPayload },
  { rejectValue: string }
>("products/editProduct", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateProductApi(id, data);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to update product",
    );
  }
});

export const removeProduct = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("products/removeProduct", async (id, { rejectWithValue }) => {
  try {
    const response = await deleteProductApi(id);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return id;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to delete product",
    );
  }
});

export const fetchCategories = createAsyncThunk<
  ICategory[],
  void,
  { rejectValue: string }
>("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await getCategoriesApi({ limit: 100 });
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch categories",
    );
  }
});

// ── Slice ──

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError(state) {
      state.error = null;
    },
    resetProducts() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch products
      .addCase(fetchBrandProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBrandProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBrandProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      // add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.totalCount += 1;
      })
      // edit product
      .addCase(editProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (idx !== -1) {
          state.products[idx] = action.payload;
        }
      })
      // remove product
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload,
        );
        state.totalCount -= 1;
      })
      // categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false;
      });
  },
});

export const { clearProductError, resetProducts } = productSlice.actions;
export default productSlice.reducer;
