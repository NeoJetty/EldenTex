// preload.ts
import store from "../redux/store";
import { setAllTags } from "../redux/slices/tagManagmentSlice";
import { initializeTagsFilter } from "../redux/slices/filterSlice"; // Import the filter slice action
import * as API from "./tags.api";

export const preloadAppData = (): Promise<void> => {
  return API.getAllTags()
    .then((tags) => {
      store.dispatch(setAllTags(tags)); // Set tags in tagManagement slice

      // Get sortedTags from the tagManagement slice (after dispatching setAllTags)
      const sortedTags = store.getState().tagManagement.sortedTags;

      // Dispatch initializeTagsFilter to filter slice with the sorted tags
      store.dispatch(initializeTagsFilter(sortedTags));
    })
    .catch((error) => {
      console.error("Error preloading app data:", error);
    });
};
