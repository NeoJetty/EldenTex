import { AppConfig } from './AppConfig.js';
import Manager from './Manager.js'; // Import the Manager class
import TabVoting from './TabVoting.js';
import TabAnalysis from './TabAnalysis.js';
import { TabFilter } from './TabFilter.js';
import TabGallery from './TabGallery.js';
// Declare the manager variable with a type annotation
let manager; // This will hold the Manager instance
function InitMainNavbarListener() {
    // Event listener for tab clicks
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            // Ensure the target is an HTML element before accessing its attributes
            const target = e.target;
            const nextActiveTabName = target.getAttribute('data-tab');
            if (nextActiveTabName) {
                // Change visibility of the tab (not the content)
                manager.makeTabVisible(nextActiveTabName);
                // Update tab content based on the active tab
                switch (nextActiveTabName) {
                    case 'tab1':
                        manager.votingTab();
                        break;
                    case 'tab2':
                        manager.analysisTab();
                        break;
                    case 'tab3':
                        manager.filterTab();
                        break;
                    case 'tab4':
                        manager.galleryTab();
                        break;
                    default:
                        console.error('Unknown tab:', nextActiveTabName);
                }
            }
        });
    });
}
// Readable sequence of execution
async function InitInOrder() {
    try {
        // Create instances of the tab classes
        const tabVoting = new TabVoting(document.getElementById('tab1-content'));
        const tabAnalysis = new TabAnalysis(document.getElementById('tab2-content'));
        const tabFilter = new TabFilter(document.getElementById('tab3-content'));
        const tabGallery = new TabGallery(document.getElementById('tab4-content'));
        // Create an instance of the Manager class and pass the tab instances and divs
        manager = new Manager(tabVoting, tabAnalysis, tabFilter, tabGallery);
        if (AppConfig.debug.level === 2)
            console.log('Manager created');
        // Initialize the main navbar listener after all tabs are loaded
        InitMainNavbarListener();
        if (AppConfig.debug.level === 2)
            console.log('Main navbar listener initialized.');
        // Activate the first tab on startup
        manager.votingTab();
    }
    catch (error) {
        console.error('Error during initialization:', error);
    }
}
// Start the initialization process
InitInOrder();
