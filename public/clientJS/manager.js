// manager.js

import { runGalleryTab } from './tabGallery.js';
import { runAnalysisTab } from './tabAnalysis.js';
import { runVotingTab } from './tabVoting.js';

class Manager {
    constructor() {
        // Create variables for tab content divs and assign them as member variables
        this.tab1Div = document.getElementById('tab1-content');
        this.tab2Div = document.getElementById('tab2-content');
        this.tab3Div = document.getElementById('tab3-content');
        this.tab4Div = document.getElementById('tab4-content');
    }

    votingTab() {
        this.makeTabVisible('tab1');
        runVotingTab(this.tab1Div);
    }

    analysisTab(textureID) {
        this.makeTabVisible('tab2');

        // Check if textureID is provided
        if (textureID) {
            // If textureID is passed, use it as the second parameter
            runAnalysisTab(this.tab2Div, textureID, (textureID) => this.analysisTab(textureID));
            console.log(document.querySelector('#textureIDField').value);
        } else {
            // If not, default to using 11 as the second parameter
            runAnalysisTab(this.tab2Div, 3295, (textureID) => this.analysisTab(textureID));
            console.log(document.querySelector('#textureIDField').value);   
        }
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

