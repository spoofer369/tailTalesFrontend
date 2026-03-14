// Brand team role definitions — single source of truth

export const BRAND_ROLES = [
  {
    value: "brand_admin",
    label: "Owner",
    description: "Full access to all features and settings",
    badgeClass: "bg-violet-100 text-violet-700 border border-violet-200",
  },
  {
    value: "brand_manager",
    label: "Admin",
    description: "Manage products, posts, and users",
    badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  {
    value: "brand_staff",
    label: "Viewer",
    description: "View-only access to dashboard",
    badgeClass: "bg-green-100 text-green-700 border border-green-200",
  },
] as const;

// Role badge color lookup (used in admin panel)
export const ROLE_BADGE_COLORS: Record<string, string> = {
  brand_admin: "bg-violet-100 text-violet-700 border border-violet-200",
  brand_manager: "bg-blue-100 text-blue-700 border border-blue-200",
  brand_staff: "bg-green-100 text-green-700 border border-green-200",
  customer: "bg-gray-100 text-gray-700 border border-gray-200",
  super_admin: "bg-red-100 text-red-700 border border-red-200",
};

// Allowed roles for brand login/dashboard access
export const BRAND_ALLOWED_ROLES = [
  "brand_admin",
  "brand_manager",
  "brand_staff",
];
