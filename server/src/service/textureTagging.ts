import { Database as TDatabase } from "better-sqlite3";

// TODO not RESTful enough. Some logic should go to the controller
export const postTagToTexture = async (
  db: TDatabase,
  userId: number,
  tagId: number,
  textureId: number,
  vote: boolean
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const voteInt = vote ? 1 : 0;

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

    const existingVote = db
      .prepare(checkQuery)
      .get(userId, tagId, textureId) as { vote: number };

    if (existingVote) {
      if (existingVote.vote !== voteInt) {
        db.prepare(updateQuery).run(voteInt, userId, tagId, textureId);
        return { success: true, message: "Vote successfully updated" };
      } else {
        return {
          success: false,
          message: "User has already voted identically on this tag and texture",
        };
      }
    }

    db.prepare(insertQuery).run(userId, tagId, textureId, voteInt);
    return { success: true, message: "Vote successfully recorded" };
  } catch (err) {
    console.error("Error processing vote:", err);
    return { success: false, error: "Database error occurred" };
  }
};

export const getTagToTexture = async (
  db: TDatabase,
  userId: number,
  textureId: number
): Promise<{ data?: { tag_id: number; vote: boolean }[]; error?: string }> => {
  try {
    const sqlQuery = `
      SELECT tag_id, vote
      FROM tag_texture_associations
      WHERE user_id = ? AND texture_id = ?
    `;

    const textureTags = db.prepare(sqlQuery).all(userId, textureId) as {
      tag_id: number;
      vote: number;
    }[];

    // Convert vote integer to boolean
    const result = textureTags.map((tag) => ({
      tag_id: tag.tag_id,
      vote: tag.vote === 1, // Convert to boolean
    }));

    return { data: result };
  } catch (err) {
    console.error("Error fetching tags for texture:", err);
    return { error: "Database error occurred" };
  }
};

export const deleteTagToTexture = async (
  db: TDatabase,
  userId: number,
  tagId: number,
  textureId: number
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const sqlQuery = `
      DELETE FROM tag_texture_associations
      WHERE user_id = ? AND tag_id = ? AND texture_id = ?
    `;

    const result = db.prepare(sqlQuery).run(userId, tagId, textureId);

    if (result.changes === 0) {
      return {
        success: false,
        message: "No tag found to delete for the given user, tag, and texture",
      };
    }

    return { success: true, message: "Tag successfully deleted" };
  } catch (err) {
    console.error("Error deleting tag from texture:", err);
    return { success: false, error: "Database error occurred" };
  }
};
