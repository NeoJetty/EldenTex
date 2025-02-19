import { logInfo } from "../utils/logging";
import axiosApi from "./API";
import { TagVote } from "../utils/sharedTypes";
import store, { StoreTypes } from "../redux/store";
import { ToggleState } from "../components/shared/Toogle";

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
export function getFilteredTexturesOld(filterData: TagVote[]): Promise<any[]> {
  const endpoint = `/serveTexturesByMultipleTags`;

  return axiosApi.post(endpoint, filterData).then((response) => response.data);
}

/**
 * Extracts and transforms filter data from the Redux store.
 * @returns Transformed filter data as an array of { tag_id, vote } objects.
 */
function getFilterDataForApi(): TagVote[] {
  const frontendFilter = store.getState().filter.namedStateTags;
  return frontendFilter.flatMap(({ tags }) =>
    tags
      .filter(({ state }) => state !== ToggleState.NEUTRAL) // Exclude neutral tags
      .map(({ id, state }) => ({
        tag_id: id,
        vote: state === ToggleState.ON,
      }))
  );
}

/**
 * Fetches filtered texture data based on selected tags.
 * @param tagIds - Array of tag IDs for query parameters.
 * @param page - Page number for pagination.
 * @param limit - Number of items per page.
 * @returns Promise resolving to the filtered texture data.
 */
export function getFilteredTextures(
  ids: number[],
  page: number,
  limit: number
): Promise<any[]> {
  const endpoint = `/textures`;

  const query = {
    ids: ids.join(","), // Serialize array for query string
    page,
    limit,
  };

  const filterTags = getFilterDataForApi();

  return axiosApi
    .post(endpoint, { filterTags }, { params: query }) // Send as query parameters
    .then((response) => response.data);
}
