// main.js

import { AppConfig } from './AppConfig.js';
import { handleZoom, resetImageSize } from './imageManipulation.js';
import Manager from './manager.js'; // Import the Manager class
import { testTypescript } from './testTsc.js';

// Declare the manager variable in a broader scope
/** @type {Manager} */
let manager; // This will hold the Manager instance

// Function to load content into a tab
function initializeButtons() {
    const zoomInButton = document.querySelector('.zoom-in');
    const zoomOutButton = document.querySelector('.zoom-out');
    zoomInButton.addEventListener('click', () => handleZoom('in'));
    zoomOutButton.addEventListener('click', () => handleZoom('out'));
}

function InitMainNavbarListener() {
    // Event listener for tab clicks
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            let nextActiveTabName = e.target.getAttribute('data-tab')

            // change visibility of the tab (not the content)
            manager.makeTabVisible(nextActiveTabName);

            // Update tab content
            if (nextActiveTabName === 'tab1') {
                manager.votingTab();
            } else if (nextActiveTabName === 'tab2'){
                manager.analysisTab();
            } else if (nextActiveTabName === 'tab4') {
                manager.galleryTab();
            }
        });
    });
    if(AppConfig.debug.level == 2) console.log('Main navbar listener initialized.');
}

// Readable sequence of execution
async function InitInOrder() {
    try {
        if(AppConfig.debug.level == 2) console.log('loadAllTabHTMLs loaded');

        // Create an instance of the Manager class
        manager = new Manager(); // Initialize here

        // Initialize the main navbar listener after all tabs are loaded
        InitMainNavbarListener();

        initializeButtons();

        manager.votingTab();
        // Automatically click the first tab to load its content and set it active
        //document.querySelector('.tab-link[data-tab="tab1"]').click();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
    let somestring = testTypescript('angela',19);
    console.log(somestring);
}

// Start the initialization process
InitInOrder();
