import { Request, Response } from "express";
import { Database } from "better-sqlite3"; // Assuming you're using sqlite3, adjust if using another database type

// Interface for the rows returned by the query
interface SavedSearch {
  search_name: string;
  tag_filters: string;
}

// Route handler to fetch the default filters (saved searches) from the database
export const defaultFiltersHandler = (req: Request, res: Response): void => {
  try {
    const sqlQuery = `
      SELECT search_name, tag_filters
      FROM saved_tag_searches
    `;

    // db is already attached to the request via middleware
    const db: Database = res.locals.db;
    const rows: SavedSearch[] = db.prepare(sqlQuery).all();

    // Respond with the fetched default filters
    res.json({ savedSearches: rows });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error occurred" });
  }
};
