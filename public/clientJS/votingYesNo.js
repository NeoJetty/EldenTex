// votingUI.ts
import { AppConfig } from './AppConfig.js';
// Set the variables
let voteTagTheme = 'Symbol';
let voteTagID = 4;
// Function to create the voting UI
function createVotingUI(parentDiv) {
    const container = parentDiv.querySelector('.right-main-container');
    // Check if the container exists
    if (!container) {
        console.error('The element with class "right-main-container" was not found.');
        return;
    }
    // Clear the container (in case there's previous content)
    container.innerHTML = '';
    // Create title element
    const title = document.createElement('h3');
    title.id = 'vote-title';
    title.textContent = `Is this texture a ${voteTagTheme}?`;
    container.appendChild(title);
    // Create "No" button
    const noButton = document.createElement('button');
    noButton.id = 'vote-no';
    noButton.textContent = 'No';
    // Create "Yes" button
    const yesButton = document.createElement('button');
    yesButton.id = 'vote-yes';
    yesButton.textContent = 'Yes';
    // Append buttons to the container
    container.appendChild(noButton);
    container.appendChild(yesButton);
    // Set up event listeners for buttons
    noButton.addEventListener('click', () => handleVote(false));
    yesButton.addEventListener('click', () => handleVote(true));
    // Set up event listener for arrow key presses
    document.addEventListener('keydown', handleKeyPress);
}
// Function to handle the vote (Yes or No)
function handleVote(isYes) {
    const userID = AppConfig.user.ID;
    const imageID = AppConfig.votingTab.textureID;
    // Debugging output
    console.log('Handling vote:', isYes ? 'Yes' : 'No');
    console.log('User ID:', userID);
    console.log('Image ID:', imageID);
    // Construct the GET request URL
    const voteValue = isYes ? 'true' : 'false'; // Send 'true' or 'false'
    const url = `/dbAddTagToTexture?user_id=${userID}&tag_id=${voteTagID}&texture_id=${imageID}&vote=${voteValue}`;
    // Debugging output
    console.log('Constructed URL:', url);
    // Send the GET request to the server
    fetch(url)
        .then(response => {
        if (!response.ok) {
            throw new Error('Failed to submit vote');
        }
        return response.json();
    })
        .then(data => {
        console.log('Vote submitted:', data);
        // After the vote is submitted, call the nextVote() stub
        nextVote();
    })
        .catch(error => console.error('Error submitting vote:', error));
}
// Function to handle key presses (left arrow for No, right arrow for Yes, up arrow for cycling tabs)
function handleKeyPress(event) {
    if (event.key === 'ArrowRight') {
        // Right arrow key for "Yes"
        handleVote(true);
    }
    else if (event.key === 'ArrowLeft') {
        // Left arrow key for "No"
        handleVote(false);
    }
    else if (event.key === 'ArrowUp') {
        // Up arrow key to cycle through texture type tabs
        cycleTextureTypeTabs();
    }
}
// Function to cycle through texture type tabs
function cycleTextureTypeTabs() {
    const activeTabs = document.querySelectorAll('.tex-type-navitem.highlighted'); // Only consider highlighted tabs
    const activeTab = Array.from(activeTabs).find(tab => tab.classList.contains('active'));
    if (activeTab) {
        // Find the next tab or loop back to the first one
        const nextTab = activeTab.nextElementSibling || activeTabs[0];
        // Remove 'active' class from the current tab
        activeTab.classList.remove('active');
        // Add 'active' class to the next tab
        nextTab.classList.add('active');
        // Simulate a click on the next tab to change the image
        nextTab.click();
    }
}
// Stub function to load the next voting question
function nextVote() {
    console.log('Next vote triggered');
    // Simulate a click on the first tab to reload its content
    const firstTabLink = document.querySelector('.tab-link[data-tab="tab1"]');
    if (firstTabLink) {
        firstTabLink.click();
    }
}
// Clean up the keydown event listener when not needed
function removeKeyPressListener() {
    document.removeEventListener('keydown', handleKeyPress);
}
export { createVotingUI, handleVote, nextVote, removeKeyPressListener };
