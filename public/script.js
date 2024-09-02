// script.js

import { handleZoom, resetImageSize, getHighResImageUrl, setCurrentImageUrl, setHighResImageUrl } from './imageManipulation.js';

const tabLinks = document.querySelectorAll('.tab-link');
const contentSections = document.querySelectorAll('.content');

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
                const imageUrl = data.imageUrl;
                imageElement.src = imageUrl;
                setCurrentImageUrl(imageUrl); // Update current image URL
                const highResUrl = getHighResImageUrl(imageUrl); // Construct high-res URL
                setHighResImageUrl(highResUrl); // Set high-res image URL
                resetImageSize(); // Reset image size when a new image is loaded
            }
        })
        .catch(error => console.error('Error fetching random image:', error));
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
