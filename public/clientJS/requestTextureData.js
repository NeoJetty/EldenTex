var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// requestImagedata.ts
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
        if (parentDiv) {
            // Find the <img> element with the class 'big-texture-viewer' inside the parent div
            const imageElement = parentDiv.querySelector('.big-texture-viewer');
            if (imageElement) {
                // Update AppConfig using the new helper function
                AppConfig.votingTab.updateFromImageDataJSON(data);
                // Update the image source
                imageElement.src = AppConfig.votingTab.jpgURL;
                // Reset image size when a new image is loaded
                resetImageSize();
                // Populate the navbar based on textureTypes
                populateTextureTypesNavbar(parentDiv, AppConfig.votingTab);
            }
            else {
                console.error(`No <img> element with class 'big-texture-viewer' found inside the div.`);
            }
        }
        else {
            console.error(`Element with ID '${parentDiv}' not found.`);
        }
    })
        .catch(error => {
        console.log('No texture data available or all data successfully tagged for this user/tag combination. Server error:', error);
        // Fallback image if an error occurs
        const fallbackImageElement = parentDiv === null || parentDiv === void 0 ? void 0 : parentDiv.querySelector('.big-texture-viewer');
        if (fallbackImageElement) {
            fallbackImageElement.src = "/UXimg/image_not_available.png";
        }
    });
}
// Function to load a random untagged image for the user and tag
function loadRandomUntaggedImage(parentDiv) {
    requestUntaggedImageData(1, 4, parentDiv);
}
function updateImageSrcAndAppConfig(textureID, parentDiv) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch the image data using the provided textureID
            const response = yield fetch(`/textureData/${textureID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = yield response.json();
            if (parentDiv) {
                // Find the <img> element with the class 'big-texture-viewer' inside the parent div
                const imageElement = parentDiv.querySelector('.big-texture-viewer');
                if (imageElement) {
                    // Update AppConfig using the new helper function
                    AppConfig.analysisTab.updateFromImageDataJSON(data);
                    // Update the image source
                    imageElement.src = AppConfig.analysisTab.jpgURL;
                    // Reset image size when a new image is loaded
                    resetImageSize();
                }
                else {
                    console.error(`No <img> element with class 'big-texture-viewer' found inside the div.`);
                }
            }
            else {
                console.error(`Element with ID '${parentDiv}' not found.`);
            }
        }
        catch (error) {
            console.error('Error fetching image by ID:', error);
        }
    });
}
// Populate the texture types navbar within a specific parentDiv
function populateTextureTypesNavbar(parentDiv, AppConfigPropertyGroup) {
    // Select the tab links only within the provided parentDiv
    const tabLinks = parentDiv.querySelectorAll('.tex-type-navitem');
    // Remove the 'highlighted' class from all tabs before adding new highlights
    tabLinks.forEach(tab => {
        tab.classList.remove('highlighted'); // Clear previous highlights
    });
    // Loop through all tabs to highlight the relevant ones
    tabLinks.forEach(tab => {
        // Determine the corresponding data-type ending
        const typeEnding = tab.getAttribute('data-type');
        // Highlight the tab if its type is true in textureTypes
        if (typeEnding && AppConfigPropertyGroup.textureTypes[typeEnding]) {
            tab.classList.add('highlighted'); // Add a class to highlight the tab
            // Add click event listener to the tab
            tab.addEventListener('click', () => {
                let imageUrl = AppConfigPropertyGroup.jpgURL;
                // Replace _n with the type ending
                imageUrl = imageUrl.replace(/_n\.jpg$/, `${typeEnding}.jpg`);
                // Update the image source
                const imageElement = parentDiv.querySelector('.big-texture-viewer');
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
export { updateImageSrcAndAppConfig, loadRandomUntaggedImage, populateTextureTypesNavbar };