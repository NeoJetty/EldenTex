import { Database as TDatabase } from "better-sqlite3";

interface Tag {
  id: number;
  name: string;
  category: string;
}

export const fetchAllTags = (db: TDatabase): Tag[] => {
  try {
    const sqlQuery = `
      SELECT id, name, category
      FROM tags;
    `;

    return db.prepare(sqlQuery).all() as Tag[];
  } catch (err) {
    throw err;
  }
};

export const fetchTagsByTexture = (
  db: TDatabase,
  userID: number,
  textureID: number
): Tag[] => {
  try {
    const sqlQuery = `
      SELECT t.id AS tag_id, t.name AS tag_name, t.category, ta.vote
      FROM tags t
      INNER JOIN tag_texture_associations ta ON t.id = ta.tag_id
      WHERE ta.user_id = ? AND ta.texture_id = ?;
    `;

    return db.prepare(sqlQuery).all(userID, textureID) as Tag[];
  } catch (err) {
    throw err;
  }
};
