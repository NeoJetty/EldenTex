// serveMapsForTexture.js
const express = require('express');
const router = express.Router();

// Fetch all map entries where texture_id matches the request parameter
router.get('/:texture_id', (req, res) => {
    const texture_id = req.params.texture_id;  // Get texture_id from the request

    const sqlQuery = `
        SELECT texture_id, texture_type, map_id
        FROM texture_to_map
        WHERE texture_id = ?;
    `;

    req.db.all(sqlQuery, [texture_id], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No maps found for this texture_id' });
        }
        res.json({ related_maps: rows });
    });
});

module.exports = router;
