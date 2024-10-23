// serveTexturesByTags.js
const express = require('express');
const router = express.Router();


// /serveTexturesByMultipleTags.js
router.post('/', (req, res) => {
    const tags = req.body.tags;  // Array of tags with { tag_id, vote }
    const db = req.db;

    if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).send('Tags must be an array and cannot be empty.');
    }

    // Prepare SQL WHERE clause based on tag_id and vote pairs
    let whereClause = tags.map((_, index) => `(tag_id = ? AND vote = ?)`).join(' OR ');
    let params = [];

    // Populate params with alternating tag_id and vote
    tags.forEach(tag => {
        params.push(tag.tag_id, tag.vote);
    });

    // Add the GROUP BY and HAVING clause to ensure all tags must match (AND search)
    const query = `
        SELECT texture_id 
        FROM tag_texture_associations 
        WHERE ${whereClause}
        GROUP BY texture_id
        HAVING COUNT(DISTINCT tag_id) = ?
    `;
    console.log(query);
    // Execute the query with params and number of tags (for HAVING clause)
    db.all(query, [...params, tags.length], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (rows.length === 0) {
            return res.status(200).json({ message: 'No textures match the given tags and votes.', textures: [] });
        }

        // Fetch texture data for each texture_id
        const textureIDs = rows.map(row => row.texture_id);
        fetchTexturesDataByIds(textureIDs, db, res);
    });
});


// Function to fetch texture data for multiple image IDs (same as before)
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

        // Fetch corresponding subtype data for each texture
        fetchTextureSubtypesData(textureRows, db, res);
    });
}

// Function to fetch texture subtypes data for multiple textures (same as before)
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
