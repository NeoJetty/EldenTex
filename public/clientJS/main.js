var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppConfig } from './AppConfig.js';
import Manager from './manager.js'; // Import the Manager class
// Declare the manager variable with a type annotation
let manager; // This will hold the Manager instance
function InitMainNavbarListener() {
    // Event listener for tab clicks
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
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
        }));
    });
    if (AppConfig.debug.level === 2)
        console.log('Main navbar listener initialized.');
}
// Readable sequence of execution
function InitInOrder() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (AppConfig.debug.level === 2)
                console.log('loadAllTabHTMLs loaded');
            // Create an instance of the Manager class
            manager = new Manager(); // Initialize here
            // Initialize the main navbar listener after all tabs are loaded
            InitMainNavbarListener();
            manager.votingTab();
            // Automatically click the first tab to load its content and set it active
            // document.querySelector('.tab-link[data-tab="tab1"]')?.click();
        }
        catch (error) {
            console.error('Error during initialization:', error);
        }
    });
}
// Start the initialization process
InitInOrder();
