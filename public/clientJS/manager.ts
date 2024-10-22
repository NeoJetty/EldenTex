// manager.ts

import { runGalleryTab } from './tabGallery.js';
import { runAnalysisTab } from './tabAnalysis.js';
import { runVotingTab } from './tabVoting.js';
import { TabFilter } from './tabFilter.js';
import { AppConfig } from './AppConfig.js';

class Manager {
    private tab1Div: HTMLDivElement | null;
    private tab2Div: HTMLDivElement | null;
    private tab3Div: HTMLDivElement | null;
    private tab4Div: HTMLDivElement | null;
    private filterTabInstance: TabFilter;

    constructor() {
        // Assign the tab content divs to member variables
       // Use type assertion to cast the element to HTMLDivElement
        this.tab1Div = document.getElementById('tab1-content') as HTMLDivElement;
        this.tab2Div = document.getElementById('tab2-content') as HTMLDivElement;
        this.tab3Div = document.getElementById('tab3-content') as HTMLDivElement;
        this.tab4Div = document.getElementById('tab4-content') as HTMLDivElement;


        // Initialize FilterTab instance
        this.filterTabInstance = new TabFilter();

        this.setEventListenersCallingManager();
    }

    setEventListenersCallingManager(): void {
        // ---------------------------
        //     Gallery image grid
        // ---------------------------
        const imageGrid = document.getElementById('gallery-image-grid');
        if (imageGrid) {
            // Access all existing img elements in the grid
            const images = imageGrid.getElementsByTagName('img');

            // Loop through all the images
            for (let i = 0; i < images.length; i++) {
                const img = images[i];

                // Set the event listener for each image
                img.addEventListener('click', (event: Event) => {
                    const target = event.target as HTMLImageElement;
                    const textureID = target.alt; // Get the alt text at event time
                    this.analysisTab(Number(textureID)); // Call the callback with the texture ID as a number
                });
            }
        }
        // ---------------------------
        //     Analysis Tab Input Field?
        // ---------------------------
    }

    votingTab(): void {
        this.makeTabVisible('tab1');
        if (this.tab1Div) runVotingTab(this.tab1Div);
    }

    analysisTab(textureID?: number): void {
        this.makeTabVisible('tab2');
        
        // Check if textureID is provided
        if (textureID && this.tab2Div) {  // show texture by parameter

            runAnalysisTab(this.tab2Div, textureID, (newTextureID) => this.analysisTab(newTextureID));

        } else if (AppConfig.analysisTab.textureID === -1 && this.tab2Div) { // show default texture

            runAnalysisTab(this.tab2Div, 3295, (newTextureID) => this.analysisTab(newTextureID));

        } else if (this.tab2Div) { // show last viewed texture

            runAnalysisTab(this.tab2Div, AppConfig.analysisTab.textureID, (newTextureID) => this.analysisTab(newTextureID));
        }
    }

    filterTab(): void {
        this.makeTabVisible('tab3');
        if (this.tab3Div) {
            // Call the updateAll method from FilterTab class
            this.filterTabInstance.updateAll(this.tab3Div);
        }
    }

    galleryTab(): void {
        this.makeTabVisible('tab4');
        if (this.tab4Div) {
            // Pass the callback to the analysisTab to runGalleryTab
            runGalleryTab(this.tab4Div, (textureID) => this.analysisTab(textureID));
        }
    }

    makeTabVisible(nextActiveTab: string): void {
        if (this.isVisible(nextActiveTab)) return; // Don't change it if it is already visible

        // Remove active class from all content sections
        document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));
        // Remove active class from main navbar
        document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));

        // Set content div active/visible
        const nextActiveContent = document.getElementById(nextActiveTab);
        if (nextActiveContent) nextActiveContent.classList.add('active');
        
        // Mark navbar item as active
        const nextActiveNavbarItem = document.querySelector(`.tab-link[data-tab="${nextActiveTab}"]`);
        if (nextActiveNavbarItem) nextActiveNavbarItem.classList.add('active');
    }

    // Checks if tab is visible by looking for 'active' elements in the main navbar/HTML
    isVisible(nextActiveTab: string): boolean {
        const tabElement = document.querySelector(`.tab-link[data-tab="${nextActiveTab}"]`);

        // Check if the element exists and has the 'active' class
        return tabElement ? tabElement.classList.contains('active') : false;
    }
}

export default Manager;
