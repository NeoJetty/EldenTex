// Import functions from imageManipulation.js
import { handleZoom, resetImageSize, getHighResImageUrl, setCurrentImageUrl, setHighResImageUrl } from './imageManipulation.js';
import { GSettings } from './GSettings.js';

// Function to load content into a tab
function loadTabContent(tabId, url) {
    fetch(url)
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

// Function to fetch and display the random image
function loadRandomImage() {
    fetch('/random-image')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const imageElement = document.getElementById('random-image');
            if (imageElement) {
                const imageUrl = data.imageUrl;
                imageElement.src = imageUrl;
                
                // Update GSettings with the new data
                GSettings.tab1Image.imgID = data.id;
                GSettings.tab1Image.jpgURL = imageUrl;
                GSettings.tab1Image.textureTypes = data.textureTypes; // Use the new textureTypes
                
                // Update high-res image URL
                const highResUrl = getHighResImageUrl(imageUrl);
                setHighResImageUrl(highResUrl);
                
                // Reset image size when a new image is loaded
                resetImageSize();

                // Populate the navbar based on textureTypes
                PopulateTextureTypesNavbar();
            }
        })
        .catch(error => console.error('Error fetching random image:', error));
}

function PopulateTextureTypesNavbar() {
    const tabs = document.querySelectorAll('.tab-item');

    tabs.forEach(tab => {
        const type = tab.getAttribute('data-type');
        if (GSettings.tab1Image.textureTypes[type]) {
            // Apply a specific class or style to highlight the tab
            tab.classList.add('highlighted');
        } else {
            tab.classList.remove('highlighted');
        }
    });
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
                loadTabContent('tab1', 'Tab1_Content.html');
                loadRandomImage(); // Load random image for tab1
            } else {
                loadTabContent(targetTab, `Tab${targetTab.charAt(targetTab.length - 1)}_Content.html`);
                resetImageSize(); // Reset image size when switching tabs
            }
        });
    });
};

// Tabs are seperated in HTMLs for modularity. This makes it hard to use standard functions as some elements are not loaded in at all times.
function loadAllTabHTMLs(){
    // Initialize the page on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Load all tab content initially
        loadTabContent('tab1', 'Tab1_Content.html');
        loadTabContent('tab2', 'Tab2_Content.html');
        loadTabContent('tab3', 'Tab3_Content.html');
        loadTabContent('tab4', 'Tab4_Content.html');

        // Automatically click the first tab to load its content and set it active
        document.querySelector('.tab-link[data-tab="tab1"]').click();
    });
}


// readable squence of execution
function InitInOrder() {
    loadAllTabHTMLs();
    InitMainNavbarListener(); // black 4 tabs at the top
}

InitInOrder();
