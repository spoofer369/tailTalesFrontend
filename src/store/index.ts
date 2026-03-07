import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import brandRegistrationReducer from "./slices/brandSlice";
import brandDashboardReducer from "./slices/brandDashboardSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    brandRegistration: brandRegistrationReducer,
    brandDashboard: brandDashboardReducer,
    products: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
