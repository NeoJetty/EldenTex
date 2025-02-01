import axiosApi from "./API";

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

export function getTexture(value: number | string): Promise<any> {
  const isNumber = !isNaN(Number(value));
  const endpoint = isNumber
    ? `/textureData/${value}`
    : `/textureDataByName/${value}`;

  return axiosApi.get(endpoint).then((response) => response.data);
}

export interface ITextureData {
  id: number;
  name: string;
  textureTypes: string[];
}

export function getMultipleTextures(
  textureIDs: number[]
): Promise<ITextureData[]> {
  const endpoint = `/textureData/${textureIDs.join(",")}`;
  return axiosApi.get(endpoint).then((response) => response.data);
}

/**
 * Fetches filtered texture data based on selected tags.
 * @param filterData - An object containing the selected tags and their votes.
 * @returns Promise resolving to the filtered texture data.
 */
export function getFilteredTextures(filterData: {
  tags: { tag_id: number; vote: boolean }[];
}): Promise<any[]> {
  const endpoint = `/serveTexturesByMultipleTags`;

  return axiosApi.post(endpoint, filterData).then((response) => response.data);
}
