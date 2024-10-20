// manager.js

import { runGalleryTab } from './tabGallery.js';
import { runAnalysisTab } from './tabAnalysis.js';
import { runVotingTab } from './tabVoting.js';
import { runFilterTab } from './tabFilter.js';
import { AppConfig } from './AppConfig.js';

class Manager {
    constructor() {
        // Create variables for tab content divs and assign them as member variables
        this.tab1Div = document.getElementById('tab1-content');
        this.tab2Div = document.getElementById('tab2-content');
        this.tab3Div = document.getElementById('tab3-content');
        this.tab4Div = document.getElementById('tab4-content');
        this.setEventListenersCallingManager();
    }

    setEventListenersCallingManager() {
        // ---------------------------
        //     Gallery image grid
        // ---------------------------

        const imageGrid = document.getElementById('gallery-image-grid');
        // Access all existing img elements in the grid
        const images = imageGrid.getElementsByTagName('img'); 
    
        // Loop through all the images
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
    
            // Set the event listener for each image
            img.addEventListener('click', (event) => {
                const textureID = event.target.alt; // Get the alt text at event time
                this.analysisTab(textureID); // Call the callback with the texture name
            });
        }

        // ---------------------------
        //     Analysis input field
        // ---------------------------
        // can probably stay the same for now
        // I'm not sure if i wanna move the responsibility to tabAnalysis
        // since the call theoretically points back to the tabAnalysis and does not need to invole Manager
    }

    votingTab() {
        this.makeTabVisible('tab1');
        runVotingTab(this.tab1Div);
    }

    analysisTab(textureID) {
        this.makeTabVisible('tab2');
        
        // Check if textureID is provided
        if (textureID) {  // show texture by parameter
            
            runAnalysisTab(this.tab2Div, textureID, (textureID) => this.analysisTab(textureID));

        } else if (AppConfig.analysisTab.textureID == -1) { // show default texture

            runAnalysisTab(this.tab2Div, 3295, (textureID) => this.analysisTab(textureID)); 

        } else { // show last viewed texture

            runAnalysisTab(this.tab2Div, AppConfig.analysisTab.textureID, (textureID) => this.analysisTab(textureID));

        }
    }

    filterTab(){
        runFilterTab(this.tab3Div);
    }

    galleryTab() {
        this.makeTabVisible('tab4');
        // Pass the callback to the analysisTab to runGalleryTab
        runGalleryTab(this.tab4Div, (textureID) => this.analysisTab(textureID));
    }

    makeTabVisible(nextActiveTab){
        if(this.isVisible(nextActiveTab)) return; // don't change it if it is already visible

        // Remove active class from all content sections
        document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));
        // Remove active class from main navbar
        document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));

        // set content div active/visible
        document.getElementById(nextActiveTab).classList.add('active');
        // mark navbar item as active
        let nextActiveNavbarItem = document.querySelector(`.tab-link[data-tab="${nextActiveTab}"]`);
        // To add the 'active' class to the element
        nextActiveNavbarItem.classList.add('active');
    }

    // checks if tab is visible by looking for 'active' elemets in the main navbar/HTML
    isVisible(nextActiveTab) {
        const tabElement = document.querySelector(`.tab-link[data-tab="${nextActiveTab}"]`);
        
        // Check if the element exists and has the 'active' class
        if (tabElement && tabElement.classList.contains('active')) {
            return true; // Tab is already active
        }
        return false; // Tab is not active
    }
}

export default Manager;

