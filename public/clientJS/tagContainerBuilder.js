// tagContainerBuilder.js

/**
 * Fetches tags from the server and populates the specified container with checkboxes and labels.
 * 
 * @param {HTMLElement} tagContainer - The container element (usually a <div>) where the tags will be populated.
 * @param {Array<number>} [preCheckedTagIDs] - An optional array of tag IDs to pre-check.
 * @returns {void}
 */
function populateTags(tagContainer, textureID, preCheckedTagIDs) {
    // Fetch all tags from the server
    fetch('/allTags')
        .then(response => response.json())
        .then(data => {
            // Clear existing content
            tagContainer.innerHTML = '';

            // Iterate over each tag and create checkbox + label
            data.tags.forEach(tag => {
                // Create checkbox element
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `tag-${tag.id}`;
                checkbox.value = tag.id;
                checkbox.classList.add('tag-checkbox');

                // Check if this tag ID is in the preCheckedTagIDs array
                if (preCheckedTagIDs.includes(tag.id)) {
                    checkbox.checked = true; // Pre-check the checkbox
                }

                // Create label element
                const label = document.createElement('label');
                label.htmlFor = `tag-${tag.id}`;
                label.textContent = `${tag.name} (${tag.category})`;

                // Append the checkbox and label to the container
                tagContainer.appendChild(checkbox);
                tagContainer.appendChild(label);

                // Optionally add a line break for formatting
                tagContainer.appendChild(document.createElement('br'));
            });
        })
        .catch(error => {
            console.error('Error fetching tags:', error);
        });
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
