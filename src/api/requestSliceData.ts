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

export function autocompleteSliceNames(partialName: string): Promise<string[]> {
  const endpoint = `/api/slices/autocompleteNames/${partialName}`;

  if (AppConfig.debug.level > 0) {
    console.log(`GET request to: ${endpoint} with data:`, partialName);
  }

  return axios
    .get(endpoint)
    .then((response) => {
      if (AppConfig.debug.level > 0) {
        console.log(`Server response ${endpoint}:`, response.data);
      }

      return response.data.sliceNames as string[];
    })
    .catch((error) => {
      console.error("Error fetching autocomplete names:", error);
      throw new Error("Failed to fetch autocomplete names");
    });
}

export function getSlicesByName(
  sliceName: string,
  confidenceThreshold: number
): Promise<SlicePacket[]> {
  const endpoint = `/api/slices/${sliceName}/${confidenceThreshold}`;

  if (AppConfig.debug.level > 0) {
    console.log(`GET request to: ${endpoint} with data:`, sliceName);
  }

  return axios
    .get(endpoint)
    .then((response) => {
      if (AppConfig.debug.level > 0) {
        console.log(`Server response ${endpoint}:`, response.data);
      }
      console.log(response.data);

      return response.data.slices as SlicePacket[];
    })
    .catch((error) => {
      console.error("Error fetching autocomplete names:", error);
      throw new Error("Failed to fetch autocomplete names");
    });
}

/**
 * Sends a PUT request to update an existing link on the server.
 * @param sliceData - The SlicePacket to be sent as the request body, including the ID of the link to update.
 * @returns A promise that resolves with the updated SlicePacket.
 */
export function updateLink(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/api/links`;

  if (AppConfig.debug.level > 0) {
    console.log(`PUT: ${endpoint} - data:`, sliceData);
  }

  return axios
    .put(endpoint, sliceData)
    .then((response) => {
      if (AppConfig.debug.level > 0) {
        console.log(`Res: ${endpoint}:`, response.data);
      }

      // Ensure response data matches the expected format
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format");
      }

      return response.data as SlicePacket;
    })
    .catch((error) => {
      console.error("Error updating slice:", error);
      throw new Error("Failed to update slice");
    });
}
