/**
 * AppConfig
 *
 * This class serves as a global configuration store for the application,
 * encapsulating various settings and state information needed across
 * different components.
 */
class TextureTypes {
    constructor() {
        this._a = false;
        this._n = false;
        this._r = false;
        this._v = false;
        this._d = false;
        this._em = false;
        this._3m = false;
        this._Billboards_a = false;
        this._Billboards_n = false;
        this._g = false;
        this._m = false;
        this._1m = false;
        this._van = false;
        this._vat = false;
    }
}
class TextureDataContainer {
    constructor() {
        this.textureID = -1;
        this.textureName = '';
        this.jpgURL = '';
        this.pngURL = '';
        this.textureTypes = new TextureTypes();
    }
    // Method to update from JSON
    updateFromImageDataJSON(data) {
        var _b, _c, _e, _f, _h, _j, _k, _l, _o, _p, _q, _s, _t, _u, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        this.textureTypes = {
            _a: (_c = (_b = data.textureTypes) === null || _b === void 0 ? void 0 : _b._a) !== null && _c !== void 0 ? _c : false,
            _n: (_f = (_e = data.textureTypes) === null || _e === void 0 ? void 0 : _e._n) !== null && _f !== void 0 ? _f : false,
            _r: (_j = (_h = data.textureTypes) === null || _h === void 0 ? void 0 : _h._r) !== null && _j !== void 0 ? _j : false,
            _v: (_l = (_k = data.textureTypes) === null || _k === void 0 ? void 0 : _k._v) !== null && _l !== void 0 ? _l : false,
            _d: (_p = (_o = data.textureTypes) === null || _o === void 0 ? void 0 : _o._d) !== null && _p !== void 0 ? _p : false,
            _em: (_s = (_q = data.textureTypes) === null || _q === void 0 ? void 0 : _q._em) !== null && _s !== void 0 ? _s : false,
            _3m: (_u = (_t = data.textureTypes) === null || _t === void 0 ? void 0 : _t._3m) !== null && _u !== void 0 ? _u : false,
            _Billboards_a: (_x = (_w = data.textureTypes) === null || _w === void 0 ? void 0 : _w._Billboards_a) !== null && _x !== void 0 ? _x : false,
            _Billboards_n: (_z = (_y = data.textureTypes) === null || _y === void 0 ? void 0 : _y._Billboards_n) !== null && _z !== void 0 ? _z : false,
            _g: (_1 = (_0 = data.textureTypes) === null || _0 === void 0 ? void 0 : _0._g) !== null && _1 !== void 0 ? _1 : false,
            _m: (_3 = (_2 = data.textureTypes) === null || _2 === void 0 ? void 0 : _2._m) !== null && _3 !== void 0 ? _3 : false,
            _1m: (_5 = (_4 = data.textureTypes) === null || _4 === void 0 ? void 0 : _4._1m) !== null && _5 !== void 0 ? _5 : false,
            _van: (_7 = (_6 = data.textureTypes) === null || _6 === void 0 ? void 0 : _6._van) !== null && _7 !== void 0 ? _7 : false,
            _vat: (_9 = (_8 = data.textureTypes) === null || _8 === void 0 ? void 0 : _8._vat) !== null && _9 !== void 0 ? _9 : false,
        };
        this.textureName = data.textureName;
        this.textureID = data.id;
        this.jpgURL = AppConfig.getInstance().buildJPGPath(data.textureName, this.textureTypes);
        this.pngURL = AppConfig.getInstance().buildPNGPath(this.jpgURL);
    }
}
class User {
    constructor() {
        this.ID = 1;
        this.name = 'NeoJetty';
        this.theme = 'dark';
        this.language = 'en';
        this.priorityTextureType = '_n';
    }
}
class Zoom {
    constructor() {
        this.zoomFactor = 1;
        this.minZoom = 1;
        this.maxZoom = 4.0;
    }
}
class Folders {
    constructor() {
        this.jpgs = '/AllAET_JPG/';
        this.pngs = '/AllAET_PNG/';
    }
}
class GalleryTab {
    constructor() {
        this.numberOfEntries = -1;
        this.tagID = -1;
        this.currentPage = -1;
        this.allTextureData = null;
    }
}
class Debug {
    constructor() {
        this.level = 2; // Debug level, can be expanded later if needed. higher = more logging
    }
}
class AppConfig {
    // Private constructor to prevent instantiation
    constructor() {
        this.debug = new Debug(); // Debug instance
        this.folders = new Folders();
        this.zoom = new Zoom();
        this.votingTab = new TextureDataContainer();
        this.analysisTab = new TextureDataContainer();
        this.filterTab = new TextureDataContainer();
        this.galleryTab = new GalleryTab();
        this.user = new User();
    }
    // Method to get the singleton instance
    static getInstance() {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig(); // Create a new instance if it doesn't exist
        }
        return AppConfig.instance; // Return the existing instance
    }
    // Method to update gallery dataset
    updateGalleryDataset(textures, new_tab_id) {
        if (new_tab_id === this.galleryTab.tagID)
            return;
        this.galleryTab.tagID = new_tab_id;
        this.galleryTab.allTextureData = textures;
        this.galleryTab.numberOfEntries = textures.length;
        this.galleryTab.currentPage = 1;
    }
    // Method to construct high-res PNG URL
    buildPNGPath(jpgUrl) {
        return jpgUrl.replace('/AllAET_JPG/', '/AllAET_PNG/').replace('.jpg', '.png');
    }
    // Method to construct JPG URL based on texture type
    buildJPGPath(textureName, textureTypes) {
        let basePath = this.folders.jpgs + textureName;
        if (textureTypes._n) {
            return basePath + '_n.jpg';
        }
        for (let key of Object.keys(textureTypes)) {
            if (textureTypes[key]) {
                return basePath + key + '.jpg';
            }
        }
        console.error(`200 Error: No valid texture type found for texture name "${textureName}". Returning false path.`);
        return basePath + '.jpg'; // Default path
    }
    buildLowQualityJPGPath(textureName, textureTypes) {
        let basePath = this.folders.jpgs + textureName;
        if (textureTypes._n) {
            return basePath + '_n_l.jpg';
        }
        for (let key of Object.keys(textureTypes)) {
            if (textureTypes[key]) {
                return basePath + key + '_l.jpg';
            }
        }
        console.error(`200 Error: No valid texture type found for texture name "${textureName}". Returning false path.`);
        return basePath + '.jpg'; // Default path
    }
    // Method to update from JSON
    updateFromImageDataJSON(data, propertyGroup) {
        var _b, _c, _e, _f, _h, _j, _k, _l, _o, _p, _q, _s, _t, _u, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        propertyGroup.textureTypes = {
            _a: (_c = (_b = data.textureTypes) === null || _b === void 0 ? void 0 : _b._a) !== null && _c !== void 0 ? _c : false,
            _n: (_f = (_e = data.textureTypes) === null || _e === void 0 ? void 0 : _e._n) !== null && _f !== void 0 ? _f : false,
            _r: (_j = (_h = data.textureTypes) === null || _h === void 0 ? void 0 : _h._r) !== null && _j !== void 0 ? _j : false,
            _v: (_l = (_k = data.textureTypes) === null || _k === void 0 ? void 0 : _k._v) !== null && _l !== void 0 ? _l : false,
            _d: (_p = (_o = data.textureTypes) === null || _o === void 0 ? void 0 : _o._d) !== null && _p !== void 0 ? _p : false,
            _em: (_s = (_q = data.textureTypes) === null || _q === void 0 ? void 0 : _q._em) !== null && _s !== void 0 ? _s : false,
            _3m: (_u = (_t = data.textureTypes) === null || _t === void 0 ? void 0 : _t._3m) !== null && _u !== void 0 ? _u : false,
            _Billboards_a: (_x = (_w = data.textureTypes) === null || _w === void 0 ? void 0 : _w._Billboards_a) !== null && _x !== void 0 ? _x : false,
            _Billboards_n: (_z = (_y = data.textureTypes) === null || _y === void 0 ? void 0 : _y._Billboards_n) !== null && _z !== void 0 ? _z : false,
            _g: (_1 = (_0 = data.textureTypes) === null || _0 === void 0 ? void 0 : _0._g) !== null && _1 !== void 0 ? _1 : false,
            _m: (_3 = (_2 = data.textureTypes) === null || _2 === void 0 ? void 0 : _2._m) !== null && _3 !== void 0 ? _3 : false,
            _1m: (_5 = (_4 = data.textureTypes) === null || _4 === void 0 ? void 0 : _4._1m) !== null && _5 !== void 0 ? _5 : false,
            _van: (_7 = (_6 = data.textureTypes) === null || _6 === void 0 ? void 0 : _6._van) !== null && _7 !== void 0 ? _7 : false,
            _vat: (_9 = (_8 = data.textureTypes) === null || _8 === void 0 ? void 0 : _8._vat) !== null && _9 !== void 0 ? _9 : false,
        };
        propertyGroup.textureID = data.id;
        propertyGroup.jpgURL = this.buildJPGPath(data.textureName, propertyGroup.textureTypes);
        propertyGroup.pngURL = this.buildPNGPath(propertyGroup.jpgURL);
    }
}
// Exporting the AppConfig singleton instance
const appConfigInstance = AppConfig.getInstance(); // Get the singleton instance
export { appConfigInstance as AppConfig, TextureDataContainer };
// @ts-ignore
window.AppConfig = appConfigInstance; // Expose globally for debugging
