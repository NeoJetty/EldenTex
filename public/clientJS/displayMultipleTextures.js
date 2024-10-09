// displayMultipleTextures.js

import { AppConfig } from './AppConfig.js';

async function fetchMultipleTextures(userId, tagId) {
    const url = `/serveManyTextures/${userId}/${tagId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching textures: ${response.statusText}`);
        }

        const textureData = await response.json();
        AppConfig.textures = textureData; // Store the texture data in AppConfig

        // Log the first texture name for testing
        if (textureData.length > 0) {
            console.log('First texture name:', textureData[0].textureName);
        }

        return textureData;
    } catch (error) {
        console.error('Failed to fetch textures:', error);
    }
}

export { fetchMultipleTextures };
