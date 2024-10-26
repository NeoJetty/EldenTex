// tagList.ts

import { AppConfig } from './AppConfig.js';
import { Toggle, ToggleState } from './Toggle.js';
import { FilterTabState } from './TabFilter.js';

// DB access
import { fetchAllTags, fetchSavedFilterSearches, submitFilterSearch } from './requestTagRelatedData.js'

interface Tag {
    id: number;
    name: string;
    category: string;
}

interface TagVote {
    tag_id: number;
    vote: boolean;
}

// this is a database friendly serialization of an array of tag_id/vote tuples
interface serializedFilter {
    search_name: string;
    tag_filters: string;
}

class TagList {
    private toggles: Toggle[] = [];
    private tagContainer: HTMLDivElement;
    private textureID: number = -1;
    private filter: TagVote[] = [];
    private savedSearches: serializedFilter[] = [];
    private textureUpdateCallback: (filter: TagVote[]) => void;

    constructor(tagContainer: HTMLDivElement, callback:(filter: TagVote[]) => void) {
        this.tagContainer = tagContainer;
        this.textureUpdateCallback = callback;

    }

    public async buildFilterSelection(preCheckedTagIDs: TagVote[] = []): Promise<void> {
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
                this.onSearchButtonClick();
            });
            // Add event listener for the "Save" button click
            saveButton.addEventListener('click', async () => {
               this.onSaveButtonClick();
            });



        } catch (error) {
            console.error("Failed to build tag list:", error);
        }
    }

    private buildToggleItems(tags: Tag[], preCheckedTagIDs: TagVote[] = []): void {
        // Sort tags by the specified order: General, Region, then Cultures
        const sortedTags = tags.sort((a, b) => {
            const categoryOrder = ["General", "Region", "Cultures"];
            return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        });
    
        // Group tags by category for a more organized UI
        let currentCategory = '';
        sortedTags.forEach(tag => {
            if (tag.category !== currentCategory) {
                // Add a header for each new category
                const categoryHeader = document.createElement('h3');
                categoryHeader.textContent = tag.category;
                this.tagContainer.appendChild(categoryHeader);
                currentCategory = tag.category;
            }
            this.createToggleForTag(tag, preCheckedTagIDs);
        });
    }
    
    private createToggleForTag(tag: Tag, preCheckedTagIDs: TagVote[]): void {
        // Find the TagVote object for this tag, if it exists
        const tagVote = preCheckedTagIDs.find(tv => tv.tag_id === tag.id);
    
        // Translate TagVote to initial ToggleState
        const initialState = tagVote ? translateToToggleState(tagVote) : ToggleState.NEUTRAL;
    
        // Create and add the Toggle instance
        const toggle = new Toggle(tag.id, this.textureID, tag.name, initialState);
        this.toggles.push(toggle);
    
        // Attach the toggle element to the container
        this.tagContainer.appendChild(toggle.elementNode);
    }
    
    private setModeTo(state: FilterTabState){
        if(state == FilterTabState.FilterSelectionMode){
            this.toggles.forEach(element => {
                element.forceState(ToggleState.NEUTRAL);
                element.setDBWriteListenerActive(false);
            });
        } else {
            // unimplemented updateByTextureID
            this.toggles.forEach(element => {
                element.setDBWriteListenerActive(true);
            });
        }
    }

    private async createFavouriteFiltersDropdown(): Promise<void> {
        try {
            const data = await fetchSavedFilterSearches();
            this.savedSearches = data.savedSearches;

            const selectElement = document.createElement('select');
            selectElement.id = 'savedFilterDropdown';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- new filter --';
            selectElement.appendChild(defaultOption);

            this.savedSearches.forEach((search: serializedFilter) => {
                const option = document.createElement('option');
                option.value = search.search_name;
                option.textContent = search.search_name;
                selectElement.appendChild(option);
            });

            this.tagContainer.appendChild(selectElement);
            this.tagContainer.appendChild(document.createElement('br'));
            selectElement.addEventListener('change', () => this.onDropDownChange(selectElement));
        } catch (error) {
            console.error('Error fetching saved filter searches:', error);
        }
    }

    onSaveButtonClick(): void {
        // Show the popup
        const popup = document.getElementById('popup-container') as HTMLElement;
        popup.style.display = 'block';

        // Handle the "Send" button click
        const sendButton = document.getElementById('send-button') as HTMLButtonElement;
        const cancelButton = document.getElementById('cancel-button') as HTMLButtonElement;

        sendButton.addEventListener('click', () => {
            const searchNameInput = document.getElementById('search-name-input') as HTMLInputElement;
            const searchName: string = searchNameInput.value;

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

    async saveNewFavouriteFilter(searchName: string): Promise<void> {
        const tagToggles = this.tagContainer.querySelectorAll('.tag-toggle');
        const tags: { tag_id: number; vote: boolean }[] = [];

        tagToggles.forEach((toggle: Element) => {
            const tagToggle = toggle as HTMLElement;
            const tagId = parseInt(tagToggle.getAttribute('data-tag-id') || '0', 10);
            const state = tagToggle.getAttribute('data-state');

            if (state === 'on') {
                tags.push({ tag_id: tagId, vote: true });
            } else if (state === 'off') {
                tags.push({ tag_id: tagId, vote: false });
            } else if (state === 'neutral') {
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
        } catch (error) {
            console.error('Error saving filter:', error);
        }
    }

    private async onDropDownChange(selectElement: HTMLSelectElement) {
        const selectedFilter = selectElement.value; // Get the selected option value
       
        // Find the selected saved search
        const selectedSearch = this.savedSearches.find(search => search.search_name === selectedFilter);
        if (!selectedSearch) {
            console.error('Tag based filter not found:', selectedFilter);
            return;
        }
    
        // Parse the tag filters from the saved search
        const tagFilters = JSON.parse(selectedSearch.tag_filters) as { tag_id: number, vote: boolean }[];
    
        this.tagContainer.innerHTML = '';
        // Refresh the tag list based on the tag filters
        // TODO implement other state
        // populateAllNeutralTags(this.tagContainer, tagFilters);
    }

    async onSearchButtonClick() {
        const tagToggles = this.tagContainer.querySelectorAll('.tag-toggle'); // Adjust the selector as needed
        const tags: { tag_id: number; vote: boolean }[] = []; // Initialize an empty array to hold the tags
    
        tagToggles.forEach((toggle: Element) => {
            // Assert toggle as HTMLElement
            const tagToggle = toggle as HTMLElement;
    
            const tagId = parseInt(tagToggle.getAttribute('data-tag-id') || '0', 10);
            const state = tagToggle.getAttribute('data-state');
    
            // Translate the state to vote boolean
            if (state === 'on') {
                tags.push({ tag_id: tagId, vote:true });
            } else if (state === 'off') {
                tags.push({ tag_id: tagId, vote:false });
            } else if (state === 'neutral') {
                // Neutral state is ignored, we can return early
                return; 
            }
        });
        
        this.textureUpdateCallback(tags);
    }

}

function translateToToggleState(vote: TagVote): ToggleState {
    if (vote.vote === true) {
        return ToggleState.ON;
    } else if (vote.vote === false) {
        return ToggleState.OFF;
    } else {
        // In case vote is null, undefined, or doesn't match expected values
        return ToggleState.NEUTRAL;
    }
}

export { TagList, TagVote, Tag };
