// serveAllTags
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Construct the relative path to the database
const dbPath = path.resolve(__dirname, '../8a2f6b3c9e4f7ab.db');

function connectToDatabase() {
    return new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to the database:', err.message);
        }
    });
}

// Get all tags from the database
// url: localhost:3030/allTags
router.get('/', (req, res) => {
    let db = connectToDatabase();

    const sqlQuery = `
        SELECT id, name, category
        FROM tags;
    `;

    db.all(sqlQuery, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error occurred' });
        }
        res.json({ tags: rows });
    });

    db.close();
});

module.exports = router;
