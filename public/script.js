const tabLinks = document.querySelectorAll('.tab-link');
const contentSections = document.querySelectorAll('.content');
let zoomLevel = 1;
let currentImageUrl = ''; // Track the current image URL
let highResImageUrl = ''; // Track the high-res image URL

// Function to fetch and display the random image
function loadRandomImage() {
    fetch('/random-image')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const imageElement = document.getElementById('random-image');
            if (imageElement) {
                imageElement.src = data.imageUrl;
                currentImageUrl = data.imageUrl; // Update current image URL
                highResImageUrl = getHighResImageUrl(currentImageUrl); // Construct high-res URL
                resetImageSize(); // Reset image size when a new image is loaded
            }
        })
        .catch(error => console.error('Error fetching random image:', error));
}

// Function to construct high-res PNG URL
function getHighResImageUrl(jpgUrl) {
    return jpgUrl.replace('/AllAET_JPG/', '/AllAET_PNG/').replace('.jpg', '.png');
}

// Function to replace JPEG with PNG
function replaceWithHighQualityImage() {
    if (!highResImageUrl) return;

    // Check if PNG exists
    fetch(highResImageUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const imageElement = document.getElementById('random-image');
                if (imageElement) {
                    imageElement.src = highResImageUrl;
                }
            }
        })
        .catch(error => console.error('Error checking PNG image:', error));
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
        container.style.overflow = 'auto';

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
        container.style.overflow = 'hidden'; // Hide scrollbars when resetting
    }
}

// Event listener for tab clicks
tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all content sections
        contentSections.forEach(section => section.classList.remove('active'));

        // Remove active class from all tabs
        tabLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the clicked tab and its corresponding content section
        const targetTab = e.target.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
        e.target.classList.add('active');

        // If the first tab is selected, fetch and display a random image
        if (targetTab === 'tab1') {
            loadRandomImage();
        } else {
            resetImageSize(); // Reset image size when switching tabs
        }
    });
});

// Zoom functionality and replace image on zoom button press
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tab-link[data-tab="tab1"]').click();
    loadRandomImage(); // Load random image on page load

    document.querySelector('.zoom-in').addEventListener('click', () => handleZoom('in'));
    document.querySelector('.zoom-out').addEventListener('click', () => handleZoom('out'));
});
