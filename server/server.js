import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

// Use fileURLToPath to get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Middleware to inject the db connection into all routes
app.use((req, res, next) => {
    req.db = db; // Attach the database connection to the request object
    next();
});

app.use(express.json());

// Async function to register routes
async function registerRoutes() {
    // ------------------------------------------------------
    // Serve modules
    // ------------------------------------------------------
    // textureData/:texture_id (GET specific texture data by texture_id, or random if texture_id is -1)
    app.use('/api/textureData', (await import('./api/serveTextureData.js')).default);
    // allTags
    app.use('/api/allTags', (await import('./api/serveAllTags.js')).default);
    // untaggedTexture/:user_id/:tag_id
    app.use('/api/untaggedTexture', (await import('./api/serveRandomUntagged.js')).default);
    // countTaggingProgress/:user_id/:tag_id
    app.use('/api/countTaggingProgress', (await import('./api/serveCountTaggingProgress.js')).default);
    // serveManyTextures/:user_id/:tag_id
    app.use('/api/serveManyTextures', (await import('./api/serveManyTextures.js')).default);
    // serveTagsForTexture/:user_id/:texture_id
    app.use('/api/serveTagsForTexture', (await import('./api/serveTagsForTexture.js')).default);
    // serveMapsForTexture/:texture_id
    app.use('/api/serveMapsForTexture', (await import('./api/serveMapsForTexture.js')).default);
    // serveTexturesByMultipleTags/:POST-JSON{user_id,tags:[{tag_id:number, vote:bool},{...},{...}]}
    app.use('/api/serveTexturesByMultipleTags', (await import('./api/serveTexturesByMultipleTags.js')).default);
    // serveAllSavedFilterSearches/:user_id
    app.use('/api/serveAllSavedFilterSearches', (await import('./api/serveAllSavedFilterSearches.js')).default);

    // ------------------------------------------------------
    // DB write modules
    // ------------------------------------------------------
    // dbDeleteTagFromTexture/:user_id/:tag_id
    app.use('/api/dbDeleteTagFromTexture', (await import('./api/dbDeleteTagFromTexture.js')).default);
    // dbCreateNewTag/:user_id/:tag_id
    app.use('/api/dbCreateNewTag', (await import('./api/dbCreateNewTag.js')).default);
    // dbAddTagToTexture/:user_id/:tag_id/:texture_id/:vote 
    app.use('/api/dbAddTagToTexture', (await import('./api/dbAddTagToTexture.js')).default);
    // dbSaveTagSearches/:POST-JSON{user_id,search_name,tags:[{tag_id:number, vote:bool},{...},{...}]}
    app.use('/api/dbSaveTagSearches', (await import('./api/dbSaveTagSearches.js')).default);
}

// Call the async function to register the routes
registerRoutes().then(() => {
    // Start the server and listen on localhost only (not network accessible)
    app.listen(port, '127.0.0.1', () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Error registering routes:', err);
});


