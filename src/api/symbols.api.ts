import { logSuccess } from "../utils/logging";
import { SlicePacket } from "../utils/sharedTypes";
import axiosApi from "./API"; // Import the custom API instance

export function createSymbolAndSlice(
  sliceData: SlicePacket
): Promise<SlicePacket> {
  const endpoint = `/symbols`;

  return axiosApi.post(endpoint, sliceData).then((response) => {
    logSuccess("Created slice " + sliceData.symbol.name);

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

export function getSymbolOriginByAutocomplete(
  partialName: string
): Promise<SlicePacket[]> {
  const endpoint = `/slicePackets/autocomplete/${partialName}`;

  return axiosApi
    .get(endpoint)
    .then((response) => response.data.slicePackets as SlicePacket[]);
}

export function getSymbolSlicesByName(
  sliceName: string,
  confidenceThreshold: number
): Promise<SlicePacket[]> {
  const endpoint = `/slices/${sliceName}/${confidenceThreshold}`;

  return axiosApi
    .get(endpoint)
    .then((response) => response.data.slices as SlicePacket[]);
}

export function deleteSymbol(symbolId: number): Promise<void> {
  const endpoint = `/symbols/${symbolId}`;

  return axiosApi.delete(endpoint).then((response) => {
    return response.data.message;
  });
}
