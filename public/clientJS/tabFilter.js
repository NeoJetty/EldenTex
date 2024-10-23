// TabFilter.ts
import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestTextureData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";
var State;
(function (State) {
    State[State["SearchSelection"] = 0] = "SearchSelection";
    State[State["Tagging"] = 1] = "Tagging";
})(State || (State = {}));
class TabFilter {
    constructor(contentDiv) {
        this.state = State.SearchSelection;
        this.contentDiv = contentDiv;
    }
    async updateAll(textureID) {
        if (this.state == State.SearchSelection) {
        }
        else {
            // ------------------ update left hand image -------------
            await updateImageSrcAndAppConfig(textureID, this.contentDiv);
            populateTextureTypesNavbar(this.contentDiv, AppConfig.analysisTab);
            // ------------------ update right hand container -------------
            const rightMainDiv = this.contentDiv.querySelector('.right-main-container');
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
