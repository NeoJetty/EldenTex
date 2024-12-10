import express from 'express';
const router = express.Router();

// Define the route for fetching an untagged texture for a user and tag
router.get('/:user_id/:tag_id', (req, res) => {
    const userId = parseInt(req.params.user_id);
    const tagId = parseInt(req.params.tag_id);
    const db = req.db; // Use the database connection from the request

    // Query to find a random texture from textures_tracking_duplicates that is not yet tagged by the user for the given tag
    const sqlQuery = `
        SELECT t.id, t.name
        FROM textures_tracking_duplicates t
        WHERE t.copy_of_normal = 0
        AND t.id NOT IN (
            SELECT texture_id
            FROM tag_texture_associations
            WHERE user_id = ? AND tag_id = ?
        )
        ORDER BY RANDOM()
        LIMIT 1;
    `;

    db.get(sqlQuery, [userId, tagId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }

        if (!row) {
            return res.status(200).send('No more data for this tag request. Congratulations, all done!');
        }

        const textureId = row.id;

        // Fetch data from texture_subtypes table
        db.get('SELECT * FROM texture_subtypes WHERE id = ?', [textureId], (err, subtypeRow) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('Database error');
            }

            if (!subtypeRow) {
                return res.status(404).send('No subtypes found for the given texture ID');
            }

            // Send the complete JSON response
            res.send({
                textureName: row.name,
                id: row.id,
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
});

export default router;
