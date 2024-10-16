const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3030;

// Create a central SQLite database connection
const dbPath = path.resolve(__dirname, '8a2f6b3c9e4f7ab.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database');
    }
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to inject the db connection into all routes
app.use((req, res, next) => {
    req.db = db;  // Attach the database connection to the request object
    next();
});

// ------------------------------------------------------
// Serve modules
// ------------------------------------------------------

// textureData/:imageId (GET specific image data by imageId, or random if imageId is -1)
app.use('/textureData', require('./server/serveTextureData'));
// allTags
app.use('/allTags', require('./server/serveAllTags'));
// untaggedTexture/:user_id/:tag_id
app.use('/untaggedTexture', require('./server/serveRandomUntagged'));
// countTaggingProgress/:user_id/:tag_id
app.use('/countTaggingProgress', require('./server/serveCountTaggingProgress'));
// serveManyTextures/:user_id/:tag_id
app.use('/serveManyTextures', require('./server/serveManyTextures'));
// serveTagsForTexture/:user_id/:image_id
app.use('/serveTagsForTexture', require('./server/serveTagsForTexture'));


// ------------------------------------------------------
// DB write modules
// ------------------------------------------------------

// addTag/:user_id/:tag_id
app.use('/dbCreateNewTag', require('./server/dbCreateNewTag'));
// DBaddTagToImageAndUser/:user_id/:tag_id/:image_id/:vote 
app.use('/dbAddTagToImageAndUser', require('./server/dbAddTagToImageAndUser'));

// Start the server and listen on all network interfaces (LAN accessible)
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://${getLocalIPAddress()}:${port}`);
});

// Utility function to get local IP address for display purposes
function getLocalIPAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    let localAddress = 'localhost'; // Fallback

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                localAddress = net.address;
                break;
            }
        }
    }
    return localAddress;
}

