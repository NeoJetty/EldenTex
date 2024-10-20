const express = require('express');
const router = express.Router();

// Define the route for fetching tags for a specific user and image
router.get('/:user_id/:texture_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const textureId = parseInt(req.params.texture_id);
    const db = req.db; // Use the database connection from the request

    // SQL query to find tags for the given user and image
    const sqlQuery = `
        SELECT tag_id, vote
        FROM tag_texture_associations
        WHERE user_id = ? AND texture_id = ?;
    `;

    db.all(sqlQuery, [userId, textureId], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        // If no tags are found, return 200 OK with an empty array
        if (rows.length === 0) {
            return res.status(200).json({ textureTags: [] });
        }

        // Map rows to include boolean values for 'vote'
        const textureTags = rows.map(row => ({
            tag_id: row.tag_id,
            vote: !!row.vote // Convert to boolean
        }));

        // Send the array of tag IDs and votes as JSON response
        res.json({ textureTags });
    });
});

module.exports = router;
