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
