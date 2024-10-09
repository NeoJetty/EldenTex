// requestImagedata.js
import { AppConfig } from './AppConfig.js';
import { resetImageSize } from './imageManipulation.js';

// Function to fetch and display a random untagged texture for the user and tag
function requestUntaggedImageData(userID, tagID) {
    fetch(`/untaggedTexture/${userID}/${tagID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const imageElement = document.getElementById('random-image');
            if (imageElement) {
                // Update AppConfig using the new helper function
                AppConfig.updateFromImageDataJSON(data);

                // Update the image source
                imageElement.src = AppConfig.tab1Image.jpgURL;

                // Reset image size when a new image is loaded
                resetImageSize();

                // Populate the navbar based on textureTypes
                PopulateTextureTypesNavbar();
            }
        })
        .catch(error => console.error('Error fetching untagged image data:', error));
}

// Function to load a random untagged image for the user and tag
// For now hardcoded IDs for TagID and UserID
function loadRandomUntaggedImage() {
    requestUntaggedImageData(1, 4);
}

// Function to fetch and display the image by a specific ID
function requestImageData(imageId) {
    fetch(`/textureData/${imageId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const imageElement = document.getElementById('random-image');
            if (imageElement) {
                // Update AppConfig using the new helper function
                AppConfig.updateFromImageDataJSON(data);

                // Update the image source
                imageElement.src = AppConfig.tab1Image.jpgURL;

                // Reset image size when a new image is loaded
                resetImageSize();

                // Populate the navbar based on textureTypes
                PopulateTextureTypesNavbar();
            }
        })
        .catch(error => console.error('Error fetching image by ID:', error));
}


// Function to fetch and display the random image
function loadRandomImage() {
    requestImageData(-1)
}

// Populate the texture types navbar
function PopulateTextureTypesNavbar() {
    const tabLinks = document.querySelectorAll('.tex-type-navitem');

    // Remove the 'highlighted' class from all tabs before adding new highlights
    tabLinks.forEach(tab => {
        tab.classList.remove('highlighted'); // Clear previous highlights
    });

    // Loop through all tabs to highlight the relevant ones
    tabLinks.forEach(tab => {
        // Determine the corresponding data-type ending
        let typeEnding = tab.getAttribute('data-type');

        // Highlight the tab if its type is true in textureTypes
        if (AppConfig.tab1Image.textureTypes[typeEnding]) {
            tab.classList.add('highlighted'); // Add a class to highlight the tab

            // Add click event listener to the tab
            tab.addEventListener('click', () => {
                let imageUrl = AppConfig.tab1Image.jpgURL;

                // Replace _n with the type ending
                imageUrl = imageUrl.replace(/_n\.jpg$/, `${typeEnding}.jpg`);

                // Update the image source
                const imageElement = document.getElementById('random-image');
                if (imageElement) {
                    imageElement.src = imageUrl;
                }
            });
        }
    });

    // After populating the navbar, set the initial active tab
    const firstActiveTab = Array.from(tabLinks).find(tab => tab.classList.contains('highlighted'));
    if (firstActiveTab) {
        firstActiveTab.classList.add('active'); // Set the first highlighted tab as active
    }
}


export { loadRandomImage, loadRandomUntaggedImage };