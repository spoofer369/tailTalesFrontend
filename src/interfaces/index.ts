// Component Props Interfaces

export interface NavbarProps {
  onBrandLogin?: () => void;
}

export interface FooterProps {
  onAdminLogin?: () => void;
}

export interface LandingPageProps {
  // No props needed for now since we use react-router navigation
}

// API Response Interfaces

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
  social_media: Record<string, string>;
  brand_details: Record<string, unknown>;
  metrics: {
    total_products: number;
    total_orders: number;
    avg_rating: number;
    total_reviews: number;
  };
  created_at: string;
  updated_at: string;
}

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

export interface ICategory {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  parent_category: number | null;
  created_at: string;
  updated_at: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  brand_id: number;
  user_id: number;
  status: string;
  likes_count: number;
  comments_count: number;
  brand?: IBrand;
  created_at: string;
  updated_at: string;
}

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

// Auth Interfaces

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

export interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  disabled?: boolean;
}

// Brand Registration Form Interfaces

export interface IBrandInfoForm {
  name: string;
  description: string;
  logo: string; // URL string (placeholder for now)
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

export interface CreateBrandPayload {
  name: string;
  description?: string;
  logo?: string;
  website_url?: string;
  social_media?: {
    instagram?: string;
    whatsapp?: string;
  };
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  brand_details?: {
    headquarters?: string;
  };
}

// Product Form Payloads

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
