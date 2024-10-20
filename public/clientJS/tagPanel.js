// tagPanel.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function populateTags(tagContainer, textureID, preCheckedTagIDs = []) {
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
        data.tags.forEach((tag) => {
            const toggleDiv = createToggleElement(tag, preCheckedTagIDs);
            // Add the event listener for toggle click
            toggleDiv.addEventListener('click', (event) => on3StateToggleClick(event, textureID));
            // Append the toggle to the container
            tagContainer.appendChild(toggleDiv);
            // Create and append the label for the toggle
            const label = document.createElement('label');
            label.textContent = `${tag.name} (${tag.category})`;
            tagContainer.appendChild(label);
            tagContainer.appendChild(document.createElement('br')); // Optional line break
        });
    })
        .catch(error => {
        console.error('Error fetching tags:', error);
    });
}
/**
 * Creates a toggle element for a given tag.
 *
 * @param {Object} tag - The tag object containing id, name, and category.
 * @param {TagVote[]} preCheckedTagIDs - Array of pre-checked tag IDs.
 * @returns {HTMLElement} The toggle element.
 */
function createToggleElement(tag, preCheckedTagIDs) {
    const toggle = document.createElement('div');
    toggle.classList.add('tag-toggle');
    toggle.dataset.tagId = tag.id.toString();
    // Determine initial state based on preCheckedTagIDs
    const tagVote = preCheckedTagIDs.find(tv => tv.tag_id === tag.id);
    const isChecked = tagVote ? tagVote.vote : false; // Determine initial state
    // Set the initial image based on the pre-checked tags
    const toggleImage = document.createElement('img');
    if (tagVote) {
        toggleImage.src = isChecked ? 'UXimg/toggle_on.png' : 'UXimg/toggle_off.png';
        toggle.dataset.state = isChecked ? 'on' : 'off';
    }
    else {
        toggleImage.src = 'UXimg/toggle_neutral.png';
        toggle.dataset.state = 'neutral';
    }
    toggleImage.classList.add('toggle-image');
    toggle.appendChild(toggleImage);
    return toggle;
}
/**
 * Handles the toggle click event.
 *
 * @param {MouseEvent} event - The click event.
 * @param {number} textureID - The ID of the texture.
 */
function on3StateToggleClick(event, textureID) {
    const toggle = event.currentTarget; // Get the toggle element from the event
    const toggleImage = toggle.querySelector('.toggle-image');
    // Extract tag ID from data attribute and ensure it is a valid number
    const tagIDStr = toggle.dataset.tagId;
    if (!tagIDStr) {
        console.error('Tag ID is not defined in the data attributes.');
        return; // Exit if tagID is not found
    }
    const tagID = parseInt(tagIDStr); // Convert to number
    const currentState = toggle.dataset.state;
    if (currentState === 'on') {
        toggleImage.src = 'UXimg/toggle_off.png';
        toggle.dataset.state = 'off';
        handleTagSelection(false, tagID, textureID);
    }
    else if (currentState === 'off') {
        toggleImage.src = 'UXimg/toggle_neutral.png';
        toggle.dataset.state = 'neutral';
        handleTagNeutralSelection(tagID, textureID);
    }
    else {
        toggleImage.src = 'UXimg/toggle_on.png';
        toggle.dataset.state = 'on';
        handleTagSelection(true, tagID, textureID);
    }
}
/**
 * Handles the selection (check/uncheck) of a tag for a texture.
 *
 * @param {boolean} isChecked - Whether the tag was selected or unselected.
 * @param {number} tagID - The ID of the tag.
 * @param {number} textureID - The ID of the texture being analyzed.
 */
function handleTagSelection(isChecked, tagID, textureID) {
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
function handleTagNeutralSelection(tagID, textureID) {
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
/**
 * Fetches tags for the specified image ID and the current user.
 *
 * @param {number} textureID - The ID of the texture being analyzed.
 * @returns {Promise<TagVote[]>} - A promise that resolves to an array of objects containing tag_id and vote.
 */
function requestTagsForImage(textureID) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = AppConfig.user.ID; // Extract user ID from AppConfig
        try {
            const response = yield fetch(`/serveTagsForTexture/${userId}/${textureID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tags for the specified texture.');
            }
            const data = yield response.json();
            // Ensure the textureTags field exists and is an array
            if (!data.textureTags || !Array.isArray(data.textureTags)) {
                throw new Error('Invalid response format.');
            }
            // Return the array of TagVote objects
            return data.textureTags;
        }
        catch (error) {
            console.error('Error fetching tags:', error);
            return []; // Return an empty array if there was an error
        }
    });
}
export { populateTags, requestTagsForImage };
