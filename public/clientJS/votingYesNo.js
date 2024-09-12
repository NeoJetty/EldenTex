import { GSettings } from './GSettings.js';

// Set the variables
let voteTagTheme = 'test';
let voteTagID = 3;

// Function to create the voting UI
function createVotingUI() {
    const container = document.querySelector('.tag-container');

    // Check if the container exists
    if (!container) {
        console.error('The element with class "tag-container" was not found.');
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
}

// Function to handle the vote (Yes or No)
function handleVote(isYes) {
    const userID = GSettings.user.ID;
    const imageID = GSettings.tab1Image.imgID;

    // Debugging output
    console.log('Handling vote:', isYes ? 'Yes' : 'No');
    console.log('User ID:', userID);
    console.log('Image ID:', imageID);

    // Construct the GET request URL
    const voteValue = isYes ? 1 : 0; // Yes = 1, No = 0
    const url = `/addTagToImageAndUser?user_id=${userID}&tag_id=${voteTagID}&image_id=${imageID}&vote=${voteValue}`;

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

// Stub function to load the next voting question
function nextVote() {
    console.log('Next vote triggered');
    // Future implementation for next vote will go here
}

export { createVotingUI, handleVote, nextVote };
