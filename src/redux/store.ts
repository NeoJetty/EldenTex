import { configureStore } from "@reduxjs/toolkit";
import tagManagementReducer from "./slices/tagManagmentSlice";
import authReducer from "./slices/authSlice";

// Create the store and include reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    tagManagement: tagManagementReducer,
  },
  // devTools is enabled by default in development mode
  devTools: process.env.NODE_ENV !== "production", // Optional: Ensures DevTools are only active in development
});

export default store;
export type StoreTypes = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
