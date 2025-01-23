import { Request, Response } from "express";
import { fetchRelatedMaps } from "../service/maps.js";
import { Database as TDatabase } from "better-sqlite3";

export const getRelatedMapsControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db; // Get the database from middleware
    const texture_id = parseInt(req.params.texture_id); // Get the texture_id from URL params

    const relatedMaps = fetchRelatedMaps(db, texture_id); // Fetch the related maps from the service

    if (relatedMaps.length === 0) {
      res.status(404).json({ message: "No maps found for this texture_id" });
    }

    res.json({ related_maps: relatedMaps });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};
