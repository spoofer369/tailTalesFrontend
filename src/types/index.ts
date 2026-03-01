// Type aliases, enums, and union types

export type UserRole = "consumer" | "brand" | "admin";

export type AppMode =
  | "landing"
  | "consumer-auth"
  | "brand-auth"
  | "brand-register"
  | "admin-auth"
  | "brand-portal"
  | "admin-portal"
  | "consumer-app";

export type KYCStatus = "pending" | "submitted" | "approved" | "rejected";

export type PostStatus = "draft" | "published" | "archived";

export type MediaType = "image" | "video";

export type Screen =
  | "dashboard"
  | "catalog"
  | "editor"
  | "posts"
  | "leads"
  | "booking"
  | "analytics"
  | "billing"
  | "brand"
  | "community";

export type AdminScreen =
  | "dashboard"
  | "brands"
  | "customers"
  | "team"
  | "kyc-review";

export type AuthStep = "phone" | "otp" | "signup" | "success";

export type AuthUserType = "consumer" | "brand" | "admin";
