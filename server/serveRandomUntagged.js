// serveRandomUntagged.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();

// Construct the relative path to the database
const dbPath = path.resolve(__dirname, '../8a2f6b3c9e4f7ab.db');

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database:', err);
    } else {
        console.log('Connected to database');
    }
});

// Define the route for fetching an untagged texture for a user and tag
router.get('/untaggedTexture/:user_id/:tag_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const tagId = parseInt(req.params.tag_id);

    // Query to find a random texture that is not yet tagged by the user for the given tag
    const sqlQuery = `
        SELECT t.id, t.name
        FROM textures t
        WHERE t.id NOT IN (
            SELECT texture_id
            FROM tags_per_user
            WHERE user_id = ? AND tag_id = ?
        )
        ORDER BY RANDOM()
        LIMIT 1;
    `;

    // Execute the query
    db.get(sqlQuery, [userId, tagId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (!row) {
            return res.status(404).send('No untagged textures found');
        }

        const textureId = row.id;
        const textureName = row.name;

        // Fetch the texture data and subtype data
        db.get('SELECT * FROM texture_subtypes WHERE id = ?', [textureId], (err, subtypeRow) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            if (!subtypeRow) {
                return res.status(404).send('No subtypes found for the given texture ID');
            }

            const jpgPath = path.join(__dirname, '../public/AllAET_JPG', `${textureName}_n.jpg`);
            const fallbackJpgPath = path.join(__dirname, '../public/AllAET_JPG', `${textureName}_a.jpg`);

            // Check if the image exists, and send the appropriate one
            fs.access(jpgPath, fs.constants.F_OK, (err) => {
                let imagePath;
                if (err) {
                    // If _n.jpg does not exist, check for _a.jpg
                    fs.access(fallbackJpgPath, fs.constants.F_OK, (err) => {
                        if (err) {
                            return res.status(404).send('No suitable image found');
                        }
                        imagePath = `/AllAET_JPG/${textureName}_a.jpg`;
                        sendResponse();
                    });
                } else {
                    // _n.jpg exists
                    imagePath = `/AllAET_JPG/${textureName}_n.jpg`;
                    sendResponse();
                }

                function sendResponse() {
                    res.send({
                        imageUrl: imagePath,
                        id: textureId,
                        textureTypes: {
                            _a: subtypeRow._a,
                            _n: subtypeRow._n,
                            _r: subtypeRow._r,
                            _v: subtypeRow._v,
                            _d: subtypeRow._d,
                            _em: subtypeRow._em,
                            _3m: subtypeRow._3m,
                            _b: subtypeRow._Billboards_a,
                            _g: subtypeRow._g,
                            _1m: subtypeRow._1m,
                            _van: subtypeRow._van,
                            _vat: subtypeRow._vat,
                        }
                    });
                }
            });
        });
    });
});

module.exports = router;
