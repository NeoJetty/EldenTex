// gallery.js
import { AppConfig } from './AppConfig.js';

// Example of fetchManyTextures function (this would be your actual fetch implementation)
async function fetchManyTextures(userId, tagID, page) {
    const response = await fetch(`/serveManyTextures/${userId}/${tagID}?page=${page}`); // Assuming your API supports pagination
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();  // Assuming it returns JSON in the specified format
}

async function runGalleryTab(htmlElement) {
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
                    populateImages(selectedTagId, 1);  // Call the function to populate images for the first page
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
        populateImages(AppConfig.galleryByTag.tagID, 1);  // Call function to populate images for the first page
    }
}

async function populateImages(tagID, page) {
    console.log(`Populating images for tag ID: ${tagID} on page: ${page}`);

    // Check if the tagID in the parameter is the same as in AppConfig
    if (tagID != AppConfig.galleryByTag.tagID) {
        // If different => update
        try {
            // Fetch textures based on the selected tag ID and page
            const userId = AppConfig.user.ID;
            const textures = await fetchManyTextures(userId, tagID, page);

            // Update AppConfig with the fetched texture data
            AppConfig.updateTextureData(textures, tagID);

            console.log('Fetched textures:', textures);

        } catch (error) {
            console.error(`Error fetching textures for tag ID ${tagID}:`, error);
        }       
    } 

    populateImageGrid(page);
}

function populateImageGrid(page) {
    const imageGrid = document.getElementById('imageGrid');

    // Clear existing images in the grid
    imageGrid.innerHTML = '';

    // Get the current page textures
    const textures = AppConfig.galleryByTag.allTextureData.slice((page - 1) * 21, page * 21); // Adjust the slice for pagination

    // Loop through the texture data and create image elements
    textures.forEach(texture => {
        const img = document.createElement('img');
        // Build the image path using the textureName and textureTypes from the current texture
        img.src = AppConfig.buildJPGPath(texture.textureName, texture.textureTypes); 
        img.alt = `Image for ${texture.textureName}`; // Set an appropriate alt text
        imageGrid.appendChild(img); // Append the image to the grid
    });

    // Update pagination
    updatePagination(AppConfig.galleryByTag.allTextureData.length, page);
}

function updatePagination(totalTextures, currentPage) {
    const itemsPerPage = 21; // Number of items per page
    const totalPages = Math.ceil(totalTextures / itemsPerPage); // Total number of pages
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const pagination = document.getElementById('pagination');

    // Clear existing pagination links
    pageNumbersContainer.innerHTML = '';

    // Generate pagination links
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = i;

        // Add active class to current page link
        if (i === currentPage) {
            pageLink.classList.add('active'); // Optional: style for active page
        }

        // Add event listener to handle page clicks
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Call function to fetch and display images for the selected page
            populateImages(AppConfig.galleryByTag.tagID, i);
        });

        pageNumbersContainer.appendChild(pageLink);
    }

    // Enable/disable previous and next buttons based on current page
    const prevButton = pagination.querySelector('.prev');
    const nextButton = pagination.querySelector('.next');

    prevButton.style.display = currentPage > 1 ? 'inline' : 'none';
    nextButton.style.display = currentPage < totalPages ? 'inline' : 'none';
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

export { runGalleryTab };
