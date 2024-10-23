/**
 * AppConfig
 * 
 * This class serves as a global configuration store for the application, 
 * encapsulating various settings and state information needed across 
 * different components.
 */

class TextureTypes {
    public _a: boolean = false;
    public _n: boolean = false;
    public _r: boolean = false;
    public _v: boolean = false;
    public _d: boolean = false;
    public _em: boolean = false;
    public _3m: boolean = false;
    public _Billboards_a: boolean = false;
    public _Billboards_n: boolean = false;
    public _g: boolean = false;
    public _m: boolean = false;
    public _1m: boolean = false;
    public _van: boolean = false;
    public _vat: boolean = false;
}

type TextureTypeKeys = keyof TextureTypes;

class TextureDataContainer {
    public textureID: number = -1;
    public jpgURL: string = '';
    public pngURL: string = '';
    public textureTypes: TextureTypes = new TextureTypes();

    // Method to update from JSON
    public updateFromImageDataJSON(data: any): void {
        this.textureTypes = {
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

        this.textureID = data.id;
        this.jpgURL = AppConfig.getInstance().buildJPGPath(data.textureName, this.textureTypes);
        this.pngURL = AppConfig.getInstance().buildPNGPath(this.jpgURL);
    }
}

class User {
    public ID: number = 1;
    public name: string = 'NeoJetty';
    public theme: string = 'dark';
    public language: string = 'en';
    public priorityTextureType: keyof TextureTypes = '_n';
}

class Zoom {
    public zoomFactor: number = 1;
    public minZoom: number = 1;
    public maxZoom: number = 4.0;
}

class Folders {
    public jpgs: string = '/AllAET_JPG/';
    public pngs: string = '/AllAET_PNG/';
}

class GalleryTab {
    public numberOfEntries: number = -1;
    public tagID: number = -1;
    public currentPage: number = -1;
    public allTextureData: any | null = null;
}

class Debug {
    public level: number = 1; // Debug level, can be expanded later if needed
}

class AppConfig {
    private static instance: AppConfig; // Singleton instance

    public debug: Debug = new Debug(); // Debug instance
    public folders: Folders = new Folders();
    public zoom: Zoom = new Zoom();
    public votingTab: TextureDataContainer = new TextureDataContainer();
    public analysisTab: TextureDataContainer = new TextureDataContainer();
    public filterTab: TextureDataContainer = new TextureDataContainer();
    public galleryTab: GalleryTab = new GalleryTab();
    public user: User = new User();

    // Private constructor to prevent instantiation
    private constructor() {}

    // Method to get the singleton instance
    public static getInstance(): AppConfig {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig(); // Create a new instance if it doesn't exist
        }
        return AppConfig.instance; // Return the existing instance
    }

    // Method to update gallery dataset
    public updateGalleryDataset(textures: any[], new_tab_id: number): void {
        if (new_tab_id === this.galleryTab.tagID) return;

        this.galleryTab.tagID = new_tab_id;
        this.galleryTab.allTextureData = textures;
        this.galleryTab.numberOfEntries = textures.length;
        this.galleryTab.currentPage = 1;
    }

    // Method to construct high-res PNG URL
    public buildPNGPath(jpgUrl: string): string {
        return jpgUrl.replace('/AllAET_JPG/', '/AllAET_PNG/').replace('.jpg', '.png');
    }

    // Method to construct JPG URL based on texture type
    public buildJPGPath(textureName: string, textureTypes: TextureTypes): string {
        let basePath = this.folders.jpgs + textureName;

        if (textureTypes._n) {
            return basePath + '_n.jpg';
        }

        for (let key of Object.keys(textureTypes)) {
            if (textureTypes[key as keyof TextureTypes]) {
                return basePath + key + '.jpg';
            }
        }

        console.error(`200 Error: No valid texture type found for texture name "${textureName}". Returning false path.`);
        return basePath + '.jpg'; // Default path
    }

    public buildLowQualityJPGPath(textureName: string, textureTypes: TextureTypes): string {
        let basePath = this.folders.jpgs + textureName;

        if (textureTypes._n) {
            return basePath + '_n_l.jpg';
        }

        for (let key of Object.keys(textureTypes)) {
            if (textureTypes[key as keyof TextureTypes]) {
                return basePath + key + '_l.jpg';
            }
        }

        console.error(`200 Error: No valid texture type found for texture name "${textureName}". Returning false path.`);
        return basePath + '.jpg'; // Default path
    }

    // Method to update from JSON
    public updateFromImageDataJSON(data: any, propertyGroup: TextureDataContainer): void {
        propertyGroup.textureTypes = {
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

        propertyGroup.textureID = data.id;
        propertyGroup.jpgURL = this.buildJPGPath(data.textureName, propertyGroup.textureTypes);
        propertyGroup.pngURL = this.buildPNGPath(propertyGroup.jpgURL);
    }
}

// Exporting the AppConfig singleton instance
const appConfigInstance = AppConfig.getInstance(); // Get the singleton instance
export { appConfigInstance as AppConfig, TextureDataContainer, TextureTypeKeys };
// @ts-ignore
window.AppConfig = appConfigInstance; // Expose globally for debugging
