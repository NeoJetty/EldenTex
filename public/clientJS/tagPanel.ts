// tagPanel.ts

import { AppConfig } from './AppConfig.js';

/**
 * Fetches tags from the server and populates the specified container with toggles and labels.
 * Adds a form field for textureID and listeners for check/uncheck events.
 * 
 * @param {HTMLElement} tagContainer - The container element (usually a <div>) where the tags will be populated.
 * @param {Array<number>} [preCheckedTagIDs] - An optional array of tag IDs to pre-check.
 * @param {number} textureID - The ID of the texture being analyzed.
 * @returns {void}
 */
function populateTags(tagContainer: HTMLElement, textureID: number, preCheckedTagIDs: number[] = []): void {
    // Fetch all tags from the server
    fetch('/allTags')
        .then(response => response.json())
        .then(data => {
            // Iterate over each tag and create a toggle element
            data.tags.forEach((tag: { id: number; name: string; category: string }) => {
                
                const toggle = document.createElement('div');
                toggle.classList.add('tag-toggle');
                toggle.dataset.tagId = tag.id.toString();

                // Set the initial image based on the pre-checked tags
                const toggleImage = document.createElement('img');
                if (preCheckedTagIDs.includes(tag.id)) {
                    toggleImage.src = 'UXimg/toggle_on.png';
                    toggle.dataset.state = 'on'; // Track state
                } else {
                    toggleImage.src = 'UXimg/toggle_off.png';
                    toggle.dataset.state = 'off'; // Track state
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
 * @param {boolean} isChecked - Whether the checkbox was checked or unchecked.
 * @param {number} tagID - The ID of the tag.
 * @param {number} textureID - The ID of the texture being analyzed.
 */
function handleTagSelection(isChecked: boolean, tagID: number, textureID: number): void {
    const userID = AppConfig.user.ID;

    // Debugging output
    console.log('Tag selection changed:', isChecked ? 'Checked' : 'Unchecked');
    console.log('User ID:', userID);
    console.log('Texture ID:', textureID);
    console.log('Tag ID:', tagID);

    // Construct the request URL
    const action = isChecked ? 'true' : 'false'; // Send 'true' or 'false' depending on check/uncheck
    const url = `/dbAddTagToImageAndUser?user_id=${userID}&tag_id=${tagID}&image_id=${textureID}&vote=${action}`;

    // Debugging output
    console.log('Constructed URL for tag change:', url);

    // Send the GET request to the server
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update tag');
            }
            return response.json();
        })
        .then(data => {
            console.log('Tag update submitted:', data);
        })
        .catch(error => console.error('Error submitting tag update:', error));
}

/**
 * Fetches tags for the specified image ID and the current user.
 * 
 * @param {number} textureID - The ID of the texture being analyzed.
 * @returns {Promise<number[]>} - A promise that resolves to an array of tag IDs.
 */
async function requestTagsForImage(textureID: number): Promise<number[]> {
    const userId = AppConfig.user.ID; // Extract user ID from AppConfig

    try {
        const response = await fetch(`/serveTagsForTexture/${userId}/${textureID}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tags for the specified texture.');
        }

        const fetchedTags = await response.json();
        return fetchedTags;
    } catch (error) {
        console.error('Error fetching tags:', error);
        return []; // Return an empty array if there was an error
    }
}

export { populateTags, requestTagsForImage };
