// singleTextureAnalysis.js

import { loadRandomImage, requestImageData } from "./requestImageData.js";
import { populateTags } from "./tagContainerBuilder.js";

function runTextureAnalysisTab(target_tab){
    requestImageData(30, 'image-analaysis');
    populateTags('.tag-container');
}

export {runTextureAnalysisTab};