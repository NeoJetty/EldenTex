// tagList.ts
import { Toggle, ToggleState } from './Toggle.js';
import { FilterTabState } from './TabFilter.js';
// DB access
import { fetchAllTags, fetchSavedFilterSearches, submitFilterSearch } from './requestTagRelatedData.js';
class TagList {
    constructor(tagContainer, callback) {
        this.toggles = [];
        this.textureID = -1;
        this.filter = [];
        this.savedSearches = [];
        this.tagContainer = tagContainer;
        this.textureUpdateCallback = callback;
    }
    async buildFilterSelection(preCheckedTagIDs = []) {
        try {
            //--------------------------------------
            //           Dropdown               
            //--------------------------------------
            this.filter = preCheckedTagIDs;
            // Build the saved search dropdown
            await this.createFavouriteFiltersDropdown();
            //--------------------------------------
            //           List               
            //--------------------------------------
            const tags = await fetchAllTags();
            // Sort tags by the specified order: General, Region, then Cultures
            this.buildToggleItems(tags, preCheckedTagIDs);
            this.setModeTo(FilterTabState.FilterSelectionMode);
            //--------------------------------------
            //           Buttons               
            //--------------------------------------
            // Create the "Search" button
            const searchButton = document.createElement('button');
            searchButton.textContent = 'Run Filter!';
            searchButton.classList.add('search-button');
            // Create the "Save Filter" button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save Filter';
            saveButton.classList.add('search-button');
            // Append the button below the tags
            this.tagContainer.appendChild(searchButton);
            this.tagContainer.appendChild(saveButton);
            // Add event listener for the "Search" button click
            searchButton.addEventListener('click', async () => {
                this.onRunFilterButtonClick();
            });
            // Add event listener for the "Save" button click
            saveButton.addEventListener('click', async () => {
                this.onSaveButtonClick();
            });
        }
        catch (error) {
            console.error("Failed to build tag list:", error);
        }
    }
    refreshWithTextureData(textureID, textureTags) {
        this.setModeTo(FilterTabState.TextureTaggingMode);
        this.textureID = textureID;
        this.toggles.forEach(toggle => {
            // Set the textureID to the provided one
            toggle.textureID = textureID;
            // Find the TagVote that matches the current toggle's tagID
            const tagVote = textureTags.find(tv => tv.tag_id === toggle.tagID);
            let nextToggleState = translateToToggleState(tagVote);
            toggle.forceState(nextToggleState); // also renders the toggle-img
        });
    }
    buildToggleItems(tags, preCheckedTagIDs = []) {
        // Sort tags by the specified order: General, Region, then Cultures
        const sortedTags = tags.sort((a, b) => {
            const categoryOrder = ["General", "Region", "Cultures"];
            return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        });
        // Group tags by category for a more organized UI
        let currentCategory = '';
        let categoryContainer = null;
        let rowDiv = null;
        sortedTags.forEach((tag, index) => {
            // Check if we're in a new category
            if (tag.category !== currentCategory) {
                // Create and append a new container for the category
                categoryContainer = document.createElement('div');
                categoryContainer.classList.add('category-container');
                // Create and add the category header
                const categoryHeader = document.createElement('h3');
                categoryHeader.textContent = tag.category;
                categoryContainer.appendChild(categoryHeader);
                // Append the category container to the main tag container
                this.tagContainer.appendChild(categoryContainer);
                currentCategory = tag.category;
                rowDiv = null; // Reset the row div for a new category
            }
            // Create a new row div every three items
            if (index % 4 === 0) {
                rowDiv = document.createElement('div');
                rowDiv.classList.add('tag-row');
                categoryContainer === null || categoryContainer === void 0 ? void 0 : categoryContainer.appendChild(rowDiv);
            }
            // Create and add the toggle for the tag
            const toggleDiv = this.createToggleForTag(tag, preCheckedTagIDs);
            rowDiv === null || rowDiv === void 0 ? void 0 : rowDiv.appendChild(toggleDiv);
        });
    }
    createToggleForTag(tag, preCheckedTagIDs) {
        // Find the TagVote object for this tag, if it exists
        const tagVote = preCheckedTagIDs.find(tv => tv.tag_id === tag.id);
        // Translate TagVote to initial ToggleState
        const initialState = tagVote ? translateToToggleState(tagVote) : ToggleState.NEUTRAL;
        // Create and add the Toggle instance
        const toggle = new Toggle(tag.id, this.textureID, tag.name, initialState);
        this.toggles.push(toggle);
        // Return the toggle element so it can be appended in buildToggleItems
        return toggle.elementNode;
    }
    setModeTo(state) {
        if (state == FilterTabState.FilterSelectionMode) {
            this.toggles.forEach(element => {
                element.forceState(ToggleState.NEUTRAL);
                element.setDBWriteListenerActive(false);
            });
        }
        else {
            // unimplemented updateByTextureID
            this.toggles.forEach(element => {
                element.setDBWriteListenerActive(true);
            });
        }
    }
    async createFavouriteFiltersDropdown() {
        try {
            const data = await fetchSavedFilterSearches();
            this.savedSearches = data.savedSearches;
            const selectElement = document.createElement('select');
            selectElement.id = 'savedFilterDropdown';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- new filter --';
            selectElement.appendChild(defaultOption);
            this.savedSearches.forEach((search) => {
                const option = document.createElement('option');
                option.value = search.search_name;
                option.textContent = search.search_name;
                selectElement.appendChild(option);
            });
            this.tagContainer.appendChild(selectElement);
            this.tagContainer.appendChild(document.createElement('br'));
            selectElement.addEventListener('change', () => this.onDropDownChange(selectElement));
        }
        catch (error) {
            console.error('Error fetching saved filter searches:', error);
        }
    }
    onSaveButtonClick() {
        // Show the popup
        const popup = document.getElementById('popup-container');
        popup.style.display = 'block';
        // Handle the "Send" button click
        const sendButton = document.getElementById('send-button');
        const cancelButton = document.getElementById('cancel-button');
        sendButton.addEventListener('click', () => {
            const searchNameInput = document.getElementById('search-name-input');
            const searchName = searchNameInput.value;
            if (!searchName) {
                alert('Please enter a search name.');
                return;
            }
            // Now save the filter with the search name
            this.saveNewFavouriteFilter(searchName);
            // Hide the popup after submission
            popup.style.display = 'none';
        });
        // Handle the "Cancel" button click
        cancelButton.addEventListener('click', () => {
            popup.style.display = 'none'; // Just hide the popup
        });
    }
    async saveNewFavouriteFilter(searchName) {
        const tagToggles = this.tagContainer.querySelectorAll('.tag-toggle');
        const tags = [];
        tagToggles.forEach((toggle) => {
            const tagToggle = toggle;
            const tagId = parseInt(tagToggle.getAttribute('data-tag-id') || '0', 10);
            const state = tagToggle.getAttribute('data-state');
            if (state === 'on') {
                tags.push({ tag_id: tagId, vote: true });
            }
            else if (state === 'off') {
                tags.push({ tag_id: tagId, vote: false });
            }
            else if (state === 'neutral') {
                return; // Ignore neutral state
            }
        });
        const filterData = {
            searchName: searchName, // Append the search name
            tags: tags, // Attach the tag data
        };
        try {
            // Call the external function to handle the request
            await submitFilterSearch(filterData);
            console.log(`Filter saved with name: ${searchName}`);
        }
        catch (error) {
            console.error('Error saving filter:', error);
        }
    }
    async onDropDownChange(selectElement) {
        const selectedFilter = selectElement.value; // Get the selected option value
        // Find the selected saved search
        const selectedSearch = this.savedSearches.find(search => search.search_name === selectedFilter);
        if (!selectedSearch) {
            console.error('Tag based filter not found:', selectedFilter);
            return;
        }
        // Parse the tag filters from the saved search
        const tagFilters = JSON.parse(selectedSearch.tag_filters);
        this.tagContainer.innerHTML = '';
        // Refresh the tag list based on the tag filters
        // TODO implement other state
        // populateAllNeutralTags(this.tagContainer, tagFilters);
    }
    async onRunFilterButtonClick() {
        const tags = []; // Initialize an empty array to hold the tags
        this.toggles.forEach(toggle => {
            const tagId = toggle.tagID;
            const state = toggle.currentState;
            // Translate ToggleState to vote boolean
            if (state === ToggleState.ON) {
                tags.push({ tag_id: tagId, vote: true });
            }
            else if (state === ToggleState.OFF) {
                tags.push({ tag_id: tagId, vote: false });
            }
            // ToggleState.NEUTRAL is ignored, no action needed
        });
        // Now, tags array is ready to be used for further processing
        this.textureUpdateCallback(tags);
    }
    updateTextureID(id) {
        this.textureID = id;
        this.toggles.forEach(toggle => {
            toggle.textureID = id;
        });
    }
}
function translateToToggleState(vote) {
    if (vote == null) {
        // If vote is undefined or null, return NEUTRAL state immediately
        return ToggleState.NEUTRAL;
    }
    else if (vote.vote === true) {
        return ToggleState.ON;
    }
    else if (vote.vote === false) {
        return ToggleState.OFF;
    }
    else {
        // Any other case that doesn’t match expected boolean values
        return ToggleState.NEUTRAL;
    }
}
export { TagList };
