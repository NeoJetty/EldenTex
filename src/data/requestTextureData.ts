// requestImagedata.ts
import { AppConfig } from "./AppConfig.js";
/**
 * Fetches untagged texture data for a specific user and tag combination.
 * @param userID - The user ID.
 * @param tagID - The tag ID.
 * @returns Promise resolving to the texture data or an error if none found.
 */
function requestUntaggedTextureData(
  userID: number,
  tagID: number
): Promise<any> {
  if (AppConfig.debug.level > 0)
    console.log(`Server request: /api/untaggedTexture/${userID}/${tagID}`);
  return fetch(`/api/untaggedTexture/${userID}/${tagID}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (AppConfig.debug.level > 0) console.log(`Server response:`, jsonData);

      return jsonData;
    })
    .catch((error) => {
      console.log(
        "No texture data available or all data successfully tagged for this user/tag combination. Server error:",
        error
      );
      throw error;
    });
}

/**
 * Fetches texture data for a specific texture ID.
 * @param textureID - The texture ID.
 * @returns Promise resolving to the texture data or an error if none found.
 */
function requestTextureData(textureID: number): Promise<any> {
  if (AppConfig.debug.level > 0)
    console.log(`Server request: GET /api/textureData/${textureID}`);

  return fetch(`/api/textureData/${textureID}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (AppConfig.debug.level > 0) console.log(`Server response:`, jsonData);

      return jsonData;
    })
    .catch((error) => {
      console.log(
        `No texture data available for textureID ${textureID}. Server error:`,
        error
      );
      throw error;
    });
}

function requestTextureDataByName(textureName: string): Promise<any> {
  if (AppConfig.debug.level > 0)
    console.log(`Server request: /api/textureDataByName/${textureName}`);

  return fetch(`/api/textureDataByName/${textureName}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (AppConfig.debug.level > 0) console.log(`Server response:`, jsonData);

      return jsonData;
    })
    .catch((error) => {
      console.log(
        `No texture data available for textureName ${textureName}. Server error:`,
        error
      );
      throw error;
    });
}

/**
 * Fetches filtered texture data based on selected tags.
 * Sends a JSON object with tags to the server, each containing a tag_id and a vote (true/false).
 * @param filterData - An object containing the selected tags and their votes.
 * @returns Promise resolving to the filtered texture data.
 */
function requestMultiFilterTextureData(filterData: {
  tags: { tag_id: number; vote: boolean }[];
}): Promise<any[]> {
  // Add user_id to the filterData object
  const dataWithUserID = {
    ...filterData,
    user_id: AppConfig.user.ID, // Append the user ID from AppConfig
  };

  if (AppConfig.debug.level > 0)
    console.log(
      `Server request: /api/serveTexturesByMultipleTags POST: ${dataWithUserID}`
    );

  return fetch(`/api/serveTexturesByMultipleTags`, {
    method: "POST", // Use POST method to send the tags for filtering
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataWithUserID), // Send the modified object with user_id
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonData = await response.json();
      if (AppConfig.debug.level > 0) console.log(`Server response:`, jsonData);

      return jsonData;
    })
    .catch((error) => {
      console.log("Error fetching filtered texture data. Server error:", error);
      throw error;
    });
}

export {
  requestUntaggedTextureData,
  requestTextureData,
  requestTextureDataByName,
  requestMultiFilterTextureData,
};
