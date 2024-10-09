/**
 * AppConfig
 * 
 * This object serves as a global configuration store for the application, 
 * holding various settings and state information needed across different 
 * components. The properties within AppConfig include:
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
 * Additionally, AppConfig includes helper functions for constructing image 
 * URLs based on texture types and updating its properties from incoming 
 * JSON data.
 */
const AppConfig = {
    folders: {
        jpgs: '/AllAET_JPG/',
        pngs: '/AllAET_PNG/',
    },
    zoom: {
        zoomFactor: 1,
        minZoom: 1,
        maxZoom: 4.0,
    },
    tab1Image: {
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
    },
    user: {
        ID: 1,
        name: 'NeoJetty',
        theme: 'dark',
        language: 'en',
    },

    // ---------------------------------------------
    //              helper functions
    // ---------------------------------------------

    // Function to construct high-res PNG URL
    buildPNGPath: function(jpgUrl) {
        return jpgUrl.replace('/AllAET_JPG/', '/AllAET_PNG/').replace('.jpg', '.png');
    },

    // Function to construct JPG URL based on texture type
    buildJPGPath: function(textureName) {
        let basePath = AppConfig.folders.jpgs + textureName;

        // Check if the '_n' type is true and append '_n.jpg'
        if (AppConfig.tab1Image.textureTypes._n) {
            return basePath + '_n.jpg';
        }

        // If '_n' is false, cycle through texture types and return the first true one
        for (let key in AppConfig.tab1Image.textureTypes) {
            if (AppConfig.tab1Image.textureTypes[key]) {
                return basePath + key + '.jpg';
            }
        }

        // Default case (if no true texture type is found)
        return basePath + '.jpg';
    },

    // Function to update AppConfig from JSON data
    updateFromImageDataJSON: function(data) {
        // Update textureTypes first so buildJPGPath works
        AppConfig.tab1Image.textureTypes = data.textureTypes;

        // Update other fields
        AppConfig.tab1Image.imgID = data.id;
        AppConfig.tab1Image.jpgURL = AppConfig.buildJPGPath(data.textureName);
        AppConfig.tab1Image.pngURL = AppConfig.buildPNGPath(AppConfig.tab1Image.jpgURL);
    }
};

export { AppConfig };
window.AppConfig = AppConfig; // Expose globally for debugging
