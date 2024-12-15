import { Request, Response } from "express";
import {
  postTagToTexture,
  getTagToTexture,
  deleteTagToTexture,
} from "../service/textureTagging.js"; // Ensure to import service functions

export const postTagToTextureControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = res.locals.db;
    const { user_id, tag_id, texture_id, vote } = req.body;

    const result = await postTagToTexture(
      db,
      user_id,
      tag_id,
      texture_id,
      vote
    );

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message || "Error" });
    }
  } catch (err) {
    console.error("Error in postTagToTextureControl:", err);
    res.status(500).json({ error: "Database error occurred" });
  }
};

export const getTagToTextureControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = res.locals.db;
    const { user_id, texture_id } = req.params;

    const result = await getTagToTexture(
      db,
      Number(user_id),
      Number(texture_id)
    );

    if (result.data) {
      res.status(200).json({ tags: result.data });
    } else {
      res.status(404).json({ error: result.error || "Tags not found" });
    }
  } catch (err) {
    console.error("Error in getTagToTextureControl:", err);
    res.status(500).json({ error: "Database error occurred" });
  }
};

export const deleteTagToTextureControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db = res.locals.db;
    const { user_id, tag_id, texture_id } = req.body;

    const result = await deleteTagToTexture(
      db,
      Number(user_id),
      Number(tag_id),
      Number(texture_id)
    );

    if (result.success) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(404).json({ message: result.message || "Error" });
    }
  } catch (err) {
    console.error("Error in deleteTagToTextureControl:", err);
    res.status(500).json({ error: "Database error occurred" });
  }
};
