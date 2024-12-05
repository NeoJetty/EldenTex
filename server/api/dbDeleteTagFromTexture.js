export const handleDeleteTagFromTexture = (req, res) => {
  try {
    const { user_id, tag_id, texture_id } = req.params;

    // Parse IDs to ensure they are integers
    const userId = parseInt(user_id, 10);
    const tagId = parseInt(tag_id, 10);
    const textureId = parseInt(texture_id, 10);

    if (isNaN(userId) || isNaN(tagId) || isNaN(textureId)) {
      return res
        .status(400)
        .json({ error: "Invalid user ID, tag ID, or texture ID" });
    }

    const db = req.db; // Use the database connection from the middleware

    console.log("Received deletion request:", { userId, tagId, textureId });

    const sqlQuery = `
        DELETE FROM tag_texture_associations
        WHERE user_id = ? AND tag_id = ? AND texture_id = ?
      `;

    // Execute the deletion query
    const result = db.prepare(sqlQuery).run(userId, tagId, textureId);

    // Check if any row was affected (deleted)
    if (result.changes === 0) {
      return res
        .status(404)
        .json({
          error: "No tag found to delete for the given user and tag ID",
        });
    }

    // Respond with success message
    res.status(200).json({ message: "Tag successfully deleted" });
  } catch (err) {
    console.error("Error during deletion:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
