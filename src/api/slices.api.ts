import { SlicePacket } from "../utils/sharedTypes";
import axiosApi from "./API"; // Import the custom API instance

export function requestSliceData(textureIds: number[]): Promise<SlicePacket[]> {
  const endpoint = `/slices/${textureIds.join(",")}`;

  return axiosApi.get(endpoint).then((response) => {
    if (!response.data || !Array.isArray(response.data.slices)) {
      throw new Error("Invalid response format");
    }

    return response.data.slices as SlicePacket[];
  });
}

export function createSlice(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/slices/slice`;

  return axiosApi.post(endpoint, sliceData).then((response) => {
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response format");
    }

    return response.data as SlicePacket;
  });
}

export function autocompleteSliceNames(partialName: string): Promise<string[]> {
  const endpoint = `/slices/autocompleteNames/${partialName}`;

  return axiosApi
    .get(endpoint)
    .then((response) => response.data.sliceNames as string[]);
}

export function getSlicesByName(
  sliceName: string,
  confidenceThreshold: number
): Promise<SlicePacket[]> {
  const endpoint = `/slices/${sliceName}/${confidenceThreshold}`;

  return axiosApi
    .get(endpoint)
    .then((response) => response.data.slices as SlicePacket[]);
}

export function updateLink(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/links`;

  return axiosApi.put(endpoint, sliceData).then((response) => {
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response format");
    }

    return response.data as SlicePacket;
  });
}
