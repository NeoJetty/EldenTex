// tagPanel.ts

import { AppConfig } from './AppConfig.js';

/**
 * Fetches tags from the server and populates the specified container with toggles and labels.
 * Adds a form field for textureID and listeners for check/uncheck events.
 * 
 * @param {HTMLElement} tagContainer - The container element (usually a <div>) where the tags will be populated.
 * @param {number} textureID - The ID of the texture being analyzed.
 * @param {Array<TagVote>} [preCheckedTagIDs] - An optional array of TagVote objects to pre-check.
 * @returns {void}
 */
function populateTags(tagContainer: HTMLElement, textureID: number, preCheckedTagIDs: TagVote[] = []): void {
    // Ensure preCheckedTagIDs is an array
    if (!Array.isArray(preCheckedTagIDs)) {
        console.error('preCheckedTagIDs is not an array:', preCheckedTagIDs);
        preCheckedTagIDs = []; // Fallback to an empty array
    }
    // Fetch all tags from the server
    fetch('/allTags')
        .then(response => response.json())
        .then(data => {
            // Iterate over each tag and create a toggle element
            data.tags.forEach((tag: { id: number; name: string; category: string }) => {
                const toggle = document.createElement('div');
                toggle.classList.add('tag-toggle');
                toggle.dataset.tagId = tag.id.toString();

                // Check if the tag is in preCheckedTagIDs
                const tagVote = preCheckedTagIDs.find(tv => tv.tag_id === tag.id);
                const isChecked = tagVote ? tagVote.vote : false; // Determine initial state

                // Set the initial image based on the pre-checked tags
                const toggleImage = document.createElement('img');
                if (tagVote) {
                    // If there's a tagVote, determine the state based on its value
                    toggleImage.src = isChecked ? 'UXimg/toggle_on.png' : 'UXimg/toggle_off.png';
                    toggle.dataset.state = isChecked ? 'on' : 'off';
                } else {
                    // Initialize to neutral state if there's no tag data
                    toggleImage.src = 'UXimg/toggle_neutral.png';
                    toggle.dataset.state = 'neutral';
                }

                toggleImage.classList.add('toggle-image');
                toggle.appendChild(toggleImage);

                // Add event listener for toggle click
                toggle.addEventListener('click', () => {
                    const currentState = toggle.dataset.state;
                    if (currentState === 'on') {
                        toggleImage.src = 'UXimg/toggle_off.png';
                        toggle.dataset.state = 'off';
                        handleTagSelection(false, tag.id, textureID);
                    } else if (currentState === 'off') {
                        toggleImage.src = 'UXimg/toggle_neutral.png';
                        toggle.dataset.state = 'neutral';
                        handleTagNeutralSelection(tag.id, textureID);
                    } else {
                        toggleImage.src = 'UXimg/toggle_on.png';
                        toggle.dataset.state = 'on';
                        handleTagSelection(true, tag.id, textureID);
                    }
                });

                // Create a label for the toggle
                const label = document.createElement('label');
                label.textContent = `${tag.name} (${tag.category})`;

                // Append the toggle and label to the container
                tagContainer.appendChild(toggle);
                tagContainer.appendChild(label);
                tagContainer.appendChild(document.createElement('br')); // Optional line break
            });
        })
        .catch(error => {
            console.error('Error fetching tags:', error);
        });
}



/**
 * Handles the selection (check/uncheck) of a tag for a texture.
 * 
 * @param {boolean} isChecked - Whether the tag was selected or unselected.
 * @param {number} tagID - The ID of the tag.
 * @param {number} textureID - The ID of the texture being analyzed.
 */
function handleTagSelection(isChecked: boolean, tagID: number, textureID: number): void {
    const userID = AppConfig.user.ID;

    // Construct the request URL
    const action = isChecked ? 'true' : 'false'; // Send 'true' or 'false' depending on check/uncheck
    const url = `/dbAddTagToImageAndUser?user_id=${userID}&tag_id=${tagID}&image_id=${textureID}&vote=${action}`;

    // Send the GET request to the server
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update tag');
            }
            return response.json();
        })
        .then(data => {
            console.log(`Tag ${tagID} changed to ${isChecked} for texture ${textureID}. Server message:`, data);
        })
        .catch(error => console.error('Error submitting tag update:', error));
}

/**
 * Handles the neutral (no vote) selection of a tag for a texture.
 * 
 * @param {number} tagID - The ID of the tag.
 * @param {number} textureID - The ID of the texture being analyzed.
 */
function handleTagNeutralSelection(tagID: number, textureID: number): void {
    const userID = AppConfig.user.ID;

    // Construct the request URL for deleting the tag from texture
    const url = `/dbDeleteTagFromTexture/${userID}/${tagID}/${textureID}`;

    // Send the request to the server to remove the tag
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to remove tag, status: ${response.status}`);
            }

            // If the response is OK, parse the JSON
            return response.json(); // Assuming the server returns a JSON response
        })
        .then(data => {
            console.log(`Tag ${tagID} set to neutral (removed) for texture ${textureID}. Server message:`, data);
        })
        .catch(error => console.error('Error removing tag:', error));
}



interface TagVote {
    tag_id: number;
    vote: boolean;
}

/**
 * Fetches tags for the specified image ID and the current user.
 * 
 * @param {number} textureID - The ID of the texture being analyzed.
 * @returns {Promise<TagVote[]>} - A promise that resolves to an array of objects containing tag_id and vote.
 */
async function requestTagsForImage(textureID: number): Promise<TagVote[]> {
    const userId = AppConfig.user.ID; // Extract user ID from AppConfig

    try {
        const response = await fetch(`/serveTagsForTexture/${userId}/${textureID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tags for the specified texture.');
        }

        const data = await response.json();

        // Ensure the textureTags field exists and is an array
        if (!data.textureTags || !Array.isArray(data.textureTags)) {
            throw new Error('Invalid response format.');
        }

        // Return the array of TagVote objects
        return data.textureTags as TagVote[];
    } catch (error) {
        console.error('Error fetching tags:', error);
        return []; // Return an empty array if there was an error
    }
}

export { populateTags, requestTagsForImage };
