// requestTagrelatedData.js

import { AppConfig } from "./AppConfig.js";
import { Tag, TagVote } from "./TagList.js"

async function fetchAllTags(): Promise<Tag[]> {
    if (AppConfig.debug.level > 0) console.log(`Server request: /api/allTags`);

    const response = await fetch('/api/allTags');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const jsonData = await response.json(); 
    if (AppConfig.debug.level > 0) {
        console.log(`Server response:`, jsonData);
    }
    return jsonData.tags as Tag[];
}

async function fetchSavedFilterSearches() {
    if (AppConfig.debug.level > 0) console.log(`Server request: /api/serveAllSavedFilterSearches/${AppConfig.user.ID}`);

    const response = await fetch(`/api/serveAllSavedFilterSearches/${AppConfig.user.ID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
async function submitFilterSearch(filterData: { searchName: string, tags: TagVote[] }): Promise<any> {
    // Build the data object to send, including the search name, user ID, and tags
    const dataToSend = {
        search_name: filterData.searchName,  // Append the search name to the data
        tags: filterData.tags,
        user_id: AppConfig.user.ID  // Append the user ID from AppConfig
    };

    if (AppConfig.debug.level > 0) {
        console.log(`Server request: /api/dbSaveTagSearches POST: ${JSON.stringify(dataToSend)}`);
    }

    return fetch(`/api/dbSaveTagSearches`, {
        method: 'POST', // Use POST method to save the filter search
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)  // Send the filter data as a JSON string
    })
    .then(async response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json(); 
        if (AppConfig.debug.level > 0) {
            console.log(`Server response:`, jsonData);
        }

        return jsonData;
    })
    .catch(error => {
        console.error('Error submitting filter search. Server error:', error);
        throw error;
    });
}

function addTagtoTexture(tagID:number, textureID: number, vote: boolean): void {
    if (AppConfig.debug.level > 0) {
        console.log(`Server request: /api/dbAddTagToTexture?user_id=${AppConfig.user.ID}&tag_id=${tagID}&texture_id=${textureID}&vote=${vote}`);
    }

    const url = `/api/dbAddTagToTexture?user_id=${AppConfig.user.ID}&tag_id=${tagID}&texture_id=${textureID}&vote=${vote}`;
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => console.log(`Tag ${tagID} set to ${vote} for Texture ${textureID}. Response:`, data))
        .catch(error => console.error('Error updating tag:', error));

}

function removeTagFromTexture(tagID:number, textureID: number): void {
    if (AppConfig.debug.level > 0) console.log(`Server request: /api/dbDeleteTagFromTexture/${AppConfig.user.ID}/${tagID}/${textureID}`);
    
    const url = `/api/dbDeleteTagFromTexture/${AppConfig.user.ID}/${tagID}/${textureID}`;
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => console.log(`Tag ${tagID} removed from Texture ${textureID}. Response:`, data))
        .catch(error => console.error('Error removing tag:', error));
}

export { fetchAllTags, fetchSavedFilterSearches, submitFilterSearch, addTagtoTexture, removeTagFromTexture }