import { logInfo } from "../utils/logging";
import axiosApi from "./API";
import { TagVote } from "../utils/sharedTypes";

/**
 * Fetches untagged texture data for a specific user and tag combination.
 * @param userID - The user ID.
 * @param tagID - The tag ID.
 * @returns Promise resolving to the texture data.
 */
export function getUntaggedTexture(tagID: number): Promise<any> {
  const endpoint = `/untaggedTexture/${tagID}`;
  return axiosApi.get(endpoint).then((response) => response.data);
}

export function getTexture(textureIdentifier: number | string): Promise<any> {
  const isNumber = !isNaN(Number(textureIdentifier));
  const endpoint = isNumber
    ? `/textureData/${textureIdentifier}`
    : `/textureDataByName/${textureIdentifier}`;

  return axiosApi.get(endpoint).then((response) => {
    logInfo("Fetched Texture: " + textureIdentifier);
    return response.data;
  });
}

export interface TextureData {
  id: number;
  name: string;
  textureTypes: string[];
}

export function getMultipleTextures(
  textureIDs: number[]
): Promise<TextureData[]> {
  const endpoint = `/textureData/${textureIDs.join(",")}`;
  return axiosApi.get(endpoint).then((response) => response.data);
}

/**
 * Fetches filtered texture data based on selected tags.
 * @param filterData - An object containing the selected tags and their votes.
 * @returns Promise resolving to the filtered texture data.
 */
export function getFilteredTextures(filterData: TagVote[]): Promise<any[]> {
  const endpoint = `/serveTexturesByMultipleTags`;

  return axiosApi.post(endpoint, filterData).then((response) => response.data);
}
