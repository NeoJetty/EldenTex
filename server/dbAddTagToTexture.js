const express = require('express');
const router = express.Router();

// dbAddTagToTexture/:user_id/:tag_id/:texture_id/:vote 
router.get('/', async (req, res) => {
    const { user_id, tag_id, texture_id, vote } = req.query;
    const db = req.db; // Use the database connection from the request

    // Ensure vote is correctly interpreted as a boolean
    const voteBool = (vote === 'true');
    console.log('Received request:', { user_id, tag_id, texture_id, vote });

    if (!user_id || !tag_id || !texture_id || vote === undefined) {
        return res.status(400).json({ error: 'User ID, Tag ID, Image ID, and vote are required' });
    }

    try {
        // Check if the user has already voted for this tag and image
        const existingVote = await checkExistingVote(db, user_id, tag_id, texture_id);

        if (existingVote !== null) {
            // Update the vote if it's different from the existing one
            if (existingVote !== voteBool) {
                await updateVote(db, user_id, tag_id, texture_id, voteBool);
                console.log('Vote updated in database');
                return res.status(200).json({ message: 'Vote successfully updated' });
            } else {
                console.log('User has already voted the same');
                return res.status(409).json({ message: 'User has already voted the same on this tag and image' });
            }
        }

        // Insert the new vote into the database
        await insertVote(db, user_id, tag_id, texture_id, voteBool);
        console.log('Vote inserted into database');
        res.status(200).json({ message: 'Vote successfully recorded' });
    } catch (error) {
        console.error('Error processing vote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check if the user has already voted for a specific tag and image
function checkExistingVote(db, user_id, tag_id, texture_id) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT vote 
            FROM tag_texture_associations 
            WHERE user_id = ? AND tag_id = ? AND texture_id = ?
        `;
        db.get(query, [user_id, tag_id, texture_id], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row ? row.vote : null);
        });
    });
}

// Insert a new vote into the database
function insertVote(db, user_id, tag_id, texture_id, vote) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO tag_texture_associations (user_id, tag_id, texture_id, vote) 
            VALUES (?, ?, ?, ?)
        `;
        db.run(query, [user_id, tag_id, texture_id, vote], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.lastID);
        });
    });
}

// Update the vote in the database
function updateVote(db, user_id, tag_id, texture_id, vote) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE tag_texture_associations
            SET vote = ?
            WHERE user_id = ? AND tag_id = ? AND texture_id = ?
        `;
        db.run(query, [vote, user_id, tag_id, texture_id], function (err) {
            if (err) {
                return reject(err);
            }
            resolve(this.changes);
        });
    });
}

module.exports = router;
