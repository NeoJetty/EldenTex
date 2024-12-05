export const handleTagOnTextureVote = (req, res) => {
  try {
    const { user_id, tag_id, texture_id, vote } = req.body;

    console.log("Received vote request:", {
      user_id,
      tag_id,
      texture_id,
      vote,
    });

    // Ensure vote is interpreted as an integer (0 or 1)
    const voteInt = vote === true ? 1 : 0;

    if (!user_id || !tag_id || !texture_id || vote === undefined) {
      return res
        .status(400)
        .json({ error: "User ID, Tag ID, Texture ID, and vote are required" });
    }

    const db = req.db;

    const checkQuery = `
          SELECT vote
          FROM tag_texture_associations
          WHERE user_id = ? AND tag_id = ? AND texture_id = ?
        `;
    const updateQuery = `
          UPDATE tag_texture_associations
          SET vote = ?
          WHERE user_id = ? AND tag_id = ? AND texture_id = ?
        `;
    const insertQuery = `
          INSERT INTO tag_texture_associations (user_id, tag_id, texture_id, vote)
          VALUES (?, ?, ?, ?)
        `;

    // Check if the user has already voted for this tag and image
    const existingVote = db
      .prepare(checkQuery)
      .get(user_id, tag_id, texture_id);

    if (existingVote) {
      if (existingVote.vote !== voteInt) {
        db.prepare(updateQuery).run(voteInt, user_id, tag_id, texture_id);
        return res.status(200).json({ message: "Vote successfully updated" });
      } else {
        return res.status(409).json({
          message: "User has already voted the same on this tag and image",
        });
      }
    }

    db.prepare(insertQuery).run(user_id, tag_id, texture_id, voteInt);
    res.status(200).json({ message: "Vote successfully recorded" });
  } catch (err) {
    console.error("Error processing vote:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteTagFromTexture = (req, res) => {
  try {
    // Extract data from the request body
    const { user_id, tag_id, texture_id } = req.body;

    // Ensure IDs are valid integers
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
      return res.status(404).json({
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

// get all tags for one texture
export const handleGetTagsForTexture = (req, res) => {
  try {
    const { user_id, texture_id } = req.params;

    // Ensure user_id and texture_id are valid integers
    const userId = parseInt(user_id, 10);
    const textureId = parseInt(texture_id, 10);

    if (isNaN(userId) || isNaN(textureId)) {
      return res.status(400).json({ error: "Invalid user ID or texture ID" });
    }

    const db = req.db; // Use the database connection from the request

    // SQL query to find tags for the given user and image
    const sqlQuery = `
          SELECT tag_id, vote
          FROM tag_texture_associations
          WHERE user_id = ? AND texture_id = ?;
        `;

    // Use better-sqlite3 to query the database
    const rows = db.prepare(sqlQuery).all(userId, textureId);

    // If no tags are found, return 200 OK with an empty array
    if (rows.length === 0) {
      return res.status(200).json({ textureTags: [] });
    }

    // Map rows to include boolean values for 'vote'
    const textureTags = rows.map((row) => ({
      tag_id: row.tag_id,
      vote: !!row.vote, // Convert to boolean
    }));

    // Send the array of tag IDs and votes as JSON response
    return res.status(200).json({ textureTags });
  } catch (err) {
    console.error("Error processing request:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
