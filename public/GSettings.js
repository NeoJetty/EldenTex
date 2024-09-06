const GSettings = {
    zoom: {
        zoomFactor: 1,
        minZoom: 1,
        maxZoom: 4.0,
    },
    tab1Image: {
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
        defaultImageWidth: 780,
        defaultImageHeight: 780,
    },
    user: {
        theme: 'dark',
        language: 'en',
    },
};

// Export the settings and the function
export { GSettings };
