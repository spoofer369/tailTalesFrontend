import api from "@/api/axios";
import type { IApiResponse } from "@/interface";

export interface ITeamMember {
  id: number;
  username: string;
  phone_number: string;
  role: string;
  brand_id: number | null;
  created_at: string;
  updated_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
    gender: string | null;
  };
}

export interface CreateTeamMemberPayload {
  username: string;
  phone_number: string;
  role: string;
  brand_name: string;
  first_name: string;
  last_name: string;
}

interface IListUsersResponse extends IApiResponse<ITeamMember[]> {
  count: number;
  totalPages: number;
  currentPage: number;
}

// List users with filters
export const listUsersApi = async (params?: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<IListUsersResponse> => {
  const response = await api.get<IListUsersResponse>("/users", { params });
  return response.data;
};

// Get user by ID
export const getUserByIdApi = async (
  id: number,
): Promise<IApiResponse<ITeamMember>> => {
  const response = await api.get<IApiResponse<ITeamMember>>(`/users/${id}`);
  return response.data;
};

// Create a new user (team member)
export const createUserApi = async (
  data: CreateTeamMemberPayload,
): Promise<IApiResponse<ITeamMember>> => {
  const response = await api.post<IApiResponse<ITeamMember>>("/users", data);
  return response.data;
};

// Delete a user
export const deleteUserApi = async (
  id: number,
): Promise<IApiResponse<null>> => {
  const response = await api.delete<IApiResponse<null>>(`/users/${id}`);
  return response.data;
};
