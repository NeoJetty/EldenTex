import { AppConfig } from "./AppConfig.js";
import { updateImageSrcAndAppConfig, populateTextureTypesNavbar } from "./requestImageData.js";
import { populateTags, requestTagsForImage } from "./tagPanel.js";

/**
 * Runs the texture analysis tab by loading a random image and populating the tags.
 * 
 * @param {HTMLDivElement} targetParentElement - The parent element (a <div>) where the image data will be displayed.
 * @param {number} textureID - The ID of the texture to analyze.
 * @returns {void}
 */
async function runAnalysisTab(targetParentElement, textureID, callbackUpdateAnalysisTab) {

    // ------------------ update left hand image -------------
    await updateImageSrcAndAppConfig(textureID, targetParentElement); 
    populateTextureTypesNavbar(targetParentElement, AppConfig.analysisTab);

    // ------------------ update right hand container -------------
    let analysisTagsDiv = targetParentElement.querySelector('.right-main-container');
    if (!analysisTagsDiv) {
        console.error('Error: Container element not found.');
        return;
    }
    analysisTagsDiv.innerHTML = '';

    // ------------------ form to navigate to other texture -------------
    createTextureIdInput(analysisTagsDiv, textureID, callbackUpdateAnalysisTab);
    
    // ------------------ tags -------------
    const preCheckedTags = await requestTagsForImage(textureID);
    populateTags(analysisTagsDiv, textureID, preCheckedTags);
    
    // ------------------ related maps -------------
    updateRelatedMaps(analysisTagsDiv, textureID);
}


/**
 * Creates a texture ID input field and an OK button, and returns them as an object.
 * 
 * @param {HTMLElement} parentContainer - The parent element where the elements will be appended.
 * @param {number} textureID - The ID of the texture being analyzed.
 * @returns {Object} An object containing the input field and button.
 */
function createTextureIdInput(analysisTagsDiv, textureID, callbackUpdateAnalysisTab) {
    // Create the form elements (Text field + OK button)
    const formField = document.createElement('input');
    formField.type = 'text';
    formField.value = textureID; // Pre-initialize with textureID
    formField.id = 'textureIDField';
    formField.classList.add('texture-id-input');

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.classList.add('ok-button');

    analysisTagsDiv.appendChild(formField);
    analysisTagsDiv.appendChild(okButton);
    analysisTagsDiv.appendChild(document.createElement('br'));
    analysisTagsDiv.appendChild(document.createElement('br'));

    // Add the button click listener
    okButton.addEventListener('click', () => {
        console.log('event');
        const textureIDValue = parseInt(formField.value, 10); // Convert the field value to integer
        if (!isNaN(textureIDValue)) {
            callbackUpdateAnalysisTab(textureIDValue); // Call manager.analysisTab with the integer value
        } else {
            console.error('Invalid texture ID input');
        }
    });
}

/**
 * Fetches related maps for the given texture ID and appends the data to the target container.
 * 
 * @param {HTMLDivElement} targetParentElement - The parent element where the map data will be displayed.
 * @param {number} textureID - The ID of the texture to fetch related maps for.
 * @returns {Promise<void>}
 */
async function updateRelatedMaps(analysisTextureTypeTab, textureID) {
    try {
        // Fetch maps related to the textureID from the new server endpoint
        const response = await fetch(`/serveMapsForTexture/${textureID}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch maps for textureID: ${textureID}`);
        }

        const data = await response.json();

        // Create a heading element for related maps
        const heading = document.createElement('h3');
        heading.textContent = 'Related Maps:';
        analysisTextureTypeTab.appendChild(heading);

        if (data.related_maps && data.related_maps.length > 0) {
            // Create a <ul> element for the list of related maps
            const list = document.createElement('ul');

            // Iterate through the related_maps and create <li> elements for each map
            data.related_maps.forEach(map => {
                const listItem = document.createElement('li');
                listItem.textContent = `Map ID: ${map.map_id} (Texture Type: ${map.texture_type})`;
                list.appendChild(listItem);
            });

            // Append the <ul> to the container
            analysisTextureTypeTab.appendChild(list);
        } else {
            // If no maps are found, append a <p> element indicating this
            const noMapsMessage = document.createElement('p');
            noMapsMessage.textContent = 'No related maps found for this texture.';
            analysisTextureTypeTab.appendChild(noMapsMessage);
        }

    } catch (error) {
        console.error('Error fetching related maps:', error);
    }
}

export { runAnalysisTab };
