// TabVoting.ts
import { requestUntaggedTextureData } from "./requestTextureData.js";
import { createVotingUI } from './votingYesNo.js';
import { TextureViewer } from "./TextureViewer.js";
import { AppConfig } from "./AppConfig.js";
class TabVoting {
    constructor(contentDiv) {
        this.contentDiv = contentDiv;
        this.textureViewer = new TextureViewer(contentDiv);
    }
    // The new main function, renamed to updateAll
    async updateAll() {
        let data = await requestUntaggedTextureData(1, 2);
        AppConfig.votingTab.updateFromImageDataJSON(data);
        this.textureViewer.replaceTexture(AppConfig.votingTab.jpgURL);
        this.textureViewer.populateTextureTypesNavbar(AppConfig.votingTab);
        createVotingUI(this.contentDiv);
    }
}
export default TabVoting;
