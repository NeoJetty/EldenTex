// singleTextureAnalysis.js

import { loadRandomImage, requestImageData } from "./requestImageData.js";
import { populateTags } from "./tagContainerBuilder.js";

function runTextureAnalysisTab(target_tab){
    requestImageData(30, 'tab2-content');
    populateTags('.tag-container');
}

export {runTextureAnalysisTab};