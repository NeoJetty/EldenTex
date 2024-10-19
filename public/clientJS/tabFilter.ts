// tabFilter.ts

import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestImageData.js";
import { populateTags, requestTagsForImage } from "./tagContainerBuilder.js";

export async function runFilterTab(divElement: HTMLDivElement):Promise<void> {
    let textureID = 11;
    // You can manipulate the div element as needed
    divElement.getElementsByClassName('.tag-container');

    // ------------------ update left hand image -------------
    await updateImageSrcAndAppConfig(textureID, divElement); 
    populateTextureTypesNavbar(divElement, AppConfig.analysisTab);

    // ------------------ update right hand container -------------
    let analysisTagsDiv = divElement.querySelector('.right-main-container');
    if (!analysisTagsDiv) {
        console.error('Error: Container element not found.');
        return;
    }
    analysisTagsDiv.innerHTML = '';
    
    // ------------------ tags -------------
    const preCheckedTags = await requestTagsForImage(textureID);
    populateTags(analysisTagsDiv, textureID, preCheckedTags);

}