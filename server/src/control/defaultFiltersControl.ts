import { Request, Response } from "express";
import { fetchDefaultFilters } from "../service/defaultFilters.js";
import { Database as TDatabase } from "better-sqlite3";

export const defaultFiltersControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const savedSearches = fetchDefaultFilters(db);

    res.json({ savedSearches });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Database error:", err.message);
      res.status(500).json({ error: "Database error occurred" });
    } else {
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};
