const express = require('express');
const router = express.Router();

// Define the route for fetching tags for a specific user and image
router.get('/:user_id/:image_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const imageId = parseInt(req.params.image_id);
    const db = req.db; // Use the database connection from the request

    // SQL query to find tags for the given user and image
    const sqlQuery = `
        SELECT tag_id
        FROM tags_by_user_and_image
        WHERE user_id = ? AND image_id = ? AND vote = 1;
    `;

    db.all(sqlQuery, [userId, imageId], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        // If no tags are found, return 200 OK with an empty array
        if (rows.length === 0) {
            return res.status(200).json([]); // No tags found, but it's not an error
        }

        // Extract tag IDs from the result
        const tagIds = rows.map(row => row.tag_id);

        // Send the array of tag IDs as JSON response
        res.json(tagIds);
    });
});

module.exports = router;
