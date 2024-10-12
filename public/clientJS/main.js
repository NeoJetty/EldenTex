// main.js

import { AppConfig } from './AppConfig.js';
import { handleZoom, resetImageSize } from './imageManipulation.js';
import Manager from './manager.js'; // Import the Manager class

// Declare the manager variable in a broader scope
/** @type {Manager} */
let manager; // This will hold the Manager instance

// Function to load content into a tab
async function loadTabContent(tabId, url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        document.getElementById(tabId).innerHTML = data;

        // After loading content, check if zoom buttons exist and bind events
        if (tabId === 'tab1' || tabId === 'tab2') {
            const zoomInButton = document.querySelector('.zoom-in');
            const zoomOutButton = document.querySelector('.zoom-out');

            if (zoomInButton) {
                zoomInButton.addEventListener('click', () => handleZoom('in'));
            }

            if (zoomOutButton) {
                zoomOutButton.addEventListener('click', () => handleZoom('out'));
            }
        }
    } catch (error) {
        console.error(`Error loading content for ${tabId}:`, error);
    }
}

function InitMainNavbarListener() {
    // Event listener for tab clicks
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            // Remove active class from all content sections
            document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));

            // Remove active class from all tabs
            document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));

            // Add active class to the clicked tab and its corresponding content section
            const targetTab = e.target.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            e.target.classList.add('active');

            // Check if any elements in the current tab have to be updated
            if (targetTab === 'tab1') {
                manager.votingTab();
            } else if (targetTab === 'tab4') {
                manager.galleryTab();
            } else if (targetTab === 'tab2') {
                manager.analysisTab();
            } else {
                // Load content for all other tabs dynamically
                await loadTabContent(targetTab, `Tab${targetTab.charAt(targetTab.length - 1)}_Content.html`);
            }
        });
    });
    if(AppConfig.debug.level == 2) console.log('Main navbar listener initialized.');
}

// Tabs are separated in HTMLs for modularity. This makes it hard to use standard functions as some elements are not loaded in at all times.
async function loadAllTabHTMLs() {
    // This function does not need to be async anymore
    return Promise.all([
        loadTabContent('tab1', 'Tab1_Content.html'),
        loadTabContent('tab2', 'Tab2_Content.html'),
        loadTabContent('tab3', 'Tab3_Content.html'),
        loadTabContent('tab4', 'Tab4_Content.html')
    ]).catch(error => {
        console.error('Error loading all tab content:', error);
    });
}

// Readable sequence of execution
async function InitInOrder() {
    try {
        // Load all tab HTMLs and wait for them to be loaded
        await loadAllTabHTMLs();
        if(AppConfig.debug.level == 2) console.log('loadAllTabHTMLs loaded');

        // Create an instance of the Manager class
        manager = new Manager(); // Initialize here

        // Initialize the main navbar listener after all tabs are loaded
        InitMainNavbarListener();

        // Automatically click the first tab to load its content and set it active
        document.querySelector('.tab-link[data-tab="tab1"]').click();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Start the initialization process
InitInOrder();
