// TabFilter.ts

import { AppConfig,TextureDataContainer } from "./AppConfig.js";
import { requestMultiFilterTextureData } from "./requestTextureData.js";
import { TagList, TagVote } from "./TagList.js";
import { populateTags, requestTagsForImage, populateAllNeutralTags, submitFilterSearch } from "./tagPanel.js";
import { TextureViewer } from "./TextureViewer.js";

enum FilterTabState {
    FilterSelectionMode = 0,
    TextureTaggingMode = 1,
}

class TabFilter {
    // default tab elements
    public contentDiv: HTMLDivElement;
    private textureViewer: TextureViewer;
    private rightMainDiv: HTMLDivElement;
    private tagList: TagList;
    
    // filter-specific
    private state: FilterTabState = FilterTabState.FilterSelectionMode;
    private filteredTextureData:TextureDataContainer[]  = [] 
    private filteredTextureActiveIndex = 0;

    constructor(contentDiv: HTMLDivElement) {

        // Save commonly accessed div elements
        this.contentDiv = contentDiv;
        this.rightMainDiv = this.contentDiv.querySelector('.right-main-container') as HTMLDivElement;

        // set up managing classes
        this.tagList = new TagList(
            this.rightMainDiv,  
            (filter: TagVote[]) => {
                this.filterTexturesAndShowFirst(filter);
            }
        );
        this.textureViewer = new TextureViewer(contentDiv);

        // set up buttons
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

        if(this.state == FilterTabState.FilterSelectionMode){
            await this.tagList.buildFilterSelection();  // empty call should initiate as neutral

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
      
    filterTexturesAndShowFirst(filter: TagVote[]){
        console.log(filter);
        
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

export { TabFilter, FilterTabState };
