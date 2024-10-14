// tagContainerBuilder.js

import { AppConfig } from './AppConfig.js';

/**
 * Fetches tags from the server and populates the specified container with checkboxes and labels.
 * Adds a form field for textureID and listeners for check/uncheck events.
 * 
 * @param {HTMLElement} tagContainer - The container element (usually a <div>) where the tags will be populated.
 * @param {Array<number>} [preCheckedTagIDs] - An optional array of tag IDs to pre-check.
 * @param {number} textureID - The ID of the texture being analyzed.
 * @returns {void}
 */
function populateTags(tagContainer, textureID, preCheckedTagIDs) {
    // Clear existing content
    tagContainer.innerHTML = '';

    // Create the form elements (Text field + OK button)
    const formField = document.createElement('input');
    formField.type = 'text';
    formField.value = textureID; // Pre-initialize with textureID
    formField.id = 'textureIDField';
    formField.classList.add('texture-id-input');

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('ok-button');

    // Add the button click listener
    okButton.addEventListener('click', () => {
        const textureIDValue = parseInt(formField.value, 10); // Convert the field value to integer
        if (!isNaN(textureIDValue)) {
            manager.analysisTab(textureIDValue); // Call manager.analysisTab with the integer value
        } else {
            console.error('Invalid texture ID input');
        }
    });

    // Append the form field and button above the tags
    tagContainer.appendChild(formField);
    tagContainer.appendChild(okButton);
    tagContainer.appendChild(document.createElement('br')); // Optional line break

    // Fetch all tags from the server
    fetch('/allTags')
        .then(response => response.json())
        .then(data => {
            // Iterate over each tag and create checkbox + label
            data.tags.forEach(tag => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `tag-${tag.id}`;
                checkbox.value = tag.id;
                checkbox.classList.add('tag-checkbox');

                if (preCheckedTagIDs.includes(tag.id)) {
                    checkbox.checked = true;
                }

                checkbox.addEventListener('change', () => {
                    handleTagSelection(checkbox.checked, tag.id, textureID);
                });

                const label = document.createElement('label');
                label.htmlFor = `tag-${tag.id}`;
                label.textContent = `${tag.name} (${tag.category})`;

                tagContainer.appendChild(checkbox);
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
function handleTagSelection(isChecked, tagID, textureID) {
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
 * @returns {Promise<number[]>} - A promise that resolves to an array of tag IDs.
 */
async function requestTagsForImage(textureID) {
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
