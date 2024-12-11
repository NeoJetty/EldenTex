import { Database as TDatabase } from "better-sqlite3";

interface SavedSearch {
  search_name: string;
  tag_filters: string;
}

export const fetchDefaultFilters = (db: TDatabase): SavedSearch[] => {
  try {
    const sqlQuery = `
      SELECT search_name, tag_filters
      FROM saved_tag_searches
    `;

    const rows = db.prepare(sqlQuery).all() as SavedSearch[];

    return rows;
  } catch (err) {
    throw err;
  }
};
