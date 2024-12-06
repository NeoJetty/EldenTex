// preload.ts
import store from "../../redux/store"; // Import your Redux store
import { setAllTags } from "../../redux/slices/tagManagmentSlice";
import { prefetchAllTags } from "./preloadRequests";

export const preloadAppData = (): Promise<void> => {
  return prefetchAllTags()
    .then((tags) => {
      store.dispatch(setAllTags(tags)); // Dispatch tags to Redux store
    })
    .catch((error) => {
      console.error("Error preloading app data:", error);
      throw error; // Optionally, propagate the error to be handled further up
    });
};
