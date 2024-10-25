// requestImagedata.ts
import { AppConfig } from "./AppConfig.js";
/**
 * Fetches untagged texture data for a specific user and tag combination.
 * @param userID - The user ID.
 * @param tagID - The tag ID.
 * @returns Promise resolving to the texture data or an error if none found.
 */
function requestUntaggedTextureData(userID, tagID) {
    if (AppConfig.debug.level > 0)
        console.log(`Server request: /untaggedTexture/${userID}/${tagID}`);
    return fetch(`/untaggedTexture/${userID}/${tagID}`)
        .then(async (response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        if (AppConfig.debug.level > 0)
            console.log(`Server response:`, jsonData);
        return jsonData;
    })
        .catch(error => {
        console.log('No texture data available or all data successfully tagged for this user/tag combination. Server error:', error);
        throw error;
    });
}
/**
 * Fetches texture data for a specific texture ID.
 * @param textureID - The texture ID.
 * @returns Promise resolving to the texture data or an error if none found.
 */
function requestTextureData(textureID) {
    if (AppConfig.debug.level > 0)
        console.log(`Server request: /textureData/${textureID}`);
    return fetch(`/textureData/${textureID}`)
        .then(async (response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        if (AppConfig.debug.level > 0)
            console.log(`Server response:`, jsonData);
        return jsonData;
    })
        .catch(error => {
        console.log(`No texture data available for textureID ${textureID}. Server error:`, error);
        throw error;
    });
}
/**
 * Fetches filtered texture data based on selected tags.
 * Sends a JSON object with tags to the server, each containing a tag_id and a vote (true/false).
 * @param filterData - An object containing the selected tags and their votes.
 * @returns Promise resolving to the filtered texture data.
 */
function requestMultiFilterTextureData(filterData) {
    // Add user_id to the filterData object
    const dataWithUserID = Object.assign(Object.assign({}, filterData), { user_id: AppConfig.user.ID // Append the user ID from AppConfig
     });
    if (AppConfig.debug.level > 0)
        console.log(`Server request: /serveTexturesByMultipleTags POST: ${dataWithUserID}`);
    return fetch(`/serveTexturesByMultipleTags`, {
        method: 'POST', // Use POST method to send the tags for filtering
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataWithUserID) // Send the modified object with user_id
    })
        .then(async (response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        if (AppConfig.debug.level > 0)
            console.log(`Server response:`, jsonData);
        return jsonData;
    })
        .catch(error => {
        console.log('Error fetching filtered texture data. Server error:', error);
        throw error;
    });
}
export { requestUntaggedTextureData, requestTextureData, requestMultiFilterTextureData };
