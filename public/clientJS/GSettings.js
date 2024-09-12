const GSettings = {
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
        let basePath = GSettings.folders.jpgs + textureName;

        // Check if the '_n' type is true and append '_n.jpg'
        if (GSettings.tab1Image.textureTypes._n) {
            return basePath + '_n.jpg';
        }

        // If '_n' is false, cycle through texture types and return the first true one
        for (let key in GSettings.tab1Image.textureTypes) {
            if (GSettings.tab1Image.textureTypes[key]) {
                return basePath + key + '.jpg';
            }
        }

        // Default case (if no true texture type is found)
        return basePath + '.jpg';
    },

    // Function to update GSettings from JSON data
    updateFromImageDataJSON: function(data) {
        // Update textureTypes first so buildJPGPath works
        GSettings.tab1Image.textureTypes = data.textureTypes;

        // Update other fields
        GSettings.tab1Image.imgID = data.id;
        GSettings.tab1Image.jpgURL = GSettings.buildJPGPath(data.textureName);
        GSettings.tab1Image.pngURL = GSettings.buildPNGPath(GSettings.tab1Image.jpgURL);
    }
};

export { GSettings };
window.GSettings = GSettings; // Expose globally for debugging
