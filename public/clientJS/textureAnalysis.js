// textureAnalysis.js

import { loadRandomImage, requestImageData } from "./requestImageData.js";
import { populateTags } from "./tagContainerBuilder.js";

/**
 * Runs the texture analysis tab by loading a random image and populating the tags.
 * 
 * @param {HTMLDivElement} targetParentElement - The parent element (a <div>) where the image data will be displayed.
 * @returns {void}
 */
function runTextureAnalysisTab(targetParentElement, textureID) {
    console.log(`ANALYSIS - TextureID: ${textureID}`);
    requestImageData(textureID, targetParentElement); 

    let textureAnalysisTextureTypeTabs = targetParentElement.querySelector('.tag-container')
    if (!textureAnalysisTextureTypeTabs) {
        console.error('Error: Container element not found.');
        return;
    }

    populateTags(textureAnalysisTextureTypeTabs);
}

export { runTextureAnalysisTab };