// requestTagrelatedData.js

import { AppConfig } from "../AppConfig.js";
import { Tag, TagVote } from "../utils/sharedTypes.js";
import axios from "axios";

async function getAllTags(): Promise<Tag[]> {
  if (AppConfig.debug.level > 0) console.log(`Server request: /api/allTags`);

  const response = await fetch("/api/allTags");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const jsonData = await response.json();
  if (AppConfig.debug.level > 0) {
    console.log(`Server response:`, jsonData);
  }
  return jsonData.tags as Tag[];
}

async function fetchSavedFilterSearches() {
  if (AppConfig.debug.level > 0)
    console.log(
      `Server request: /api/serveAllSavedFilterSearches/${AppConfig.user.ID}`
    );

  const response = await fetch(
    `/api/serveAllSavedFilterSearches/${AppConfig.user.ID}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const jsonData = await response.json();
  if (AppConfig.debug.level > 0) {
    console.log(`Server response:`, jsonData);
  }
  return jsonData;
}

/**
 * Submits the filtered search with a search name and selected tags.
 * Sends a JSON object containing the search name, tags, and user_id to the server.
 * @param filterData - An object containing the search name and selected tags.
 * @returns A dataset containing all textures found by the filter.
 */
async function submitFilterSearch(filterData: {
  searchName: string;
  tags: TagVote[];
}): Promise<any> {
  // Build the data object to send, including the search name, user ID, and tags
  const dataToSend = {
    search_name: filterData.searchName, // Append the search name to the data
    tags: filterData.tags,
    user_id: AppConfig.user.ID, // Append the user ID from AppConfig
  };

  if (AppConfig.debug.level > 0) {
    console.log(
      `Server request: /api/dbSaveTagSearches POST: ${JSON.stringify(
        dataToSend
      )}`
    );
  }

  return fetch(`/api/dbSaveTagSearches`, {
    method: "POST", // Use POST method to save the filter search
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend), // Send the filter data as a JSON string
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (AppConfig.debug.level > 0) {
        console.log(`Server response:`, jsonData);
      }

      return jsonData;
    })
    .catch((error) => {
      console.error("Error submitting filter search. Server error:", error);
      throw error;
    });
}

// on the server side this a mixed POST/ PUT request
function addTagToTexture(
  tagID: number,
  textureID: number,
  vote: boolean
): void {
  const userID = AppConfig.user.ID;
  const url = `/api/TagToTexture`;

  const data = {
    user_id: userID,
    tag_id: tagID,
    texture_id: textureID,
    vote: vote,
  };

  if (AppConfig.debug.level > 0) {
    console.log(`Server request to ${url} with data:`, data);
  }

  axios
    .post(url, data) // Pass data as the second argument
    .then((response) => {
      console.log(
        `Tag ${tagID} set to ${vote} for Texture ${textureID}. Response:`,
        response.data
      );
    })
    .catch((error) => {
      console.error("Error updating tag:", error.response || error.message);
    });
}

function deleteTagFromTexture(tagID: number, textureID: number): void {
  const userID = AppConfig.user.ID;
  const url = `/api/TagToTexture`; // Updated to a more generic delete endpoint

  const requestBody = {
    user_id: userID,
    tag_id: tagID,
    texture_id: textureID,
  };

  if (AppConfig.debug.level > 0) {
    console.log(`Server request DELETE ${url} with body:`, requestBody);
  }

  axios
    .delete(url, { data: requestBody }) // Include the request body in the `data` option
    .then((response) => {
      console.log(
        `Tag ${tagID} removed from Texture ${textureID}. Response:`,
        response.data
      );
    })
    .catch((error) => {
      console.error("Error removing tag:", error.response || error.message);
    });
}

function getTagsForTexture(textureID: number): Promise<TagVote[]> {
  const url = `/api/tags/byTexture/${textureID}`;

  if (AppConfig.debug.level > 0) {
    console.log(`Server request GET ${url}`);
  }

  return axios
    .get(url) // Perform a GET request to fetch the tags
    .then((response) => {
      // Assuming response.data.textureTags is the array of tags and votes
      const textureTags: TagVote[] = response.data.textureTags || [];

      if (textureTags.length === 0) {
        console.log(
          `Server response GET ${url} No tags found for Texture ${textureID}`
        );
      } else {
        console.log(`Server response GET ${url}:`, textureTags);
      }

      // Return the fetched tags (as TagVote[])
      return textureTags;
    })
    .catch((error) => {
      console.error("Error fetching tags:", error.response || error.message);
      return []; // Return an empty array in case of an error
    });
}

export {
  getAllTags,
  fetchSavedFilterSearches,
  submitFilterSearch,
  getTagsForTexture,
  addTagToTexture,
  deleteTagFromTexture,
};
