import { AppConfig } from './AppConfig.js';
import Manager from './manager.js'; // Import the Manager class

// Declare the manager variable with a type annotation
let manager: Manager; // This will hold the Manager instance

function InitMainNavbarListener(): void {
    // Event listener for tab clicks
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', async (e: Event) => {
            e.preventDefault();

            // Ensure the target is an HTML element before accessing its attributes
            const target = e.target as HTMLElement;
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
    if (AppConfig.debug.level === 2) console.log('Main navbar listener initialized.');
}

// Readable sequence of execution
async function InitInOrder(): Promise<void> {
    try {
        if (AppConfig.debug.level === 2) console.log('loadAllTabHTMLs loaded');

        // Create an instance of the Manager class
        manager = new Manager(); // Initialize here

        // Initialize the main navbar listener after all tabs are loaded
        InitMainNavbarListener();

        manager.votingTab();

        // Automatically click the first tab to load its content and set it active
        // document.querySelector('.tab-link[data-tab="tab1"]')?.click();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Start the initialization process
InitInOrder();
