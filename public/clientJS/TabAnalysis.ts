// TabAnalysis.ts

import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestTextureData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";

class TabAnalysis {
    private targetParentElement: HTMLElement;
    private callbackUpdateAnalysisTab: (textureID: number) => void;

    constructor(targetParentElement: HTMLDivElement, callbackUpdateAnalysisTab: (textureID: number) => void) {
        this.targetParentElement = targetParentElement;
        this.callbackUpdateAnalysisTab = callbackUpdateAnalysisTab;
    }

    // The new main function, renamed to updateAll
    public async updateAll(textureID: number): Promise<void> {
        // Update left-hand image
        await this.updateImageAndNavbar(textureID);
        
        // Update right-hand container
        const analysisTagsDiv = this.targetParentElement.querySelector('.right-main-container') as HTMLDivElement;
        if (!analysisTagsDiv) {
            console.error('Error: Container element not found.');
            return;
        }
        analysisTagsDiv.innerHTML = '';

        // Create Texture ID input form
        this.createTextureIdInput(analysisTagsDiv, textureID);
        
        // Fetch and populate tags
        const preCheckedTags = await requestTagsForImage(textureID);
        populateTags(analysisTagsDiv, textureID, preCheckedTags);
        
        // Fetch and update related maps
        this.updateRelatedMaps(analysisTagsDiv, textureID);
    }

    // Updates the left-hand image and populates the texture types navbar
    private async updateImageAndNavbar(textureID:number): Promise<void> {
        try {
            await updateImageSrcAndAppConfig(textureID, this.targetParentElement);
            populateTextureTypesNavbar(this.targetParentElement, AppConfig.analysisTab);
        } catch (error) {
            console.error('Error updating image and navbar:', error);
        }
    }

    // Creates a texture ID input field and an OK button
    private createTextureIdInput(analysisTagsDiv: HTMLDivElement, textureID: number): void {
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
            } else {
                console.error('Invalid texture ID input');
            }
        });
    }

    // Fetches and displays related maps for the given texture ID
    private async updateRelatedMaps(analysisTagsDiv: HTMLDivElement, textureID: number): Promise<void> {
        try {
            const response = await fetch(`/serveMapsForTexture/${textureID}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch maps for textureID: ${textureID}`);
            }

            const data = await response.json();

            const heading = document.createElement('h3');
            heading.textContent = 'Related Maps:';
            analysisTagsDiv.appendChild(heading);

            if (data.related_maps && data.related_maps.length > 0) {
                const list = document.createElement('ul');

                data.related_maps.forEach((map: { map_id: number, texture_type: string }) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Map ID: ${map.map_id} (Texture Type: ${map.texture_type})`;
                    list.appendChild(listItem);
                });

                analysisTagsDiv.appendChild(list);
            } else {
                const noMapsMessage = document.createElement('p');
                noMapsMessage.textContent = 'No related maps found for this texture.';
                analysisTagsDiv.appendChild(noMapsMessage);
            }

        } catch (error) {
            console.error('Error fetching related maps:', error);
        }
    }
}

export default TabAnalysis;
