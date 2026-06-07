// Centralized route paths — single source of truth

export const ROUTES = {
  // Public
  HOME: "/",

  BRAND_LOGIN: "/brand/login",
  BRAND_REGISTER: "/brand/register",
  ADMIN_LOGIN: "/admin/login",

  // Brand Dashboard
  BRAND_DASHBOARD: "/brand/dashboard",
  BRAND_PRODUCTS: "/brand/dashboard/products",
  BRAND_PRODUCTS_NEW: "/brand/dashboard/products/new",
  BRAND_POSTS: "/brand/dashboard/posts",
  BRAND_POSTS_NEW: "/brand/dashboard/posts/new",
  BRAND_SETTINGS: "/brand/dashboard/settings",

  // Admin Dashboard
  ADMIN_DASHBOARD: "/admin/dashboard",
} as const;
