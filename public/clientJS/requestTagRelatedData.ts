// requestTagrelatedData.js
import { AppConfig } from "./AppConfig.js";
import { Tag } from "./TagList.js"

async function fetchAllTags(): Promise<Tag[]> {
    const response = await fetch('/allTags');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.tags as Tag[];
}

async function fetchSavedFilterSearches() {
    const response = await fetch(`/serveAllSavedFilterSearches/${AppConfig.user.ID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();   
}

/**
 * Submits the filtered search with a search name and selected tags.
 * Sends a JSON object containing the search name, tags, and user_id to the server.
 * @param filterData - An object containing the search name and selected tags.
 * @returns Promise resolving to the server response.
 */
function submitFilterSearch(filterData: { searchName: string, tags: { tag_id: number, vote: boolean }[] }): Promise<any> {
    // Build the data object to send, including the search name, user ID, and tags
    const dataToSend = {
        search_name: filterData.searchName,  // Append the search name to the data
        tags: filterData.tags,
        user_id: AppConfig.user.ID  // Append the user ID from AppConfig
    };

    if (AppConfig.debug.level > 0) {
        console.log(`Server request: /dbSaveTagSearches POST: ${JSON.stringify(dataToSend)}`);
    }

    return fetch(`/dbSaveTagSearches`, {
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

export { fetchAllTags, fetchSavedFilterSearches, submitFilterSearch }