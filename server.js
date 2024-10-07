const express = require('express');
const path = require('path');
const serveImageDataModule = require('./server/serveImageData'); 
const serveAllTagsModule = require('./server/serveAllTags');
const serveRandomUntaggedModule = require('./server/serveRandomUntagged');
const addTagToImageModule = require('./server/addTagToImage');
const addTagToImageAndUserModule = require('./server/addTagToImageAndUser');
const serveManyTexturesModule = require('./server/serveManyTextures'); // Import the new module

const app = express();
const port = 3030;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// serve modules
app.use('/imageData', serveImageDataModule);
app.use('/allTags', serveAllTagsModule);
app.use('/untaggedTexture', serveRandomUntaggedModule);
app.use('/serveManyTextures', serveManyTexturesModule);

// db write modules
app.use('/addTag', addTagToImageModule);
app.use('/addTagToImageAndUser', addTagToImageAndUserModule);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
