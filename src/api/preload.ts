// preload.ts
import store from "../redux/store";
import { setAllTags } from "../redux/slices/tagManagmentSlice";
import * as API from "./tags.api";

export const preloadAppData = (): Promise<void> => {
  return API.getAllTags()
    .then((tags) => {
      store.dispatch(setAllTags(tags));
    })
    .catch((error) => {
      console.error("Error preloading app data:", error);
    });
};
