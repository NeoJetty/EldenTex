// serverAllTags.js
const express = require('express');
const router = express.Router();

// Get all tags from the database
router.get('/', (req, res) => {
    const sqlQuery = `
        SELECT id, name, category
        FROM tags;
    `;

    req.db.all(sqlQuery, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        res.json({ tags: rows });
    });
});

module.exports = router;
