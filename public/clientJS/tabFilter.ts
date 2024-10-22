// TabFilter.ts

import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestTextureData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";

class TabFilter {
    private textureID: number;

    constructor() {
        this.textureID = AppConfig.filterTab.textureID;
    }

    async updateAll(divElement: HTMLDivElement): Promise<void> {
        // Manipulate the div element as needed
        divElement.getElementsByClassName('.tag-container');

        // ------------------ update left hand image -------------
        await updateImageSrcAndAppConfig(this.textureID, divElement); 
        populateTextureTypesNavbar(divElement, AppConfig.analysisTab);

        // ------------------ update right hand container -------------
        const analysisTagsDiv = divElement.querySelector('.right-main-container') as HTMLDivElement;
        if (!analysisTagsDiv) {
            console.error('Error: Container element not found...');
            return;
        }
        analysisTagsDiv.innerHTML = '';

        // ------------------ tags -------------
        const preCheckedTags = await requestTagsForImage(this.textureID);
        populateTags(analysisTagsDiv, this.textureID, preCheckedTags);
    }
}

export default TabFilter;
