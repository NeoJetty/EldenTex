// requestImagedata.js
import { GSettings } from './GSettings.js';
import { resetImageSize } from './imageManipulation.js';

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
                const imageUrl = data.imageUrl;
                imageElement.src = imageUrl;

                // Update GSettings with the new data
                GSettings.tab1Image.imgID = data.id;
                GSettings.tab1Image.jpgURL = imageUrl;
                GSettings.tab1Image.textureTypes = data.textureTypes; // Use the new textureTypes

                // Update high-res image URL
                
                GSettings.tab1Image.pngURL = GSettings.buildPNGPath(imageUrl);

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

export { loadRandomImage };