// server.js
const express = require('express');
const path = require('path');
const serveImageDataModule = require('./server/serveImageData'); 
const addTagToImageModule = require('./server/addTagToImage');

const app = express();
const port = 3030;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes defined in serveImageData.js
app.use('/imageData', serveImageDataModule);
app.use('/addTag', addTagToImageModule);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
