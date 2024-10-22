// TabAnalysis.ts
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
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestTextureData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";
class TabAnalysis {
    constructor(targetParentElement, callbackUpdateAnalysisTab) {
        this.targetParentElement = targetParentElement;
        this.callbackUpdateAnalysisTab = callbackUpdateAnalysisTab;
    }
    // The new main function, renamed to updateAll
    updateAll(textureID) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update left-hand image
            yield this.updateImageAndNavbar(textureID);
            // Update right-hand container
            const analysisTagsDiv = this.targetParentElement.querySelector('.right-main-container');
            if (!analysisTagsDiv) {
                console.error('Error: Container element not found.');
                return;
            }
            analysisTagsDiv.innerHTML = '';
            // Create Texture ID input form
            this.createTextureIdInput(analysisTagsDiv, textureID);
            // Fetch and populate tags
            const preCheckedTags = yield requestTagsForImage(textureID);
            populateTags(analysisTagsDiv, textureID, preCheckedTags);
            // Fetch and update related maps
            this.updateRelatedMaps(analysisTagsDiv, textureID);
        });
    }
    // Updates the left-hand image and populates the texture types navbar
    updateImageAndNavbar(textureID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield updateImageSrcAndAppConfig(textureID, this.targetParentElement);
                populateTextureTypesNavbar(this.targetParentElement, AppConfig.analysisTab);
            }
            catch (error) {
                console.error('Error updating image and navbar:', error);
            }
        });
    }
    // Creates a texture ID input field and an OK button
    createTextureIdInput(analysisTagsDiv, textureID) {
        const formField = document.createElement('input');
        formField.type = 'text';
        formField.value = textureID.toString(); // Pre-initialize with textureID
        formField.id = 'textureIDField';
        formField.classList.add('texture-id-input');
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.classList.add('ok-button');
        analysisTagsDiv.appendChild(formField);
        analysisTagsDiv.appendChild(okButton);
        analysisTagsDiv.appendChild(document.createElement('br'));
        analysisTagsDiv.appendChild(document.createElement('br'));
        okButton.addEventListener('click', () => {
            const textureIDValue = parseInt(formField.value, 10); // Convert the field value to integer
            if (!isNaN(textureIDValue)) {
                this.callbackUpdateAnalysisTab(textureIDValue); // Call the callback function with the integer value
            }
            else {
                console.error('Invalid texture ID input');
            }
        });
    }
    // Fetches and displays related maps for the given texture ID
    updateRelatedMaps(analysisTagsDiv, textureID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/serveMapsForTexture/${textureID}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch maps for textureID: ${textureID}`);
                }
                const data = yield response.json();
                const heading = document.createElement('h3');
                heading.textContent = 'Related Maps:';
                analysisTagsDiv.appendChild(heading);
                if (data.related_maps && data.related_maps.length > 0) {
                    const list = document.createElement('ul');
                    data.related_maps.forEach((map) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `Map ID: ${map.map_id} (Texture Type: ${map.texture_type})`;
                        list.appendChild(listItem);
                    });
                    analysisTagsDiv.appendChild(list);
                }
                else {
                    const noMapsMessage = document.createElement('p');
                    noMapsMessage.textContent = 'No related maps found for this texture.';
                    analysisTagsDiv.appendChild(noMapsMessage);
                }
            }
            catch (error) {
                console.error('Error fetching related maps:', error);
            }
        });
    }
}
export default TabAnalysis;
