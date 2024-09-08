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

router.get('/:user_id/:tag_id', async (req, res) => {
    const { user_id, tag_id } = req.params;

    if (!user_id || !tag_id) {
        return res.status(400).json({ error: 'User ID and Tag ID are required' });
    }

    let db = connectToDatabase();
    const table = 'tags_per_user';

    try {
        const count = await countInDatabase(db, table, user_id, tag_id);
        if (count > 0) {
            return res.status(400).json({ error: 'Entry already exists', count });
        }

        const lastInsertRowid = await insertToDatabase(db, table, user_id, tag_id);
        return res.json({ message: 'Tag added successfully', id: lastInsertRowid });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error });
    } finally {
        db.close();
    }
});

module.exports = router;
