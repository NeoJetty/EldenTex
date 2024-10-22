let zoomLevel = 1;
import { AppConfig } from './AppConfig.js';
// Function to replace JPEG with PNG
function replaceWithHighQualityImage() {
    if (AppConfig.votingTab.pngURL === '')
        return;
    const imageElement = document.getElementById('random-image');
    if (imageElement) {
        imageElement.src = AppConfig.votingTab.pngURL;
    }
}
// Function to handle zoom actions
function handleZoom(action) {
    const imageElement = document.getElementById('random-image');
    if (imageElement) {
        // Define zoom factor
        const zoomFactor = action === 'in' ? 1.2 : 0.8;
        zoomLevel *= zoomFactor;
        // Apply zoom effect
        imageElement.style.transform = `scale(${zoomLevel})`;
        // Adjust the container's overflow and positioning to accommodate the zoomed image
        const container = imageElement.parentElement;
        if (container) {
            container.style.overflow = 'auto';
        }
        // Replace with high-res image when zooming in or out
        replaceWithHighQualityImage();
    }
}
// Function to reset image size
function resetImageSize() {
    const imageElement = document.getElementById('random-image');
    if (imageElement) {
        zoomLevel = 1; // Reset zoom level
        imageElement.style.transform = `scale(${zoomLevel})`;
        imageElement.style.width = '780px';
        imageElement.style.height = '780px';
        const container = imageElement.parentElement;
        if (container) {
            container.style.overflow = 'hidden'; // Hide scrollbars when resetting
        }
    }
}
// Export functions for use in other scripts
export { handleZoom, resetImageSize };
