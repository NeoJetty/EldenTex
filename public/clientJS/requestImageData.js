// requestImagedata.js
import { GSettings } from './GSettings.js';
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
                // Update GSettings using the new helper function
                GSettings.updateFromImageDataJSON(data);

                // Update the image source
                imageElement.src = data.imageUrl;

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
    fetch(`/imageData/${imageId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const imageElement = document.getElementById('random-image');
            if (imageElement) {
                // Update GSettings using the new helper function
                GSettings.updateFromImageDataJSON(data);

                // Update the image source
                imageElement.src = GSettings.tab1Image.jpgURL;

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

function PopulateTextureTypesNavbar() {
    const tabLinks = document.querySelectorAll('.tex-type-navitem');

    // Loop through all tabs
    tabLinks.forEach(tab => {
        // Determine the corresponding data-type ending
        let typeEnding = tab.getAttribute('data-type');

        // Highlight the tab if its type is true in textureTypes
        if (GSettings.tab1Image.textureTypes[typeEnding]) {
            tab.classList.add('highlighted'); // Add a class to highlight the tab

            // Add click event listener to the tab
            tab.addEventListener('click', () => {
                let imageUrl = GSettings.tab1Image.jpgURL;

                if (typeEnding === '_b') {
                    // Handle the special case for Billboards A
                    imageUrl = imageUrl.replace(/_n\.jpg$/, '_Billboards_a.jpg');
                } else {
                    // Replace _n with the type ending
                    imageUrl = imageUrl.replace(/_n\.jpg$/, `${typeEnding}.jpg`);
                }

                // Update the image source
                const imageElement = document.getElementById('random-image');
                if (imageElement) {
                    imageElement.src = imageUrl;
                }
            });
        }
    });
}

export { loadRandomImage, loadRandomUntaggedImage };