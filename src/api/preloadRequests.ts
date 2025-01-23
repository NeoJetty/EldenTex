// preloadRequests.ts
import axios from "axios";
import { AppConfig } from "../AppConfig";
import { Tag } from "../utils/sharedTypes";

export function prefetchAllTags(): Promise<Tag[]> {
  if (AppConfig.debug.level > 0)
    console.log(`Server prefetch request: /api/allTags`);

  return axios
    .get("/api/allTags")
    .then((response) => {
      if (AppConfig.debug.level > 0) {
        console.log(`Server response for /api/allTags:`, response.data);
      }
      return response.data.allTags as Tag[];
    })
    .catch((error) => {
      console.error("Error fetching tags:", error);
      throw new Error("Network response was not ok");
    });
}
