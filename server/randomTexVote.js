// server/randomTexVote.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Define the route for fetching a random image
router.get('/', (req, res) => {
    const directoryPath = path.join(__dirname, '../public/AllAET_JPG');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).send('Unable to scan directory');
        }

        if (files.length === 0) {
            return res.status(404).send('No images found');
        }

        const randomFile = files[Math.floor(Math.random() * files.length)];
        res.send({ imageUrl: `/AllAET_JPG/${randomFile}` });
    });
});

module.exports = router;
