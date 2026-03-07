import api from "./api";
import type {
  IApiResponse,
  IProduct,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/interfaces";

// ── Product list (paginated) ──

interface ProductListParams {
  brand_id?: number;
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | string;
  sort?: string;
}

interface ProductListResponse {
  success: boolean;
  count: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  data: IProduct[];
}

export const getProductsApi = async (
  params: ProductListParams,
): Promise<ProductListResponse> => {
  const response = await api.get<ProductListResponse>("/products", { params });
  return response.data;
};

// ── Single product ──

export const getProductByIdApi = async (
  id: number,
): Promise<IApiResponse<IProduct>> => {
  const response = await api.get<IApiResponse<IProduct>>(`/products/${id}`);
  return response.data;
};

// ── Create ──

export const createProductApi = async (
  data: CreateProductPayload,
): Promise<IApiResponse<IProduct>> => {
  const response = await api.post<IApiResponse<IProduct>>("/products", data);
  return response.data;
};

// ── Update ──

export const updateProductApi = async (
  id: number,
  data: UpdateProductPayload,
): Promise<IApiResponse<IProduct>> => {
  const response = await api.put<IApiResponse<IProduct>>(
    `/products/${id}`,
    data,
  );
  return response.data;
};

// ── Delete ──

export const deleteProductApi = async (
  id: number,
): Promise<IApiResponse<null>> => {
  const response = await api.delete<IApiResponse<null>>(`/products/${id}`);
  return response.data;
};
