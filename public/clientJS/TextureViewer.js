// TextureViewer.ts
import { AppConfig } from './AppConfig.js';
import { resetImageSize } from './imageManipulation.js';
class TextureViewer {
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
        this.navBarElements = [];
        // variable to refer to the image element
        this.imageElement = this.parentDiv.querySelector('.big-texture-viewer');
        // variable to refer to the nav-bar at the top
        this.navBarElements = Array.from(this.parentDiv.querySelectorAll('.tex-type-navitem'));
    }
    // Method to replace the texture in the viewer
    replaceTexture(jpgURL) {
        if (this.imageElement) {
            this.imageElement.src = jpgURL;
            resetImageSize(); // Reset the image size when a new image is loaded
        }
        else {
            console.error(`No <img> element with class 'big-texture-viewer' found inside the div.`);
        }
    }
    // Method to populate the texture types navbar
    populateTextureTypesNavbar(tabTextureFileData) {
        this.resetAllTabs();
        this.navBarElements.forEach(tab => {
            const typeEnding = tab.getAttribute('data-type');
            if (typeEnding && tabTextureFileData.textureTypes[typeEnding]) {
                tab.classList.add('highlighted');
                // Add click event listener to the tab
                tab.addEventListener('click', () => {
                    this.setNavTabToActive(tab);
                    this.replaceTexture(tabTextureFileData.jpgURL.replace(/_n\.jpg$/, `${typeEnding}.jpg`));
                });
            }
        });
        this.activateTopPriorityNavTab();
    }
    activateTopPriorityNavTab() {
        // Get all highlighted tabs
        const highlightedTabs = this.navBarElements.filter(tab => tab.classList.contains('highlighted'));
        // 1. Try to activate the tab with data-type matching the priority texture type the user has set
        const priorityType = AppConfig.user.priorityTextureType;
        const priorityTab = highlightedTabs.find(tab => tab.getAttribute('data-type') === priorityType);
        if (priorityTab) {
            this.setNavTabToActive(priorityTab);
            return;
        }
        // 2. Try to activate the tab with data-type '_n'
        const nTab = highlightedTabs.find(tab => tab.getAttribute('data-type') === '_n');
        if (nTab) {
            this.setNavTabToActive(nTab);
            return;
        }
        // 3. Try to activate the tab with data-type '_a'
        const aTab = highlightedTabs.find(tab => tab.getAttribute('data-type') === '_a');
        if (aTab) {
            this.setNavTabToActive(aTab);
            return;
        }
        // 4. Otherwise, activate the first highlighted tab
        if (highlightedTabs.length > 0) {
            this.setNavTabToActive(highlightedTabs[0]);
        }
    }
    setNavTabToActive(navItem) {
        this.setAllNavTabsToInactive();
        navItem.classList.add('active');
    }
    setAllNavTabsToInactive() {
        this.navBarElements.forEach(tab => {
            tab.classList.remove('active');
        });
    }
    resetAllTabs() {
        this.navBarElements.forEach(tab => {
            tab.classList.remove('highlighted');
        });
    }
    setFallbackImage() {
        this.resetAllTabs();
        this.setAllNavTabsToInactive();
        this.imageElement.src = "/UXimg/image_not_available.png";
        resetImageSize();
    }
}
export { TextureViewer };
