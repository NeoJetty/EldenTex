// requestImagedata.js
import { AppConfig } from './AppConfig.js';
import { resetImageSize } from './imageManipulation.js';

function requestUntaggedImageData(userID, tagID, parentDiv) {
    fetch(`/untaggedTexture/${userID}/${tagID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Get the parent <div> using the parentDiv parameter as its ID
            const parentElement = document.getElementById(parentDiv);
            
            if (parentElement) {
                // Find the <img> element with the class 'image-object' inside the parent div
                const imageElement = parentElement.querySelector('.big-texture-viewer');
                
                if (imageElement) {
                    // Update AppConfig using the new helper function
                    AppConfig.updateFromImageDataJSON(data);

                    // Update the image source
                    imageElement.src = AppConfig.votingTab.jpgURL;

                    // Reset image size when a new image is loaded
                    resetImageSize();

                    // Populate the navbar based on textureTypes
                    PopulateTextureTypesNavbar(parentElement);
                } else {
                    console.error(`No <img> element with class 'image-object' found inside the div with ID '${parentDiv}'.`);
                }
            } else {
                console.error(`Element with ID '${parentDiv}' not found.`);
            }
        })
        .catch(error => console.error('Error fetching untagged image data:', error));
}

// Function to load a random untagged image for the user and tag
// For now hardcoded IDs for TagID and UserID
function loadRandomUntaggedImage() {
    requestUntaggedImageData(1, 4, 'tab1-content');
}

function requestImageData(imageId, parentDivID) {
    // Fetch the image data using the provided imageId
    fetch(`/textureData/${imageId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Get the parent <div> using the parentDiv parameter as its ID
            const parentElement = document.getElementById(parentDivID);
            
            if (parentElement) {
                // Find the <img> element with the class 'big-texture-viewer' inside the parent div
                const imageElement = parentElement.querySelector('.big-texture-viewer');
                
                if (imageElement) {
                    // Update AppConfig using the new helper function
                    AppConfig.updateFromImageDataJSON(data);

                    // Update the image source
                    imageElement.src = AppConfig.votingTab.jpgURL;

                    // Reset image size when a new image is loaded
                    resetImageSize();

                    // Populate the navbar based on textureTypes
                    PopulateTextureTypesNavbar(parentElement);
                } else {
                    console.error(`No <img> element with class 'big-texture-viewer' found inside the div with ID '${parentDiv}'.`);
                }
            } else {
                console.error(`Element with ID '${parentDiv}' not found.`);
            }
        })
        .catch(error => console.error('Error fetching image by ID:', error));
}

// Function to fetch and display the random image
function loadRandomImage() {
    requestImageData(-1)
}

// Populate the texture types navbar within a specific parentDiv
function PopulateTextureTypesNavbar(parentDiv) {
    // Select the tab links only within the provided parentDiv
    const tabLinks = parentDiv.querySelectorAll('.tex-type-navitem');

    // Remove the 'highlighted' class from all tabs before adding new highlights
    tabLinks.forEach(tab => {
        tab.classList.remove('highlighted'); // Clear previous highlights
    });

    // Loop through all tabs to highlight the relevant ones
    tabLinks.forEach(tab => {
        // Determine the corresponding data-type ending
        let typeEnding = tab.getAttribute('data-type');

        // Highlight the tab if its type is true in textureTypes
        if (AppConfig.votingTab.textureTypes[typeEnding]) {
            tab.classList.add('highlighted'); // Add a class to highlight the tab

            // Add click event listener to the tab
            tab.addEventListener('click', () => {
                let imageUrl = AppConfig.votingTab.jpgURL;

                // Replace _n with the type ending
                imageUrl = imageUrl.replace(/_n\.jpg$/, `${typeEnding}.jpg`);

                // Update the image source
                const imageElement = parentDiv.querySelectorAll('.big-texture-viewer');
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



export { loadRandomImage, requestImageData, loadRandomUntaggedImage };