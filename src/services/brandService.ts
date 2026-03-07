import api from "./api";
import type { IApiResponse, IBrand, CreateBrandPayload } from "@/interfaces";

// Create a new brand
export const createBrandApi = async (
  data: CreateBrandPayload,
): Promise<IApiResponse<IBrand>> => {
  const response = await api.post<IApiResponse<IBrand>>("/brands", data);
  return response.data;
};

// Get brand by ID (includes users, products, posts)
export const getBrandByIdApi = async (
  id: number,
): Promise<IApiResponse<IBrand>> => {
  const response = await api.get<IApiResponse<IBrand>>(`/brands/${id}`);
  return response.data;
};

// Update brand
export const updateBrandApi = async (
  id: number,
  data: Partial<CreateBrandPayload>,
): Promise<IApiResponse<IBrand>> => {
  const response = await api.put<IApiResponse<IBrand>>(`/brands/${id}`, data);
  return response.data;
};

// Get brand's products
export const getBrandProductsApi = async (
  id: number,
  params?: { page?: number; limit?: number; active?: boolean },
) => {
  const response = await api.get(`/brands/${id}/products`, { params });
  return response.data;
};

// Get brand's posts
export const getBrandPostsApi = async (
  id: number,
  params?: { page?: number; limit?: number; active?: boolean; type?: string },
) => {
  const response = await api.get(`/brands/${id}/posts`, { params });
  return response.data;
};
