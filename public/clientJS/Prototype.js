// Prototype.js

// This is the file where all the code is put before refactoring, just the newest functionality. Hopefully
// this will be refactored into smaller files soon

import { handleZoom, resetImageSize } from './imageManipulation.js';
import { loadRandomImage } from './requestImageData.js'
import { createVotingUI } from './votingYesNo.js';

// Function to load content into a tab
function loadTabContent(tabId, url) {
    return fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(tabId).innerHTML = data;

            // After loading content, check if zoom buttons exist and bind events
            if (tabId === 'tab1') { // Only look for zoom buttons in tab1
                const zoomInButton = document.querySelector('.zoom-in');
                const zoomOutButton = document.querySelector('.zoom-out');

                if (zoomInButton) {
                    zoomInButton.addEventListener('click', () => handleZoom('in'));
                }

                if (zoomOutButton) {
                    zoomOutButton.addEventListener('click', () => handleZoom('out'));
                }
            }
        })
        .catch(error => console.error('Error loading content:', error));
}


function InitMainNavbarListener(){
    // Event listener for tab clicks
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all content sections
            document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));

            // Remove active class from all tabs
            document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));

            // Add active class to the clicked tab and its corresponding content section
            const targetTab = e.target.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            e.target.classList.add('active');

            // Load content for the active tab
            if (targetTab === 'tab1') {
                //loadTabContent('tab1', 'Tab1_Content.html');
                startJSForTab();
            } else {
                loadTabContent(targetTab, `Tab${targetTab.charAt(targetTab.length - 1)}_Content.html`);
                resetImageSize(); // Reset image size when switching tabs
            }
        });
    });
};

function startJSForTab() {
    loadRandomImage(); // Load random image for tab1
    loadButtons();
    loadTagContent();
}

function loadButtons(){
    // hardcoded for now
}

function loadTagContent(){
    createVotingUI();
}

// Tabs are seperated in HTMLs for modularity. This makes it hard to use standard functions as some elements are not loaded in at all times.
function loadAllTabHTMLs() {
    // Initialize the page on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Load all tab content and wait for all to complete
            await Promise.all([
                loadTabContent('tab1', 'Tab1_Content.html'),
                loadTabContent('tab2', 'Tab2_Content.html'),
                loadTabContent('tab3', 'Tab3_Content.html'),
                loadTabContent('tab4', 'Tab4_Content.html')
            ]);

            // Automatically click the first tab to load its content and set it active
            document.querySelector('.tab-link[data-tab="tab1"]').click();
        } catch (error) {
            console.error('Error loading all tab content:', error);
        }
    });
}

// readable squence of execution
function InitInOrder() {
    loadAllTabHTMLs();
    InitMainNavbarListener(); // black 4 tabs at the top
}

InitInOrder();
