// Manager.ts
import { AppConfig } from './AppConfig.js';
class Manager {
    constructor(_tabVoting, _tabAnalysis, _tabFilter, _tabGallery) {
        // Initialize FilterTab instance
        this.tabVoting = _tabVoting;
        this.tabAnalysis = _tabAnalysis;
        this.tabFilter = _tabFilter;
        this.tabGallery = _tabGallery;
        this.setEventListenersCallingManager();
    }
    setEventListenersCallingManager() {
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
                img.addEventListener('click', (event) => {
                    const target = event.target;
                    const textureID = target.alt; // Get the alt text at event time
                    this.analysisTab(Number(textureID));
                });
            }
        }
        // ---------------------------
        //     Analysis Tab Input Field? or do it in TabAnalysis Tab
        // ---------------------------
    }
    votingTab() {
        this.makeTabVisible('tab1');
        this.tabVoting.updateAll();
    }
    analysisTab(textureID) {
        this.makeTabVisible('tab2');
        // Check if textureID is provided
        if (textureID) { // show texture by parameter
            this.tabAnalysis.updateAll(textureID);
        }
        else if (AppConfig.analysisTab.textureID === -1) { // show default texture
            this.tabAnalysis.updateAll(3295);
        }
        else { // show last viewed texture
            this.tabAnalysis.updateAll(AppConfig.analysisTab.textureID);
        }
    }
    filterTab() {
        this.makeTabVisible('tab3');
        // Call the updateAll method from FilterTab class
        this.tabFilter.updateAll();
    }
    galleryTab() {
        this.makeTabVisible('tab4');
        // Pass the callback to the analysisTab to runGalleryTab
        this.tabGallery.updateAll();
    }
    makeTabVisible(nextActiveTab) {
        if (this.isVisible(nextActiveTab))
            return; // Don't change it if it is already visible
        // Remove active class from all content sections
        document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));
        // Remove active class from main navbar
        document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
        // Set content div active/visible
        const nextActiveContent = document.getElementById(nextActiveTab);
        if (nextActiveContent)
            nextActiveContent.classList.add('active');
        // Mark navbar item as active
        const nextActiveNavbarItem = document.querySelector(`.tab-link[data-tab="${nextActiveTab}"]`);
        if (nextActiveNavbarItem)
            nextActiveNavbarItem.classList.add('active');
    }
    // Checks if tab is visible by looking for 'active' elements in the main navbar/HTML
    isVisible(nextActiveTab) {
        const tabElement = document.querySelector(`.tab-link[data-tab="${nextActiveTab}"]`);
        // Check if the element exists and has the 'active' class
        return tabElement ? tabElement.classList.contains('active') : false;
    }
}
export default Manager;
