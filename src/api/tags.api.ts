import { Tag, TagVote } from "../utils/sharedTypes.js";
import axiosApi from "./API"; // Import the custom API instance

export async function getAllTags(): Promise<Tag[]> {
  const response = await axiosApi.get("/allTags");

  if (!response.data || !Array.isArray(response.data.tags)) {
    throw new Error("Invalid response format");
  }

  return response.data.tags as Tag[];
}

export async function fetchSavedFilterSearches() {
  const response = await axiosApi.get(`/filter/allFilters`);

  if (!response.data) {
    throw new Error("Invalid response format");
  }

  return response.data;
}

/**
 * Submits the filtered search with a search name and selected tags.
 * Sends a JSON object containing the search name, tags, and user_id to the server.
 * @param filterData - An object containing the search name and selected tags.
 * @returns A dataset containing all textures found by the filter.
 */
export async function submitFilterSearch(filterData: {
  searchName: string;
  tags: TagVote[];
}): Promise<any> {
  const dataToSend = {
    search_name: filterData.searchName,
    tags: filterData.tags,
  };

  const response = await axiosApi.post("/filter/", dataToSend);

  if (!response.data) {
    throw new Error("Invalid response format");
  }

  return response.data;
}

export function addTagToTexture(
  tagID: number,
  textureID: number,
  vote: boolean
): void {
  const url = `/taggingTextures`;

  const data = {
    tag_id: tagID,
    texture_id: textureID,
    vote: vote,
  };

  axiosApi.post(url, data).catch((error) => {
    console.error("Error updating tag:", error.response || error.message);
  });
}

export function deleteTagFromTexture(tagID: number, textureID: number): void {
  const url = `/taggingTextures`;

  const requestBody = {
    tag_id: tagID,
    texture_id: textureID,
  };

  axiosApi.delete(url, { data: requestBody }).catch((error) => {
    console.error("Error removing tag:", error.response || error.message);
  });
}

export function getTextureTags(textureID: number): Promise<TagVote[]> {
  const url = `/taggingTextures/${textureID}`;

  return axiosApi
    .get(url)
    .then((response) => {
      const textureTags: TagVote[] = response.data.textureTags || [];
      return textureTags;
    })
    .catch((error) => {
      console.error("Error fetching tags:", error.response || error.message);
      return [];
    });
}
