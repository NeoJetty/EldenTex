//addTagToImage.js
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Construct the relative path to the database
const dbPath = path.resolve(__dirname, '../8a2f6b3c9e4f7ab.db');

// Connect to the SQLite database
let db;
try {
    db = new sqlite3.Database(dbPath);
} catch (err) {
    console.error('Could not connect to database:', err);
}

router.get('/:user_id/:tag_id', (req, res) => {
    const { user_id, tag_id } = req.params;

    if (!user_id || !tag_id) {
        return res.status(400).json({ error: 'User ID and Tag ID are required' });
    }

    // SQL query to insert a new entry into the tags_per_user table
    const sqlQuery = `
        INSERT INTO tags_per_user (user_id, tag_id)
        VALUES (?, ?);
    `;

    db.run(sqlQuery, user_id, tag_id, function(err) {
        if (err) {
            console.error('SQL error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Check if the entry was inserted
        const lastInsertRowid = this.lastID;
        if (!lastInsertRowid) {
            console.error('Failed to insert entry into tags_per_user table');
            return res.status(400).json({ error: 'Entry not inserted' });
        } else {
            return res.json({ message: 'Tag added successfully', id: lastInsertRowid });
        }
    });
});

module.exports = router;