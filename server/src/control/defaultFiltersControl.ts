import { Request, Response } from "express";
import { fetchDefaultFilters } from "../service/defaultFilters.js";
import { Database as TDatabase } from "better-sqlite3";

export const defaultFiltersControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const savedSearches = fetchDefaultFilters(db);

    res.send({ savedSearches });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};
