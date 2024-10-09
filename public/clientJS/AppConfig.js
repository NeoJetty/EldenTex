/**
 * AppConfig
 * 
 * This class serves as a global configuration store for the application, 
 * encapsulating various settings and state information needed across 
 * different components. The properties within AppConfig include:
 * 
 * - folders: Contains paths for different image formats (e.g., JPG, PNG).
 * - zoom: Manages zoom-related settings, including zoom factor, minimum, 
 *   and maximum zoom levels.
 * - tab1Image: Stores information specific to the first tab's image, 
 *   including the image ID, URLs for both JPG and PNG formats, and a 
 *   collection of texture types to determine available image variations.
 * - user: Contains details about the current user, including user ID, 
 *   name, theme preference, and language setting.
 * 
 * Additionally, AppConfig includes methods for constructing image 
 * URLs based on texture types and updating its properties from 
 * incoming JSON data.
 */
class AppConfig {
    constructor() {
        // Singleton
        if (AppConfig.instance) {
            return AppConfig.instance; // Return the existing instance
        }
        AppConfig.instance = this; // Store the instance

        // Initialize properties
        this.folders = {
            jpgs: '/AllAET_JPG/',
            pngs: '/AllAET_PNG/',
        };
        this.zoom = {
            zoomFactor: 1,
            minZoom: 1,
            maxZoom: 4.0,
        };
        this.tab1Image = {
            imgID: -1,
            jpgURL: '',
            pngURL: '',
            textureTypes: { 
                _a: false,
                _n: false,
                _r: false,
                _v: false,
                _d: false,
                _em: false,
                _3m: false,
                _b: false,
                _g: false,
                _1m: false,
                _van: false,
                _vat: false,
            },
        };
        this.user = {
            ID: 1,
            name: 'NeoJetty',
            theme: 'dark',
            language: 'en',
        };
    }

    // ---------------------------------------------
    //              helper methods
    // ---------------------------------------------

    // Method to construct high-res PNG URL
    buildPNGPath(jpgUrl) {
        return jpgUrl.replace('/AllAET_JPG/', '/AllAET_PNG/').replace('.jpg', '.png');
    }

    // Method to construct JPG URL based on texture type
    buildJPGPath(textureName) {
        let basePath = this.folders.jpgs + textureName;

        // Check if the '_n' type is true and append '_n.jpg'
        if (this.tab1Image.textureTypes._n) {
            return basePath + '_n.jpg';
        }

        // If '_n' is false, cycle through texture types and return the first true one
        for (let key in this.tab1Image.textureTypes) {
            if (this.tab1Image.textureTypes[key]) {
                return basePath + key + '.jpg';
            }
        }

        // Default case (if no true texture type is found)
        return basePath + '.jpg';
    }

    // Method to update AppConfig from JSON data
    updateFromImageDataJSON(data) {
        // Update textureTypes first so buildJPGPath works
        this.tab1Image.textureTypes = data.textureTypes;

        // Update other fields
        this.tab1Image.imgID = data.id;
        this.tab1Image.jpgURL = this.buildJPGPath(data.textureName);
        this.tab1Image.pngURL = this.buildPNGPath(this.tab1Image.jpgURL);
    }
}

// Exporting the AppConfig instance and exposing it globally for debugging
const appConfigInstance = new AppConfig();
export { appConfigInstance as AppConfig };
window.AppConfig = appConfigInstance; // Expose globally for debugging
