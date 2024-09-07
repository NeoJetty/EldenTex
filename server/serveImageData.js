// serveImageData.js
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

// Define the route for fetching image data (random or by ID)
router.get('/:imageId', (req, res) => {
    const imageId = parseInt(req.params.imageId);

    // If imageId is -1, fetch a random image
    if (imageId === -1) {
        db.get('SELECT COUNT(*) AS count FROM textures', (err, row) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            const count = row.count;
            if (count === 0) {
                return res.status(404).send('No textures found in the database');
            }

            const randomId = Math.floor(Math.random() * count) + 1;
            fetchImageDataById(randomId, res);
        });
    } else {
        // If a specific imageId is provided, fetch that image
        fetchImageDataById(imageId, res);
    }
});

// Function to fetch image data by ID
function fetchImageDataById(imageId, res) {
    db.get('SELECT * FROM textures WHERE id = ?', [imageId], (err, textureRow) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (!textureRow) {
            return res.status(404).send('No texture found with the given ID');
        }

        // Fetch data from texture_subtypes table
        db.get('SELECT * FROM texture_subtypes WHERE id = ?', [imageId], (err, subtypeRow) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            if (!subtypeRow) {
                return res.status(404).send('No subtypes found for the given texture ID');
            }

            const textureName = textureRow.name;
            const jpgPath = path.join(__dirname, '../public/AllAET_JPG', `${textureName}_n.jpg`);
            const fallbackJpgPath = path.join(__dirname, '../public/AllAET_JPG', `${textureName}_a.jpg`);

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
                        id: imageId,
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
}

module.exports = router;
