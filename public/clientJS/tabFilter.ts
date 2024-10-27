// TabFilter.ts

import { AppConfig,TextureDataContainer } from "./AppConfig.js";
import { requestMultiFilterTextureData } from "./requestTextureData.js";
import { TagList, TagVote } from "./TagList.js";
import { requestTagsForImage } from "./tagPanel.js";
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
    private initialized: boolean = false;
    
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

        //--------------------------------------
        //       Initialize Tag List Once                
        //--------------------------------------
        if(this.initialized == false){
            await this.tagList.buildFilterSelection(); // initiate tag list as neutral
            this.initialized = true;
        }

        //--------------------------------------
        //      Filter and Request Textures                
        //--------------------------------------
        if(this.state == FilterTabState.FilterSelectionMode){

            // nothing for now


        //--------------------------------------
        //       Show and Tag Textures                
        //--------------------------------------    
        } else { // FilterTabState.TextureTaggingMode

            //--------------------------------------
            //            Texture viewer                
            //--------------------------------------
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

            //--------------------------------------
            //            Tagging App             
            //--------------------------------------
            const textureTags = await requestTagsForImage(data.textureID);
            this.tagList.refreshWithTextureData(data.textureID, textureTags);
        }    
    }
      
    async filterTexturesAndShowFirst(filter: TagVote[]){
        this.state = FilterTabState.TextureTaggingMode;
        await this.getTexturesByTags(filter); 
        this.updateAll();  
    }

    changeActiveTexture(amount:number){
        if(this.filteredTextureData.length > 0){
            this.increaseFilteredTextureIndex(amount);

            // inform tagList so that the db-entries use the right textureID
            let textureID = this.filteredTextureData[this.filteredTextureActiveIndex].textureID;
            this.tagList.updateTextureID(textureID);

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
    async getTexturesByTags(filter: TagVote[]): Promise<void> {
        try {
            const filteredData = await requestMultiFilterTextureData({ tags: filter });
            this.filteredTextureActiveIndex = 0;
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
