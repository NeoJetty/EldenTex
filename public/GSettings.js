const GSettings = {
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
};

// Export the settings and the function
export { GSettings };

// Expose GSettings globally for debugging
window.GSettings = GSettings;