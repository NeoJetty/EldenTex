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

router.get('/', async (req, res) => {
    const { user_id, tag_id, image_id, vote } = req.query;

    // Ensure vote is correctly interpreted as a boolean
    const voteBool = (vote === 'true');
    // --------------------------------------------------------
    //  TODO: evil BUGS WHEN SENDING vote = 1 and vote = 0
    // --------------------------------------------------------
    console.log('Received request:', { user_id, tag_id, image_id, vote, voteBool });

    if (!user_id || !tag_id || !image_id || vote === undefined) {
        return res.status(400).json({ error: 'User ID, Tag ID, Image ID, and vote are required' });
    }

    let db = connectToDatabase();

    try {
        // Check if the user has already voted for this tag and image
        const existingVote = await checkExistingVote(db, user_id, tag_id, image_id);

        if (existingVote !== null) {
            // Update the vote if it's different from the existing one
            if (existingVote !== voteBool) {
                await updateVote(db, user_id, tag_id, image_id, voteBool);
                console.log('Vote updated in database');
                return res.status(200).json({ message: 'Vote successfully updated' });
            } else {
                console.log('User has already voted the same');
                return res.status(409).json({ message: 'User has already voted the same on this tag and image' });
            }
        }

        // Insert the new vote into the database
        await insertVote(db, user_id, tag_id, image_id, voteBool);
        console.log('Vote inserted into database');
        res.status(200).json({ message: 'Vote successfully recorded' });
    } catch (error) {
        console.error('Error processing vote:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        db.close();
    }
});

function checkExistingVote(db, user_id, tag_id, image_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT vote 
            FROM tags_by_user_and_image 
            WHERE user_id = ? AND tag_id = ? AND image_id = ?
        `;
        db.get(query, [user_id, tag_id, image_id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? row.vote : null);
        });
    });
}

function insertVote(db, user_id, tag_id, image_id, vote) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO tags_by_user_and_image (user_id, tag_id, image_id, vote) 
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [user_id, tag_id, image_id, vote], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.lastID);
        });
    });
}

function updateVote(db, user_id, tag_id, image_id, vote) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE tags_by_user_and_image
            SET vote = ?
            WHERE user_id = ? AND tag_id = ? AND image_id = ?
        `;
        db.run(query, [vote, user_id, tag_id, image_id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes);
        });
    });
}

module.exports = router;
