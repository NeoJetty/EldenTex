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
 * - VotingTab: Stores information specific to the first tab's image, 
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
        this.votingTab = {
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
                _Billboards_a: false,
                _Billboards_n: false,
                _g: false,
                _m: false,
                _1m: false,
                _van: false,
                _vat: false,
            },
        };
        this.analysisTab = {
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
                _Billboards_a: false,
                _Billboards_n: false,
                _g: false,
                _m: false,
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
        this.galleryByTag = {
            numberOfEntries: -1,  // Number of textures in the gallery
            tagID: -1,            // The tag ID for the textures
            currentPage: -1,       // Current page in the gallery
            allTextureData: null   // Data from the JSON fetch for multiple textures
        };

    }


    // ---------------------------------------------
    //              helper methods
    // ---------------------------------------------

    // Method to update allTextureData and gallery metadata
    updateTextureData(textures, new_tab_id) {
        // If the new_tab_id is the same as the current tagID, return early
        if (new_tab_id === this.galleryByTag.tagID) {
            return;
        }
        
        // Update galleryByTag.tagID to the new_tab_id
        this.galleryByTag.tagID = new_tab_id; 

        // Update other properties based on the fetched textures
        this.galleryByTag.allTextureData = textures; // Update allTextureData with fetched textures
        this.galleryByTag.numberOfEntries = textures.length; // Set number of entries based on the length of the fetched textures
        this.galleryByTag.currentPage = 1; // Initialize currentPage to 1
    }

    // Method to construct high-res PNG URL
    buildPNGPath(jpgUrl) {
        return jpgUrl.replace('/AllAET_JPG/', '/AllAET_PNG/').replace('.jpg', '.png');
    }

    // Method to construct JPG URL based on texture type
    buildJPGPath(textureName, textureTypes) {
        let basePath = this.folders.jpgs + textureName;

        // Check if the '_n' type is true and append '_n.jpg'
        if (textureTypes._n) {
            return basePath + '_n.jpg';
        }

        // If '_n' is false, cycle through texture types
        for (let key of Object.keys(textureTypes)) {
            if (textureTypes[key]) {
                return basePath + key + '.jpg';
            }
        }

        // If no valid texture types are found, log a 200 error and return a false path
        console.error(`200 Error: No valid texture type found for texture name "${textureName}". Returning false path.`);
        return basePath + '.jpg';  // or return an empty string, null, or any default path you prefer
    }

    // Method to update AppConfig from JSON data
    updateFromImageDataJSON(data) {
        // Initialize textureTypes based on incoming data
        this.votingTab.textureTypes = { 
            _a: data.textureTypes?._a ?? false,
            _n: data.textureTypes?._n ?? false,
            _r: data.textureTypes?._r ?? false,
            _v: data.textureTypes?._v ?? false,
            _d: data.textureTypes?._d ?? false,
            _em: data.textureTypes?._em ?? false,
            _3m: data.textureTypes?._3m ?? false,
            _Billboards_a: data.textureTypes?._Billboards_a ?? false,
            _Billboards_n: data.textureTypes?._Billboards_n ?? false,
            _g: data.textureTypes?._g ?? false,
            _m: data.textureTypes?._m ?? false,
            _1m: data.textureTypes?._1m ?? false,
            _van: data.textureTypes?._van ?? false,
            _vat: data.textureTypes?._vat ?? false,
        };
    
        // Update other fields based on incoming data
        this.votingTab.imgID = data.id;
        this.votingTab.jpgURL = this.buildJPGPath(data.textureName, this.votingTab.textureTypes);
        this.votingTab.pngURL = this.buildPNGPath(this.votingTab.jpgURL);
    }
}

// Exporting the AppConfig instance and exposing it globally for debugging
const appConfigInstance = new AppConfig();
export { appConfigInstance as AppConfig };
window.AppConfig = appConfigInstance; // Expose globally for debugging
