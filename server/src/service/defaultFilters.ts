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

    // Parse `tag_filters` for each row to convert it from a JSON string to an object
    return rows.map((row) => ({
      search_name: row.search_name,
      tag_filters: JSON.parse(row.tag_filters), // Parse the stringified JSON
    }));
  } catch (err) {
    throw err;
  }
};
