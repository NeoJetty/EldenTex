import { logToUser } from "../utils/logging";
import { SlicePacket } from "../utils/sharedTypes";
import axiosApi from "./API"; // Import the custom API instance

export function getSlicesByTexture(
  textureIds: number[]
): Promise<SlicePacket[]> {
  const endpoint = `/slices/byTexture/${textureIds.join(",")}`;

  return axiosApi.get(endpoint).then((response) => {
    return response.data.slices as SlicePacket[];
  });
}

export function createSymbolAndSlice(
  sliceData: SlicePacket
): Promise<SlicePacket> {
  const endpoint = `/symbols`;

  return axiosApi.post(endpoint, sliceData).then((response) => {
    logToUser("Created slice " + sliceData.symbol.name);

    return response.data as SlicePacket;
  });
}

export function createSlice(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/slices`;

  return axiosApi.post(endpoint, sliceData).then((response) => {
    logToUser("Created slice for " + sliceData.symbol.name);

    return response.data as SlicePacket;
  });
}

export function getSymbolNamesAutocomplete(
  partialName: string
): Promise<string[]> {
  const endpoint = `/symbolNames/autocomplete/${partialName}`;

  return axiosApi
    .get(endpoint)
    .then((response) => response.data.symbolNames as string[]);
}

export function getSymbolsAndTheirOriginByAutocomplete(
  partialName: string
): Promise<SlicePacket[]> {
  const endpoint = `/slicePackets/autocomplete/${partialName}`;

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

export function updateSlice(sliceData: SlicePacket): Promise<SlicePacket> {
  const endpoint = `/slices`;

  return axiosApi.put(endpoint, sliceData).then((response) => {
    logToUser("Updated slice " + sliceData.symbol.name);
    return response.data as SlicePacket;
  });
}

export function getSlices(
  sliceId: number,
  confidence: number = 0
): Promise<any> {
  const endpoint = `/slices?id=${sliceId}&confidence=${confidence}`;

  return axiosApi
    .get(endpoint)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw new Error(`Error fetching data: ${error.message}`);
    });
}

export function deleteSlice(sliceId: number): Promise<void> {
  const endpoint = `/links/${sliceId}`;

  return axiosApi.delete(endpoint).then((response) => {
    logToUser("Deleted slice: " + sliceId);
    return response.data.message;
  });
}

export function deleteSymbol(symbolId: number): Promise<void> {
  const endpoint = `/symbols/${symbolId}`;

  return axiosApi.delete(endpoint).then((response) => {
    return response.data.message;
  });
}
