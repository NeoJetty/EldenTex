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

/**
 * Sends a POST request to create a new slice on the server.
 * @param sliceData - The SlicePacket to be sent as the request body.
 * @returns A promise that resolves with the created SlicePacket.
 */
export function createSlice(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/api/slices/slice`;

  if (AppConfig.debug.level > 0) {
    console.log(`POST request to: ${endpoint} with data:`, sliceData);
  }

  return axios
    .post(endpoint, sliceData)
    .then((response) => {
      if (AppConfig.debug.level > 0) {
        console.log(`Server response ${endpoint}:`, response.data);
      }

      // Ensure response data matches the expected format
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format");
      }

      return response.data as SlicePacket;
    })
    .catch((error) => {
      console.error("Error creating slice:", error);
      throw new Error("Failed to create slice");
    });
}
