import { AppConfig } from './AppConfig.js';

// Example of fetchManyTextures function (this would be your actual fetch implementation)
async function fetchManyTextures(userId, tagID, page) {
    const response = await fetch(`/serveManyTextures/${userId}/${tagID}?page=${page}`); // Assuming your API supports pagination
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();  // Assuming it returns JSON in the specified format
}

async function runGalleryTab(targetDiv) {
    const userId = AppConfig.user.ID;
    // Store the callback in AppConfig

    if (AppConfig.galleryTab.tagID === -1) {
        await constructTagsDropdownMenu(targetDiv);
    } else {
        const textures = await fetchTextureDataset(AppConfig.galleryTab.tagID, 1);
        buildImageGrid(textures, 1);
        updatePagination(textures.length, 1);
    }
}

async function fetchTextureDataset(tagID, page) {
    const userId = AppConfig.user.ID;

    try {
        const textures = await fetchManyTextures(userId, tagID, page);
        if(AppConfig.debug.level == 2){
            console.log(`Fetching textures with User ID: ${userId}, Tag ID: ${tagID}, Page: ${page}`);            
            console.log('Fetched textures:', textures);
        }
        // Update AppConfig with the fetched texture data
        AppConfig.updateGalleryDataset(textures, tagID);

        
        return textures; // Return the fetched textures
    } catch (error) {
        console.error(`Error fetching textures for tag ID ${tagID}:`, error);
        return []; // Return an empty array on error
    }
}

async function constructTagsDropdownMenu(targetDiv) {
    try {
        const response = await fetchAllTags();
        const tags = response.tags;

        if (Array.isArray(tags)) {
            const dropdownMenuElement = targetDiv.querySelector('#textureType');

            if (!dropdownMenuElement) {
                console.error(`DropdownMenu HTML element not found in: ${targetDiv}`);
                return;
            }

            // Build the dropdown menu
            buildDropdownMenu(dropdownMenuElement, tags);
        } else {
            console.error('Expected an array of tags, but got:', tags);
        }
    } catch (error) {
        console.error('Error fetching tags:', error);
        targetDiv.innerHTML = 'Error loading tags.';
    }
}

function buildDropdownMenu(dropdown, tags) {
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
        changeGalleryPage(selectedTagId, 1);  // Call the function to populate images for the first page
    });
}

async function changeGalleryPage(tagID, page) {
    if(AppConfig.debug.level == 2) console.log(`refreshing Gallery page: ${page} for tag: ${tagID}`);

    if (tagID != AppConfig.galleryTab.tagID) {
        const textures = await fetchTextureDataset(tagID, page);
        buildImageGrid(textures, page, AppConfig.galleryTab.analysisTabCallback); // Use stored callback
        updatePagination(textures.length, page);
    } else {
        buildImageGrid(AppConfig.galleryTab.allTextureData, page, AppConfig.galleryTab.analysisTabCallback); // Use stored callback
        updatePagination(AppConfig.galleryTab.allTextureData.length, page);
    }
}

function buildImageGrid(textures, page) {
    const imageGrid = document.getElementById('gallery-image-grid');

    // Get the current page textures
    const pagedTextures = textures.slice((page - 1) * 21, page * 21); // Adjust the slice for pagination

    // Access all existing img elements in the grid
    const images = imageGrid.getElementsByTagName('img');

    // Loop through the texture data
    pagedTextures.forEach((texture, index) => {
        // Check if there's already an existing image to update
        if (images[index]) {
            // Update the src and alt attributes of existing images
            images[index].src = AppConfig.buildLowQualityJPGPath(texture.textureName, texture.textureTypes); 
            images[index].alt = `${texture.id}`; // Set an appropriate alt text
        } else {
            // If there's no existing image (more textures than images), create a new one
        }
    });

    // Optional: Set default image for unused images
    for (let i = pagedTextures.length; i < images.length; i++) {
        images[i].src = "/UXimg/image_not_available.png"; // Set default image
        images[i].style.display = 'block'; // Ensure the image is visible
    }
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
            changeGalleryPage(AppConfig.galleryTab.tagID, i);
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
    if(AppConfig.debug.level == 2) console.log('Response from /allTags:', data);

    const data = await response.json();  
    return data;  // Return the whole response object
}

export { runGalleryTab };
