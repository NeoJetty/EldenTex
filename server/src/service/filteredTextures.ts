import { Database as TDatabase } from "better-sqlite3";

export const getTextureIDsFromFilter = (
  db: TDatabase,
  user_id: number,
  tag_id: number
): number[] => {
  try {
    const query = `
      SELECT texture_id 
      FROM tag_texture_associations 
      WHERE user_id = ? 
      AND tag_id = ? 
      AND vote = TRUE
    `;

    // Use `all` to get rows of type `{ texture_id: number }[]`
    const rows = db.prepare(query).all(user_id, tag_id) as {
      texture_id: number;
    }[];

    // Map to an array of numbers (texture_ids)
    return rows.map((row) => row.texture_id);
  } catch (err) {
    throw new Error("Unexpected error occurred while fetching texture IDs.");
  }
};
