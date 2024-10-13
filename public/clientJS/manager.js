// manager.js

import { runGalleryTab } from './gallery.js';
import { runTextureAnalysisTab } from './textureAnalysis.js';
import { runVotingTab } from './votingTabManager.js';

class Manager {
    constructor() {
        // Create variables for tab content divs and assign them as member variables
        this.tab1Div = document.getElementById('tab1-content');
        this.tab2Div = document.getElementById('tab2-content');
        this.tab3Div = document.getElementById('tab3-content');
        this.tab4Div = document.getElementById('tab4-content');
    }

    votingTab() {
        runVotingTab(this.tab1Div);
    }

    analysisTab(textureID) {
        // Check if tab2 is active, and if not, make it active manually
        const tab2Link = document.querySelector('.tab-link[data-tab="tab2"]');
        const tab2Content = document.getElementById('tab2');

        if (!tab2Content.classList.contains('active')) {
            // Remove active class from all tab links and content sections
            document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
            document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));

            // Add active class to tab2 link and content
            tab2Link.classList.add('active');
            tab2Content.classList.add('active');
        }

        // Check if textureID is provided
        if (textureID) {
            // If textureID is passed, use it as the second parameter
            runTextureAnalysisTab(this.tab2Div, textureID);
        } else {
            // If not, default to using 11 as the second parameter
            runTextureAnalysisTab(this.tab2Div, 11);
        }
    }

    galleryTab() {
        // Pass the callback to runGalleryTab
        runGalleryTab(this.tab4Div, (textureID) => this.analysisTab(textureID));
    }
}

export default Manager;

