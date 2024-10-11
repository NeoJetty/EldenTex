// textureSubtypeImageInit.js

import { AppConfig } from './AppConfig.js';

function DECAPloadRandomImage() {
    fetch('/random-image')
        .then(response => response.json())
        .then(data => {
            if (data) {
                AppConfig.votingTab.imgID = data.id;
                AppConfig.tab1Image.jpgURL = data.imageUrl;
                AppConfig.tab1Image.textureTypes = data.textureTypes;
                // Update the UI with the new image and settings
                const imageElement = document.getElementById('random-image');
                if (imageElement) {
                    imageElement.src = data.imageUrl;
                }
                console.log('Loaded image and settings:', AppConfig);
            }
        })
        .catch(error => console.error('Error fetching random image:', error));
}
