import { Request, Response } from "express";
import { fetchAllTags } from "../service/tags.js";
import { Database as TDatabase } from "better-sqlite3";

export const getAllTagsControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const allTags = fetchAllTags(db);

    res.send({ allTags });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};
