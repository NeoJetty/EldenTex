import { Database as TDatabase } from "better-sqlite3";

interface RelatedMap {
  map_id: number;
  texture_type: string;
}

export const fetchRelatedMaps = (
  db: TDatabase,
  texture_id: number
): RelatedMap[] => {
  try {
    const sqlQuery = `
      SELECT texture_id, texture_type, map_id
      FROM texture_to_map
      WHERE texture_id = ?;
    `;

    return db.prepare(sqlQuery).all(texture_id) as RelatedMap[];
  } catch (err) {
    throw err;
  }
};
