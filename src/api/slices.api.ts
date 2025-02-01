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

export function createLink(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/links`;

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

export function getSliceOriginsByAutocomplete(
  partialName: string
): Promise<SlicePacket[]> {
  const endpoint = `/slicePacketsByAutocomplete/${partialName}`;

  return axiosApi
    .get(endpoint)
    .then((response) => response.data.slicePackets as SlicePacket[]);
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

export function getLinkData(
  linkId: number,
  confidence: number = 0
): Promise<any> {
  const endpoint = `/links?id=${linkId}&confidence=${confidence}`;

  return axiosApi
    .get(endpoint)
    .then((response) => {
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format");
      }
      return response.data; // You can adjust the return type if necessary
    })
    .catch((error) => {
      throw new Error(`Error fetching data: ${error.message}`);
    });
}

export function deleteLink(linkId: number): Promise<void> {
  const endpoint = `/links/${linkId}`;

  return axiosApi.delete(endpoint).then((response) => {
    return response.data.message;
  });
}

export function deleteSlice(sliceID: number): Promise<void> {
  const endpoint = `/slices/${sliceID}`;

  return axiosApi.delete(endpoint).then((response) => {
    return response.data.message;
  });
}
