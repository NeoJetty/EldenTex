const express = require('express');
const path = require('path');
const serveImageDataModule = require('./server/serveImageData'); 
const serveAllTagsModule = require('./server/serveAllTags');
const addTagToImageModule = require('./server/addTagToImage');
const addTagToImageAndUserModule = require('./server/addTagToImageAndUser'); // Import the new module

const app = express();
const port = 3030;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// serve modules
app.use('/imageData', serveImageDataModule);
app.use('/allTags', serveAllTagsModule);

// db write modules
app.use('/addTag', addTagToImageModule);
app.use('/addTagToImageAndUser', addTagToImageAndUserModule); // Use the new route module

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
