import express from "express";
const router = express.Router();

// Define the route for counting tagged textures and total textures
router.get("/:user_id/:tag_id", (req, res) => {
  const userId = parseInt(req.params.user_id);
  const tagId = parseInt(req.params.tag_id);
  const db = req.db; // use the database connection from the middleware in server.js modifying the request

  // Count the entries in the tag_texture_associations for the given user_id and tag_id
  const countTagsQuery = `
        SELECT COUNT(*) AS count
        FROM tag_texture_associations
        WHERE user_id = ? AND tag_id = ?;
    `;

  db.get(countTagsQuery, [userId, tagId], (err, countRow) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }

    const taggedCount = countRow.count;

    // Count the total number of entries in the textures table
    const countTexturesQuery = `
            SELECT COUNT(*) AS totalCount
            FROM textures_tracking_duplicates
            WHERE copy_of_normal = 0;
        `;

    db.get(countTexturesQuery, (err, totalRow) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Database error");
      }

      const totalTexturesCount = totalRow.totalCount;

      // Send the counts in the response
      res.send({
        taggedCount: taggedCount, // Number of tags for the user and tag combination
        totalTexturesCount: totalTexturesCount, // Total number of textures
      });
    });
  });
});

export default router;
