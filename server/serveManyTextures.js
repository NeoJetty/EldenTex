// serveManyTextures.js
const express = require('express');
const router = express.Router();

// Define the route for fetching multiple textures by user and tag
router.get('/:userID/:tagID', (req, res) => {
    const userID = parseInt(req.params.userID);
    const tagID = parseInt(req.params.tagID);
    const db = req.db; // Use the database connection from the request

    if (isNaN(userID) || isNaN(tagID)) {
        return res.status(400).send('Invalid userID or tagID');
    }

    // Query to get all texture image IDs for the given user and tag where vote is TRUE
    const query = `
        SELECT texture_id 
        FROM tag_texture_associations 
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
            return res.status(200).json({ message: 'No textures found for this user_id and tag_id', textures: [] });
        }

        // Fetch texture data for each texture_id
        const textureIDs = rows.map(row => row.texture_id);
        fetchTexturesDataByIds(textureIDs, db, res);
    });
});

// Function to fetch texture data for multiple image IDs
function fetchTexturesDataByIds(textureIDs, db, res) {
    const placeholders = textureIDs.map(() => '?').join(', ');
    const query = `
        SELECT * 
        FROM textures 
        WHERE id IN (${placeholders})
    `;

    db.all(query, textureIDs, (err, textureRows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (textureRows.length === 0) {
            return res.status(404).send('No textures found');
        }

        // Fetch corresponding subtype data for each image
        fetchTextureSubtypesData(textureRows, db, res);
    });
}

// Function to fetch texture subtypes data for multiple textures
function fetchTextureSubtypesData(textureRows, db, res) {
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
                    _a: subtype ? subtype._a : false,
                    _n: subtype ? subtype._n : false,
                    _r: subtype ? subtype._r : false,
                    _v: subtype ? subtype._v : false,
                    _d: subtype ? subtype._d : false,
                    _em: subtype ? subtype._em : false,
                    _3m: subtype ? subtype._3m : false,
                    _Billboards_a: subtype ? subtype._Billboards_a : false,
                    _Billboards_n: subtype ? subtype._Billboards_n : false,
                    _g: subtype ? subtype._g : false,
                    _m: subtype ? subtype._m : false,
                    _1m: subtype ? subtype._1m : false,
                    _van: subtype ? subtype._van : false,
                    _vat: subtype ? subtype._vat : false,
                }
            };
        });

        // Send the result array as the response
        res.send(result);
    });
}

module.exports = router;
