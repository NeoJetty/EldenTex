// serveRandomUntagged.js
const express = require('express');
const path = require('path');
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
router.get('/:user_id/:tag_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const tagId = parseInt(req.params.tag_id);

    // Query to find a random texture that is not yet tagged by the user for the given tag
    const sqlQuery = `
        SELECT t.id, t.name
        FROM textures t
        WHERE t.id NOT IN (
            SELECT image_id
            FROM tags_by_user_and_image
            WHERE user_id = ? AND tag_id = ?
        )
        ORDER BY RANDOM()
        LIMIT 1;
    `;

    db.get(sqlQuery, [userId, tagId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (!row) {
            return res.status(404).send('No untagged textures found');
        }

        const textureId = row.id;

        // Fetch data from texture_subtypes table
        db.get('SELECT * FROM texture_subtypes WHERE id = ?', [textureId], (err, subtypeRow) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            if (!subtypeRow) {
                return res.status(404).send('No subtypes found for the given texture ID');
            }

            // Send the complete JSON response without performing file existence checks
            res.send({
                textureName: row.name,
                id: row.id,
                textureTypes: {
                    _a: subtypeRow._a,
                    _n: subtypeRow._n,
                    _r: subtypeRow._r,
                    _v: subtypeRow._v,
                    _d: subtypeRow._d,
                    _em: subtypeRow._em,
                    _3m: subtypeRow._3m,
                    _Billboards_a: subtypeRow._Billboards_a,
                    _Billboards_n: subtypeRow._Billboards_n,
                    _g: subtypeRow._g,
                    _m: subtypeRow._m,
                    _1m: subtypeRow._1m,
                    _van: subtypeRow._van,
                    _vat: subtypeRow._vat,
                }
            });
        });
    });
});

module.exports = router;
