import axios from "axios";
import { AppConfig } from "../AppConfig";
import { SlicePacket } from "../utils/sharedTypes";

export function requestSliceData(textureIds: number[]): Promise<SlicePacket[]> {
  const endpoint = `/api/slices/${textureIds.join(",")}`;

  if (AppConfig.debug.level > 0) {
    console.log(`Server request: ${endpoint}`);
  }

  return axios
    .get(endpoint)
    .then((response) => {
      if (AppConfig.debug.level > 0) {
        console.log("Server response:", response.data);
      }

      // Ensure response data is formatted as expected
      if (!response.data || !Array.isArray(response.data.slices)) {
        throw new Error("Invalid response format");
      }

      return response.data.slices as SlicePacket[];
    })
    .catch((error) => {
      console.error("Error fetching slices:", error);
      throw new Error("Failed to fetch slice data");
    });
}
