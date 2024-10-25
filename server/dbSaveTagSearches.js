// dbSaveTagSearches.js
const express = require('express');
const router = express.Router();

// POST route to save a user's tag search
router.post('/', (req, res) => {
    const { tags, user_id, search_name } = req.body;
    const db = req.db;

    // Validate input
    if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).send('Tags must be an array and cannot be empty.');
    }

    if (!user_id) {
        return res.status(400).send('User ID is required.');
    }

    if (!search_name || typeof search_name !== 'string' || search_name.length === 0) {
        return res.status(400).send('Search name is required and must be a valid string.');
    }

    // Prevent SQL injection by escaping or sanitizing the search_name (SQLite auto-escapes, but you can also apply more validation if needed)
    const safeSearchName = search_name.replace(/[^a-zA-Z0-9\s_-]/g, '');  // Basic sanitization

    // Prepare the tags array as a JSON string
    const tagFiltersJSON = JSON.stringify(tags);

    // SQL query to insert the search into the saved_tag_searches table
    const query = `
        INSERT INTO saved_tag_searches (user_id, search_name, tag_filters) 
        VALUES (?, ?, ?)
    `;

    // Execute the query with the user_id, sanitized search_name, and tag_filters as JSON
    db.run(query, [user_id, safeSearchName, tagFiltersJSON], function (err) {
        if (err) {
            console.error('Error saving search:', err);
            return res.status(500).send('Database error');
        }

        // Return the newly inserted search's ID and success message
        res.status(201).json({
            message: 'Search saved successfully',
            search_id: this.lastID
        });
    });
});

module.exports = router;
