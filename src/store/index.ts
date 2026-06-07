import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import brandRegistrationReducer from "./slices/brandSlice";
import brandDashboardReducer from "./slices/brandDashboardSlice";
import productReducer from "./slices/productSlice";
import postReducer from "./slices/postSlice";

const appReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  brandRegistration: brandRegistrationReducer,
  brandDashboard: brandDashboardReducer,
  products: productReducer,
  brandPosts: postReducer,
});

const rootReducer: typeof appReducer = (state, action) => {
  if (
    action.type === "auth/logout/fulfilled" ||
    action.type === "auth/logout/rejected"
  ) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
