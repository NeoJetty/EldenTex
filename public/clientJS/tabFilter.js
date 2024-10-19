// tabFilter.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestImageData.js";
import { populateTags, requestTagsForImage } from "./tagContainerBuilder.js";
export function runFilterTab(divElement) {
    return __awaiter(this, void 0, void 0, function* () {
        let textureID = 11;
        // You can manipulate the div element as needed
        divElement.getElementsByClassName('.tag-container');
        // ------------------ update left hand image -------------
        yield updateImageSrcAndAppConfig(textureID, divElement);
        populateTextureTypesNavbar(divElement, AppConfig.analysisTab);
        // ------------------ update right hand container -------------
        let analysisTagsDiv = divElement.querySelector('.right-main-container');
        if (!analysisTagsDiv) {
            console.error('Error: Container element not found.');
            return;
        }
        analysisTagsDiv.innerHTML = '';
        // ------------------ tags -------------
        const preCheckedTags = yield requestTagsForImage(textureID);
        populateTags(analysisTagsDiv, textureID, preCheckedTags);
    });
}
