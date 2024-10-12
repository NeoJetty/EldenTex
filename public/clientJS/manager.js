// manager.js

import { runGalleryTab } from './gallery.js';
import { runTextureAnalysisTab } from './singleTextureAnalysis.js';
import { runVotingTab } from './votingTabManager.js';

class Manager {
    constructor() {
        // Create variables for tab content divs and assign them as member variables
        this.tab1Div = document.getElementById('tab1-content');
        this.tab2Div = document.getElementById('tab2-content');
        this.tab3Div = document.getElementById('tab3-content');
        this.tab4Div = document.getElementById('tab4-content');
    }

    

    votingTab(){
        runVotingTab(this.tab1Div);        
    }
    analysisTab(){
        runTextureAnalysisTab(this.tab2Div);     
    }
    galleryTab(){
        runGalleryTab(this.tab4Div);
    }
}

export default Manager;
