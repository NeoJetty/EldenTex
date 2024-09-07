// server.js
const express = require('express');
const path = require('path');
const serveImageDataModule = require('./server/serveImageData'); // Updated path to the image-fetching module

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes defined in randomTexVote.js
app.use('/random-image', serveImageDataModule);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
