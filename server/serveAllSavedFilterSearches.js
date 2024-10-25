const express = require('express');
const router = express.Router();

// Get all saved searches for a specific user from the database
router.get('/:userId', (req, res) => {
    const userId = req.params.userId;  // Extract user ID from URL parameters
    const sqlQuery = `
        SELECT search_name, tag_filters
        FROM saved_tag_searches
        WHERE user_id = ?;
    `;

    req.db.all(sqlQuery, [userId], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        res.json({ savedSearches: rows });
    });
});

module.exports = router;
