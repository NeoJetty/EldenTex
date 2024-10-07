const express = require('express');
const router = express.Router();

// THIS SEEMS INCOMPLETE
// a tag is created with tag_id and user_id, but there is no name saved for it? not even passed

// Function to count entries in the database
function countInDatabase(db, table, user_id, tag_id) {
    return new Promise((resolve, reject) => {
        const sqlQueryCheck = `
            SELECT COUNT(*) AS count
            FROM ${table}
            WHERE user_id = ? AND tag_id = ?;
        `;

        db.get(sqlQueryCheck, [user_id, tag_id], (err, row) => {
            if (err) {
                return reject('Database error during count check');
            }
            resolve(row.count);
        });
    });
}

// Function to insert entries into the database
function insertToDatabase(db, table, user_id, tag_id) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
            INSERT INTO ${table} (user_id, tag_id)
            VALUES (?, ?);
        `;

        db.run(sqlQuery, [user_id, tag_id], function (err) {
            if (err) {
                return reject('Database error during insertion');
            }
            resolve(this.lastID);
        });
    });
}

// Route handler to check and insert into the database
router.get('/:user_id/:tag_id', async (req, res) => {
    const { user_id, tag_id } = req.params;

    if (!user_id || !tag_id) {
        return res.status(400).json({ error: 'User ID and Tag ID are required' });
    }

    const db = req.db;  // Use the already injected `db` from middleware in server.js
    const table = 'tags_per_user';

    try {
        // Check if the entry exists
        const count = await countInDatabase(db, table, user_id, tag_id);
        if (count > 0) {
            return res.status(400).json({ error: 'Entry already exists', count });
        }

        // Insert into the database
        const lastInsertRowid = await insertToDatabase(db, table, user_id, tag_id);
        return res.json({ message: 'Tag added successfully', id: lastInsertRowid });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    }
});

module.exports = router;
