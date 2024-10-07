// serveManyTextures.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

// Construct the relative path to the database
const dbPath = path.resolve(__dirname, '../8a2f6b3c9e4f7ab.db');

function connectToDatabase() {
    return new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        }
    });
}

// Connect to the SQLite database
const db = connectToDatabase();

// Define the route for fetching multiple textures by user and tag
router.get('/:userID/:tagID', (req, res) => {
    const userID = parseInt(req.params.userID);
    const tagID = parseInt(req.params.tagID);

    if (isNaN(userID) || isNaN(tagID)) {
        return res.status(400).send('Invalid userID or tagID');
    }

    // Query to get all texture image IDs for the given user and tag where vote is TRUE
    const query = `
        SELECT image_id 
        FROM tags_by_user_and_image 
        WHERE user_id = ? 
        AND tag_id = ? 
        AND vote = TRUE
    `;

    db.all(query, [userID, tagID], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (rows.length === 0) {
            return res.status(404).send('No textures found for the given user and tag');
        }

        // Fetch texture data for each image_id
        const imageIDs = rows.map(row => row.image_id);
        fetchTexturesDataByIds(imageIDs, res);
    });
});

// Function to fetch texture data for multiple image IDs
function fetchTexturesDataByIds(imageIDs, res) {
    const placeholders = imageIDs.map(() => '?').join(', ');
    const query = `
        SELECT * 
        FROM textures 
        WHERE id IN (${placeholders})
    `;

    db.all(query, imageIDs, (err, textureRows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (textureRows.length === 0) {
            return res.status(404).send('No textures found');
        }

        // Fetch corresponding subtype data for each image
        fetchTextureSubtypesData(textureRows, res);
    });
}

// Function to fetch texture subtypes data for multiple textures
function fetchTextureSubtypesData(textureRows, res) {
    const imageIDs = textureRows.map(row => row.id);
    const placeholders = imageIDs.map(() => '?').join(', ');
    const query = `
        SELECT * 
        FROM texture_subtypes 
        WHERE id IN (${placeholders})
    `;

    db.all(query, imageIDs, (err, subtypeRows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        // Create an array of texture data with their corresponding subtypes
        const result = textureRows.map(texture => {
            const subtype = subtypeRows.find(s => s.id === texture.id);
            return {
                textureName: texture.name,
                id: texture.id,
                textureTypes: {
                    _a: subtype._a,
                    _n: subtype._n,
                    _r: subtype._r,
                    _v: subtype._v,
                    _d: subtype._d,
                    _em: subtype._em,
                    _3m: subtype._3m,
                    _Billboards_a: subtype._Billboards_a,
                    _Billboards_n: subtype._Billboards_n,
                    _g: subtype._g,
                    _m: subtype._m,
                    _1m: subtype._1m,
                    _van: subtype._van,
                    _vat: subtype._vat,
                }
            };
        });

        // Send the result array as the response
        res.send(result);
    });
}

module.exports = router;
