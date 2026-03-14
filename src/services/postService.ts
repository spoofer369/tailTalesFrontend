import api from "@/api/axios";
import type {
  IApiResponse,
  IPost,
  CreatePostPayload,
  UpdatePostPayload,
} from "@/interface";

// ── Post list (paginated) ──

interface PostListResponse {
  success: boolean;
  count: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  data: IPost[];
}

interface PostListParams {
  brand_id?: number;
  page?: number;
  limit?: number;
  type?: string;
  sort?: string;
  feed_only?: string;
}

export const getPostsApi = async (
  params: PostListParams,
): Promise<PostListResponse> => {
  const response = await api.get<PostListResponse>("/posts", { params });
  return response.data;
};

// ── Single post ──

export const getPostByIdApi = async (
  id: number,
): Promise<IApiResponse<IPost>> => {
  const response = await api.get<IApiResponse<IPost>>(`/posts/${id}`);
  return response.data;
};

// ── Create ──

export const createPostApi = async (
  data: CreatePostPayload,
): Promise<IApiResponse<IPost>> => {
  const response = await api.post<IApiResponse<IPost>>("/posts", data);
  return response.data;
};

// ── Update ──

export const updatePostApi = async (
  id: number,
  data: UpdatePostPayload,
): Promise<IApiResponse<IPost>> => {
  const response = await api.put<IApiResponse<IPost>>(`/posts/${id}`, data);
  return response.data;
};

// ── Delete ──

export const deletePostApi = async (
  id: number,
): Promise<IApiResponse<null>> => {
  const response = await api.delete<IApiResponse<null>>(`/posts/${id}`);
  return response.data;
};
