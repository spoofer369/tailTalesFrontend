import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  IUser,
  IOtpRequestResponse,
  IOtpVerifyResponse,
  IAuthData,
} from "@/interface";
import {
  requestOtpApi,
  verifyOtpApi,
  loginApi,
  signupApi,
  logoutApi,
  getMeApi,
} from "@/services/authService";

// ── State ──
interface AuthState {
  user: IUser | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // OTP flow state
  verificationId: string | null;
  isPhoneVerified: boolean;
  isRegistered: boolean | null;
}

const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  sessionToken: storedToken,
  isAuthenticated: false,
  isLoading: !!storedToken, // true if token exists → ProtectedRoute shows spinner while checkAuth runs
  error: null,
  verificationId: null,
  isPhoneVerified: false,
  isRegistered: null,
};

// ── Async Thunks ──

export const requestOtp = createAsyncThunk<
  IOtpRequestResponse,
  string,
  { rejectValue: string }
>("auth/requestOtp", async (phoneNumber, { rejectWithValue }) => {
  try {
    const response = await requestOtpApi(phoneNumber);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
  }
});

export const verifyOtp = createAsyncThunk<
  IOtpVerifyResponse,
  { phoneNumber: string; otp: string; verificationId: string },
  { rejectValue: string }
>(
  "auth/verifyOtp",
  async ({ phoneNumber, otp, verificationId }, { rejectWithValue }) => {
    try {
      const response = await verifyOtpApi(phoneNumber, otp, verificationId);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired OTP",
      );
    }
  },
);

export const loginUser = createAsyncThunk<
  IAuthData,
  {
    phoneNumber: string;
    otp: string;
    verificationId: string;
    rememberMe?: boolean;
  },
  { rejectValue: string }
>(
  "auth/login",
  async (
    { phoneNumber, otp, verificationId, rememberMe },
    { rejectWithValue },
  ) => {
    try {
      const response = await loginApi(
        phoneNumber,
        otp,
        verificationId,
        rememberMe,
      );
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      // Persist session token
      localStorage.setItem("token", response.data.session.sessionToken);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const signupUser = createAsyncThunk<
  IAuthData,
  { phoneNumber: string; role?: string; username?: string },
  { rejectValue: string }
>(
  "auth/signup",
  async ({ phoneNumber, role, username }, { rejectWithValue }) => {
    try {
      const response = await signupApi(phoneNumber, role, username);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      // Persist session token
      localStorage.setItem("token", response.data.session.sessionToken);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  },
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
    } catch (error: unknown) {
      localStorage.removeItem("token");
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  },
);

export const checkAuth = createAsyncThunk<IUser, void, { rejectValue: string }>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await getMeApi();
      // Backend /auth/me returns { success, user } not { success, data }
      const meResponse = response as unknown as {
        success: boolean;
        user: IUser;
        message?: string;
      };
      if (!meResponse.success) {
        localStorage.removeItem("token");
        return rejectWithValue(meResponse.message || "Session expired");
      }
      return meResponse.user;
    } catch (error: unknown) {
      localStorage.removeItem("token");
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  },
);

// ── Slice ──

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetAuthState(state) {
      state.verificationId = null;
      state.isPhoneVerified = false;
      state.isRegistered = null;
      state.error = null;
    },
    setSessionToken(state, action: PayloadAction<string>) {
      state.sessionToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── requestOtp ──
    builder
      .addCase(requestOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationId = action.payload.verificationId;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send OTP";
      });

    // ── verifyOtp ──
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPhoneVerified = true;
        state.isRegistered = action.payload.is_registered;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Invalid or expired OTP";
      });

    // ── loginUser ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.sessionToken = action.payload.session.sessionToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      });

    // ── signupUser ──
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.sessionToken = action.payload.session.sessionToken;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Signup failed";
      });

    // ── logoutUser ── (always clear state, even if API fails)
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.sessionToken = null;
        state.isAuthenticated = false;
        state.verificationId = null;
        state.isPhoneVerified = false;
        state.isRegistered = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.sessionToken = null;
        state.isAuthenticated = false;
        state.verificationId = null;
        state.isPhoneVerified = false;
        state.isRegistered = null;
      });

    // ── checkAuth ──
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.sessionToken = null;
      });
  },
});

export const { clearError, resetAuthState, setSessionToken } =
  authSlice.actions;
export default authSlice.reducer;
