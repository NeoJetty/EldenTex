// TabFilter.ts

import { AppConfig,TextureDataContainer } from "./AppConfig.js";
import { requestMultiFilterTextureData } from "./requestTextureData.js";
import { populateTags, requestTagsForImage, populateAllNeutralTags, submitFilterSearch } from "./tagPanel.js";
import { TextureViewer } from "./TextureViewer.js";

enum State {
    SearchSelection = 0,
    Tagging = 1,
}

interface SavedSearch {
    search_name: string;
    tag_filters: string; // Keep as string if it is stored as JSON string
}

class TabFilter {
    // default tab elements
    public contentDiv: HTMLDivElement;
    private textureViewer: TextureViewer;
    private rightMainDiv: HTMLDivElement;
    
    // filter-specific
    private state: State = State.SearchSelection;
    private filteredTextureData:TextureDataContainer[]  = [] 
    private filteredTextureActiveIndex = 0;
    private savedSearches: SavedSearch[] = [];

    constructor(contentDiv: HTMLDivElement) {
        this.contentDiv = contentDiv;
        this.rightMainDiv = this.contentDiv.querySelector('.right-main-container') as HTMLDivElement;
        this.textureViewer = new TextureViewer(contentDiv);

        let forward_button = contentDiv.querySelector('.forward-button');
        let backward_button = contentDiv.querySelector('.backward-button');
        forward_button?.addEventListener( 'click', () => {
            this.changeActiveTexture(+1);
        })
        backward_button?.addEventListener( 'click', () => {
            this.changeActiveTexture(-1);
        })

    }

    // -----------------------------
    // Member functions
    // -----------------------------

    async updateAll(): Promise<void> {
        this.rightMainDiv.innerHTML = '';

        await this.createSavedFilterSearchDropdown(this.rightMainDiv);
        this.rightMainDiv.appendChild(document.createElement('br'));

        if(this.state == State.SearchSelection){
            
            await populateAllNeutralTags(this.rightMainDiv);

            // Create the "Search" button
            const searchButton = document.createElement('button');
            searchButton.textContent = 'Search';
            searchButton.classList.add('search-button');

            // Create the "Save Filter" button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save Filter';
            saveButton.classList.add('search-button');

            // Append the button below the tags
            this.rightMainDiv.appendChild(searchButton);
            this.rightMainDiv.appendChild(saveButton);

            // Add event listener for the "Search" button click
            searchButton.addEventListener('click', async () => {
                this.onSearchButtonClick();
            });
            // Add event listener for the "Search" button click
            saveButton.addEventListener('click', async () => {
               this.onSaveButtonClick();
            });

        } else {

            // ------------------ update left hand image -------------
            if (this.filteredTextureData.length === 0) {
                this.textureViewer.setFallbackImage();
                return;
            }

            // extract the texture, that is at index filtered...Index. Starts at 0,
            // is set by user after that
            let data = this.filteredTextureData[this.filteredTextureActiveIndex];

            AppConfig.filterTab.updateFromImageDataJSON(data);
            this.textureViewer.replaceTexture(AppConfig.filterTab.jpgURL);
            this.textureViewer.populateTextureTypesNavbar(AppConfig.filterTab);

            // ------------------ tags -------------
            const textureID = data.textureID; // Use the textureID from the first image
            const preCheckedTags = await requestTagsForImage(textureID);
            populateTags(this.rightMainDiv, textureID, preCheckedTags);

        }

        
        
    }

   
    
    async createSavedFilterSearchDropdown(rightMainDiv: HTMLDivElement) {
        // Clear any existing content in the dropdown
        rightMainDiv.innerHTML = ''; // Make sure to clear any existing content
    
        try {
            // Fetch saved searches from the server for the specified user ID
            const response = await fetch(`/serveAllSavedFilterSearches/${AppConfig.user.ID}`);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            this.savedSearches = data.savedSearches; // Store the fetched searches
    
            // Create a select element for the dropdown
            const selectElement = document.createElement('select');
            selectElement.id = 'savedFilterDropdown';
    
            // Add the default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- new filter --';
            selectElement.appendChild(defaultOption);
    
            // Populate dropdown with saved searches
            this.savedSearches.forEach((search: SavedSearch) => { // Specify the type for 'search'
                const option = document.createElement('option');
                option.value = search.search_name; // Set the value to search_name
                option.textContent = search.search_name; // Display the search name
                selectElement.appendChild(option);
            });
    
            // Append the select element to the provided div
            rightMainDiv.appendChild(selectElement);
    
            // Add event listener for dropdown changes
            selectElement.addEventListener('change', () => this.onDropDownChange(selectElement));
        } catch (error) {
            console.error('Error fetching saved filter searches:', error);
            // Optionally, you can show an error message to the user
        }
    }
    
    private async onDropDownChange(selectElement: HTMLSelectElement) {
        const selectedValue = selectElement.value; // Get the selected option value
    
        if (selectedValue === '') {
            // Handle the case for the default option, if needed
            return;
        }
    
        // Find the selected saved search
        const selectedSearch = this.savedSearches.find(search => search.search_name === selectedValue);
        if (!selectedSearch) {
            console.error('Selected search not found:', selectedValue);
            return;
        }
    
        // Parse the tag filters from the saved search
        const tagFilters = JSON.parse(selectedSearch.tag_filters) as { tag_id: number, vote: boolean }[];
    
        this.rightMainDiv.innerHTML = '';
        // Refresh the tag list based on the tag filters
        populateAllNeutralTags(this.rightMainDiv, tagFilters);
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
            this.saveFilterSearch(searchName);

            // Hide the popup after submission
            popup.style.display = 'none';
        });

        // Handle the "Cancel" button click
        cancelButton.addEventListener('click', () => {
            popup.style.display = 'none'; // Just hide the popup
        });
    }

    async saveFilterSearch(searchName: string): Promise<void> {
        const tagToggles = this.contentDiv.querySelectorAll('.tag-toggle');
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
    
    changeActiveTexture(amount:number){
        if(this.filteredTextureData.length > 0){
            this.increaseFilteredTextureIndex(amount);
            this.updateAll();
        } else {
            console.log('Change Texture Button pressed, but no data');
        }
    }

    // increase/decrease index, but loop around if end of array is reached
    increaseFilteredTextureIndex(amount: number){
        this.filteredTextureActiveIndex += amount;
        if(this.filteredTextureActiveIndex > this.filteredTextureData.length-1) this.filteredTextureActiveIndex = 0;
        if(this.filteredTextureActiveIndex < 0) this.filteredTextureActiveIndex = this.filteredTextureData.length-1;
    }

    async onSearchButtonClick() {
        const tagToggles = this.contentDiv.querySelectorAll('.tag-toggle'); // Adjust the selector as needed
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
        
        // Call the function with the tags that are not neutral
        await this.getTexturesByTags(tags); // this.filteredTextureData side effect
        this.state = State.Tagging;
        this.updateAll();

    }
    
    // New function to filter textures based on selected tags
    async getTexturesByTags(tags: { tag_id: number, vote: boolean }[]): Promise<void> {
        try {
            const filteredData = await requestMultiFilterTextureData({ tags });
            this.filteredTextureData = filteredData.map((item: any) => {
                const textureData = new TextureDataContainer();
                textureData.textureID = item.id;
                textureData.textureName = item.textureName;
                textureData.textureTypes = item.textureTypes;
                return textureData;
            });

            // Here you can update the UI with the filtered textures if necessary
        } catch (error) {
            console.error('Error filtering textures:', error);
        }
    }
}

export default TabFilter;
