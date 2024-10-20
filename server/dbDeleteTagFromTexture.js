const express = require('express');
const router = express.Router();

// Define the route for deleting a tag from a texture for a specific user
router.get('/:user_id/:tag_id/:texture_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const tagId = parseInt(req.params.tag_id);
    const textureId = parseInt(req.params.texture_id);
    const db = req.db; // Use the database connection from the request

    console.log('Received deletion request:', { userId, tagId, textureId });


    // SQL query to delete the tag for the given user and tag ID
    const sqlQuery = `
        DELETE FROM tags_by_user_and_image
        WHERE user_id = ? AND tag_id = ? AND image_id = ?;
    `;

    db.run(sqlQuery, [userId, tagId, textureId], function(err) {
        if (err) {
            console.error('Database error during deletion:', err);
            return res.status(500).json({ error: 'Database error' });
        }
    
        // Check if any row was affected (deleted)
        if (this.changes === 0) {
            return res.status(404).json({ error: 'No tag found to delete for the given user and tag ID' });
        }
    
        // Respond with success message in JSON format
        res.status(200).json({ message: 'Tag successfully deleted' });
    });
    
});

module.exports = router;
