// manager.js

import { runGalleryTab } from './gallery.js';
import { runTextureAnalysisTab } from './singleTextureAnalysis.js';
import { runVotingTab } from './votingTabManager.js';

class Manager {
    constructor() {
        // Create variables for tab content divs and assign them as member variables
        this.tab1Div = document.querySelector('#tab1-content');
        this.tab2Div = document.querySelector('#tab1-content');
        this.tab3Div = document.querySelector('#tab1-content');
        this.tab4Div = document.querySelector('#tab1-content');
    }

    galleryTab(){
        runGalleryTab();
    }

    analysisTab(){
        runTextureAnalysisTab();
    }

    votingTab(){
        runVotingTab();
    }
    // Additional methods can be added here as needed
}

export default Manager;
