import api from "./api";
import type { ICategory } from "@/interfaces";

interface CategoryListResponse {
  success: boolean;
  count: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  data: ICategory[];
}

export const getCategoriesApi = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<CategoryListResponse> => {
  const response = await api.get<CategoryListResponse>("/categories", {
    params: { limit: 100, ...params },
  });
  return response.data;
};
