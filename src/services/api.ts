import axios from "axios";
import type { IApiResponse, IPaginatedResponse } from "@/interfaces";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor — attach auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Typed request helpers
export async function get<T>(url: string): Promise<IApiResponse<T>> {
  const response = await api.get<IApiResponse<T>>(url);
  return response.data;
}

export async function getPaginated<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<IPaginatedResponse<T>> {
  const response = await api.get<IPaginatedResponse<T>>(url, { params });
  return response.data;
}

export async function post<T>(
  url: string,
  data?: unknown,
): Promise<IApiResponse<T>> {
  const response = await api.post<IApiResponse<T>>(url, data);
  return response.data;
}

export async function put<T>(
  url: string,
  data?: unknown,
): Promise<IApiResponse<T>> {
  const response = await api.put<IApiResponse<T>>(url, data);
  return response.data;
}

export async function del<T>(url: string): Promise<IApiResponse<T>> {
  const response = await api.delete<IApiResponse<T>>(url);
  return response.data;
}

export default api;
