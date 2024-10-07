const express = require('express');
const path = require('path');

const app = express();
const port = 3030;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------
// Serve modules
// ------------------------------------------------------

// /imageData/:imageId (GET specific image data by imageId, or random if imageId is -1)
app.use('/imageData', require('./server/serveTextureData'));
// /allTags (GET all available tags)
app.use('/allTags', require('./server/serveAllTags'));
// /untaggedTexture (GET random untagged texture)
app.use('/untaggedTexture', require('./server/serveRandomUntagged'));
// /serveManyTextures/:userID/:tagID (GET textures voted TRUE by userID and tagID)
app.use('/serveManyTextures', require('./server/serveManyTextures'));

// ------------------------------------------------------
// DB write modules
// ------------------------------------------------------

// addTag/:user_id/:tag_id
app.use('/addTag', require('./server/addTagToDatabase'));
// addTagToImageAndUser/:user_id/:tag_id/:image_id/:vote 
app.use('/addTagToImageAndUser', require('./server/addTagToImageAndUser'));



// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
