// TabFilter.ts

import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestTextureData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";

enum State {
    SearchSelection = 0,
    Tagging = 1,
}

class TabFilter {
    public contentDiv: HTMLDivElement;
    private state: State = State.SearchSelection;

    constructor(contentDiv: HTMLDivElement) {
        this.contentDiv = contentDiv;
    }

    async updateAll(textureID: number): Promise<void> {

        if(this.state == State.SearchSelection){

        } else {
            // ------------------ update left hand image -------------
            await updateImageSrcAndAppConfig(textureID, this.contentDiv); 
            populateTextureTypesNavbar(this.contentDiv, AppConfig.analysisTab);

            // ------------------ update right hand container -------------
            const rightMainDiv = this.contentDiv.querySelector('.right-main-container') as HTMLDivElement;
            if (!rightMainDiv) {
                console.error('Error: Container element not found...');
                return;
            }
            rightMainDiv.innerHTML = '';

            // ------------------ tags -------------
            const preCheckedTags = await requestTagsForImage(textureID);
            populateTags(rightMainDiv, textureID, preCheckedTags);
        }
        
    }
}

export default TabFilter;
