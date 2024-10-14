import { loadRandomImage, requestImageData } from "./requestImageData.js";
import { populateTags, requestTagsForImage } from "./tagContainerBuilder.js";

/**
 * Runs the texture analysis tab by loading a random image and populating the tags.
 * 
 * @param {HTMLDivElement} targetParentElement - The parent element (a <div>) where the image data will be displayed.
 * @param {number} textureID - The ID of the texture to analyze.
 * @returns {void}
 */
async function runTextureAnalysisTab(targetParentElement, textureID) {
    await requestImageData(textureID, targetParentElement); 

    const preCheckedTags = await requestTagsForImage(textureID);

    let textureAnalysisTextureTypeTab = targetParentElement.querySelector('.tag-container');
    if (!textureAnalysisTextureTypeTab) {
        console.error('Error: Container element not found.');
        return;
    }



    populateTags(textureAnalysisTextureTypeTab, textureID, preCheckedTags);
}

export { runTextureAnalysisTab };
