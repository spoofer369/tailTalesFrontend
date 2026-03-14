import api from "@/api/axios";
import type {
  IApiResponse,
  IOtpRequestResponse,
  IOtpVerifyResponse,
  IAuthData,
  IUser,
} from "@/interface";

// Request OTP for a phone number
export const requestOtpApi = async (
  phoneNumber: string,
): Promise<IApiResponse<IOtpRequestResponse>> => {
  const response = await api.post<IApiResponse<IOtpRequestResponse>>(
    "/auth/request-otp",
    { phone_number: phoneNumber },
  );
  return response.data;
};

// Verify OTP (standalone — checks if user is registered)
export const verifyOtpApi = async (
  phoneNumber: string,
  otp: string,
  verificationId: string,
): Promise<IApiResponse<IOtpVerifyResponse>> => {
  const response = await api.post<IApiResponse<IOtpVerifyResponse>>(
    "/auth/verify-otp",
    { phone_number: phoneNumber, otp, verification_id: verificationId },
  );
  return response.data;
};

// Login with OTP (existing user)
export const loginApi = async (
  phoneNumber: string,
  otp: string,
  verificationId: string,
  rememberMe = false,
): Promise<IApiResponse<IAuthData>> => {
  const response = await api.post<IApiResponse<IAuthData>>("/auth/login", {
    phone_number: phoneNumber,
    otp,
    verification_id: verificationId,
    remember_me: rememberMe,
  });
  return response.data;
};

// Signup (new user after phone verified)
export const signupApi = async (
  phoneNumber: string,
  role: string = "customer",
  username?: string,
): Promise<IApiResponse<IAuthData>> => {
  const response = await api.post<IApiResponse<IAuthData>>("/auth/signup", {
    phone_number: phoneNumber,
    role,
    username,
  });
  return response.data;
};

// Logout
export const logoutApi = async (): Promise<IApiResponse<null>> => {
  const token = localStorage.getItem("token");
  const response = await api.post<IApiResponse<null>>(
    "/auth/logout",
    {},
    {
      headers: { "x-session-token": token },
    },
  );
  return response.data;
};

// Get current user (protected)
export const getMeApi = async (): Promise<IApiResponse<IUser>> => {
  const response = await api.get<IApiResponse<IUser>>("/auth/me");
  return response.data;
};
