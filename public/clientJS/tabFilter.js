// TabFilter.ts
import { AppConfig } from "./AppConfig.js";
import { requestTextureData } from "./requestTextureData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";
import { TextureViewer } from "./TextureViewer.js";
var State;
(function (State) {
    State[State["SearchSelection"] = 0] = "SearchSelection";
    State[State["Tagging"] = 1] = "Tagging";
})(State || (State = {}));
class TabFilter {
    constructor(contentDiv) {
        this.state = State.SearchSelection;
        this.contentDiv = contentDiv;
        this.textureViewer = new TextureViewer(contentDiv);
    }
    async updateAll(textureID) {
        if (this.state == State.SearchSelection) {
        }
        else {
            // ------------------ update left hand image -------------
            // Update left-hand image
            let data = await requestTextureData(textureID);
            if (!data) {
                this.textureViewer.setFallbackImage();
                return;
            }
            AppConfig.filterTab.updateFromImageDataJSON(data);
            this.textureViewer.replaceTexture(AppConfig.filterTab.jpgURL);
            this.textureViewer.populateTextureTypesNavbar(AppConfig.filterTab);
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
