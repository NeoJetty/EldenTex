// gallery.js

import { AppConfig } from './AppConfig.js';

async function fetchMultipleTextures(userId, tagId) {
    const url = `/serveManyTextures/${userId}/${tagId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching textures: ${response.statusText}`);
        }

        const textureData = await response.json();
        AppConfig.textures = textureData; // Store the texture data in AppConfig

        // Log the first texture name for testing
        if (textureData.length > 0) {
            console.log('First texture name:', textureData[0].textureName);
        }

        return textureData;
    } catch (error) {
        console.error('Failed to fetch textures:', error);
    }
}

async function runGalleryPage(htmlElement) {
    const userId = AppConfig.user.ID;

    // Check if tagID is -1
    if (AppConfig.galleryByTag.tagID === -1) {
        try {
            // Fetch all available tags
            const response = await fetchAllTags();

            console.log('Fetched tags response:', response);

            const tags = response.tags;

            if (Array.isArray(tags)) {
                const container = document.getElementById(htmlElement);
                const dropdown = container.querySelector('#textureType');

                if (!dropdown) {
                    console.error(`Dropdown not found in element: ${htmlElement}`);
                    return;
                }

                // Remove any existing entries in the dropdown
                dropdown.innerHTML = '';
                const defaultOption = document.createElement('option');
                defaultOption.textContent = '-- choose --';
                defaultOption.value = '';
                dropdown.appendChild(defaultOption);

                // Populate dropdown with fetched tags
                tags.forEach(tag => {
                    const option = document.createElement('option');
                    option.textContent = tag.name;
                    option.value = tag.id;
                    dropdown.appendChild(option);
                });

                // Add event listener to handle dropdown changes
                dropdown.addEventListener('change', (event) => {
                    const selectedTagId = event.target.value;  // Get the selected tag ID
                    AppConfig.galleryByTag.tagID = selectedTagId;  // Update AppConfig with the selected tag ID
                    populateImages(selectedTagId);  // Call the function to populate images
                });

                console.log('Dropdown populated with tags');
            } else {
                console.error('Expected an array of tags, but got:', tags);
                const container = document.getElementById(htmlElement);
                container.innerHTML = 'Error loading tags: unexpected response format.';
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
            const container = document.getElementById(htmlElement);
            container.innerHTML = 'Error loading tags.';
        }
    } else {
        // If the tagID is not -1, trigger the image population function
        populateImages(AppConfig.galleryByTag.tagID);  // Call function to populate images
    }
}

// New stub function to populate images based on the tag ID
function populateImages(tagID) {
    console.log(`Populating images for tag ID: ${tagID}`);
    // Here you would fetch and display the images based on the tagID
    // For now, we will just log the tag ID
}


// Example of fetchAllTags function
async function fetchAllTags() {
    const response = await fetch('/allTags');  // Adjust the API endpoint as necessary
    if (!response.ok) {
        throw new Error('Failed to fetch tags');
    }
    const data = await response.json();
    console.log('Response from /allTags:', data); // Log the raw response
    return data;  // Return the whole response object
}



export { runGalleryPage };
