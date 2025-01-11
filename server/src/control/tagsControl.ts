import { Request, Response } from "express";
import { fetchAllTags, fetchTagsByTexture } from "../service/tags.js";
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

export const getTagsByTextureControl = (req: Request, res: Response): void => {
  try {
    const userID = res.locals.validUserID;
    const db: TDatabase = res.locals.db;
    const textureID = parseInt(req.params.texture_id);
    const textureTags = fetchTagsByTexture(db, userID, textureID);

    res.send({ textureTags });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};
