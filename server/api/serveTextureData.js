// serveTextureData.js
import express from 'express';
const router = express.Router();

// localhost:3030/textureData/:imageId
// Define the route for fetching image data (random or by ID)
router.get('/:imageId', (req, res) => {
    const imageId = parseInt(req.params.imageId);
    const db = req.db; // Use the database connection from the request

    // If imageId is -1, fetch a random image
    if (imageId === -1) {
        db.get('SELECT COUNT(*) AS count FROM textures', (err, row) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            const count = row.count;
            if (count === 0) {
                return res.status(404).send('No textures found in the database');
            }

            const randomId = Math.floor(Math.random() * count) + 1;
            fetchImageDataById(randomId, db, res);
        });
    } else {
        // If a specific imageId is provided, fetch that image
        fetchImageDataById(imageId, db, res);
    }
});

// Function to fetch image data by ID
function fetchImageDataById(imageId, db, res) {
    db.get('SELECT * FROM textures WHERE id = ?', [imageId], (err, textureRow) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Database error');
        }

        if (!textureRow) {
            return res.status(404).send('No texture found with the given ID');
        }

        // Fetch data from texture_subtypes table
        db.get('SELECT * FROM texture_subtypes WHERE id = ?', [imageId], (err, subtypeRow) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            if (!subtypeRow) {
                return res.status(404).send('No subtypes found for the given texture ID');
            }

            // Only return the texture name and subtype info without path or extensions
            res.send({
                textureName: textureRow.name,
                id: imageId,
                textureTypes: {
                    _a: subtypeRow._a,
                    _n: subtypeRow._n,
                    _r: subtypeRow._r,
                    _v: subtypeRow._v,
                    _d: subtypeRow._d,
                    _em: subtypeRow._em,
                    _3m: subtypeRow._3m,
                    _Billboards_a: subtypeRow._Billboards_a,
                    _Billboards_n: subtypeRow._Billboards_n,
                    _g: subtypeRow._g,
                    _m: subtypeRow._m,
                    _1m: subtypeRow._1m,
                    _van: subtypeRow._van,
                    _vat: subtypeRow._vat,
                }
            });
        });
    });
}

export default router;
