import { Request, Response } from "express";
import { Database } from "better-sqlite3";

// Extend the Request interface to include the database connection
interface DBRequest extends Request {
  db: Database;
}

export const handleTagOnTextureVote = (req: Request, res: Response): void => {
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
    console.error("Error processing vote:", (err as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteTagFromTexture = (
  req: DBRequest,
  res: Response
): void => {
  try {
    const { user_id, tag_id, texture_id } = req.body;

    const userId = parseInt(user_id, 10);
    const tagId = parseInt(tag_id, 10);
    const textureId = parseInt(texture_id, 10);

    if (isNaN(userId) || isNaN(tagId) || isNaN(textureId)) {
      return res
        .status(400)
        .json({ error: "Invalid user ID, tag ID, or texture ID" });
    }

    const db = req.db;

    console.log("Received deletion request:", { userId, tagId, textureId });

    const sqlQuery = `
      DELETE FROM tag_texture_associations
      WHERE user_id = ? AND tag_id = ? AND texture_id = ?
    `;

    const result = db.prepare(sqlQuery).run(userId, tagId, textureId);

    if (result.changes === 0) {
      return res.status(404).json({
        error: "No tag found to delete for the given user and tag ID",
      });
    }

    res.status(200).json({ message: "Tag successfully deleted" });
  } catch (err) {
    console.error("Error during deletion:", (err as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetTagsForTexture = (
  req: DBRequest,
  res: Response
): void => {
  try {
    const { user_id, texture_id } = req.params;

    const userId = parseInt(user_id, 10);
    const textureId = parseInt(texture_id, 10);

    if (isNaN(userId) || isNaN(textureId)) {
      return res.status(400).json({ error: "Invalid user ID or texture ID" });
    }

    const db = req.db;

    const sqlQuery = `
      SELECT tag_id, vote
      FROM tag_texture_associations
      WHERE user_id = ? AND texture_id = ?;
    `;

    const rows = db.prepare(sqlQuery).all(userId, textureId);

    if (rows.length === 0) {
      return res.status(200).json({ textureTags: [] });
    }

    const textureTags = rows.map((row) => ({
      tag_id: row.tag_id,
      vote: !!row.vote, // Convert to boolean
    }));

    res.status(200).json({ textureTags });
  } catch (err) {
    console.error("Error processing request:", (err as Error).message);
    res.status(500).json({ error: "Internal server error" });
  }
};
