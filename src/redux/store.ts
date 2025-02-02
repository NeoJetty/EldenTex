import { configureStore } from "@reduxjs/toolkit";
import tagManagementReducer from "./slices/tagManagmentSlice";
import authReducer from "./slices/authSlice";
import panZoomReducer from "./slices/panZoomSlice";
import sliceReducer from "./slices/sliceSlice";
import loggingReducer from "./slices/loggingSlice";

const store = configureStore({
  reducer: {
    slice: sliceReducer,
    auth: authReducer,
    tagManagement: tagManagementReducer,
    panZoom: panZoomReducer,
    logging: loggingReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
export type StoreTypes = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
