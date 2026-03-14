// ── Type Aliases & Enums ──

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

export type BrandRegistrationStep = 1 | 2 | 3;

export type AuthUserType = "consumer" | "brand" | "admin";

// ── Component Props ──

export interface NavbarProps {
  onBrandLogin?: () => void;
}

export interface FooterProps {
  onAdminLogin?: () => void;
}

export interface LandingPageProps {
  // No props needed for now since we use react-router navigation
}

export interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  disabled?: boolean;
}

// ── User & Auth ──

export interface IUser {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  role: string;
  brand_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IOtpRequestResponse {
  messageId: string;
  provider: string;
  verificationId: string;
}

export interface IOtpVerifyResponse {
  phone_number: string;
  is_registered: boolean;
  user_id: number | null;
}

export interface ISessionData {
  sessionId: number;
  sessionToken: string;
  expiresAt: string;
  isNewSession?: boolean;
}

export interface IAuthData {
  user: IUser;
  session: ISessionData;
}

// ── Brand ──

export interface IStoreLocation {
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
}

export interface ISocialMedia {
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  whatsapp: string;
  [key: string]: string;
}

export interface IBrandDetails {
  founding_year: number | null;
  headquarters: string;
  brand_story: string;
  values: string[];
  certifications: string[];
  store_locations: IStoreLocation[];
}

export interface IBrand {
  id: number;
  name: string;
  description: string;
  logo: string;
  banner: string;
  logo_url: string;
  website_url: string;
  whatsapp_number: string;
  city: string;
  state: string;
  country: string;
  category_id: number;
  owner_id: number;
  categories: number[];
  status: "active" | "inactive" | "pending_review" | "suspended";
  verification_status: boolean;
  is_verified: boolean;
  kyc_status: string;
  contact_info: { email: string; phone: string; address: string };
  social_media: ISocialMedia;
  brand_details: IBrandDetails;
  metrics: {
    total_products: number;
    total_orders: number;
    avg_rating: number;
    total_reviews: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateBrandPayload {
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  website_url?: string;
  social_media?: Partial<ISocialMedia>;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  brand_details?: Partial<IBrandDetails>;
  categories?: number[];
  status?: string;
  phone_number?: string;
}

// ── Brand Registration ──

export interface IBrandInfoForm {
  name: string;
  description: string;
  logo: string;
}

export interface IContactForm {
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  whatsapp: string;
}

export interface IAddressForm {
  address: string;
  city: string;
  pinCode: string;
}

export interface IBrandRegistrationForm {
  brandInfo: IBrandInfoForm;
  contact: IContactForm;
  address: IAddressForm;
}

// ── Product ──

export interface IProduct {
  id: number;
  name: string;
  description: string;
  currency: string;
  price: number;
  catalog_content: string[];
  brand_id: number;
  delivers_to: string[];
  added_by: number;
  categories: number[];
  active: boolean;
  brand?: { id: number; name: string; logo: string };
  categoryDetails?: ICategory[];
  engagement?: { likes: number };
  isLikedByUser?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  catalog_content?: string[];
  brand_id: number;
  added_by: number;
  categories: number[];
  delivers_to?: string[];
  active?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  catalog_content?: string[];
  categories?: number[];
  delivers_to?: string[];
  active?: boolean;
}

// ── Category ──

export interface ICategory {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  parent_category: number | null;
  created_at: string;
  updated_at: string;
}

// ── Post ──

export interface IPost {
  id: number;
  type: string;
  product_id: number;
  categories: number[];
  tags: string[];
  feed_content: boolean;
  brand_id: number;
  added_by: number;
  content_description: string;
  content_url: string;
  cta_url: string | null;
  language: string;
  active: boolean;
  external_likes_count: number;
  brand?: { id: number; name: string; logo: string };
  product?: {
    id: number;
    name: string;
    price: number;
    currency: string;
    catalog_content: string[];
    description?: string;
  };
  engagement?: { likes: number; comments: number };
  created_at: string;
  updated_at: string;
}

export interface CreatePostPayload {
  type: string;
  product_id: number;
  categories: number[];
  tags?: string[];
  feed_content?: boolean;
  content_description: string;
  content_url: string;
  cta_url?: string;
  language?: string;
}

export interface UpdatePostPayload {
  type?: string;
  product_id?: number;
  categories?: number[];
  tags?: string[];
  feed_content?: boolean;
  content_description?: string;
  content_url?: string;
  cta_url?: string;
  language?: string;
  active?: boolean;
}

// ── API ──

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
