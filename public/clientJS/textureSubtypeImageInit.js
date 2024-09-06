// textureSubtypeImageInit.js

import { GSettings } from './GSettings.js';

function DECAPloadRandomImage() {
    fetch('/random-image')
        .then(response => response.json())
        .then(data => {
            if (data) {
                GSettings.tab1Image.imgID = data.id;
                GSettings.tab1Image.jpgURL = data.imageUrl;
                GSettings.tab1Image.textureTypes = data.textureTypes;
                // Update the UI with the new image and settings
                const imageElement = document.getElementById('random-image');
                if (imageElement) {
                    imageElement.src = data.imageUrl;
                }
                console.log('Loaded image and settings:', GSettings);
            }
        })
        .catch(error => console.error('Error fetching random image:', error));
}
