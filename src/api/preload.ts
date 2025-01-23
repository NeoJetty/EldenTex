// preload.ts
import store from "../redux/store";
import { setAllTags } from "../redux/slices/tagManagmentSlice";
import { prefetchAllTags } from "./preloadRequests";

export const preloadAppData = (): Promise<void> => {
  return prefetchAllTags()
    .then((tags) => {
      store.dispatch(setAllTags(tags));
    })
    .catch((error) => {
      console.error("Error preloading app data:", error);
    });
};
