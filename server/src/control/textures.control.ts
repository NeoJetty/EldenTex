import { Request, Response } from "express";
import { Database as TDatabase } from "better-sqlite3";
import { fetchTexturesDataByIds } from "../service/textures.js";
import { fetchTrueSubtypesForIds } from "../service/subTypes.js";
import { TextureData } from "../util/sharedTypes.js";

export const getTextureByIdControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db: TDatabase = res.locals.db;
    const texture_id = Number(req.params.texture_id);

    if (isNaN(texture_id)) {
      res.status(400).json({ error: "Invalid texture_id provided" });
      return;
    }

    // Fetch texture data and subtypes in parallel
    const [textureDataResult, textureSubtypesResult] = await Promise.all([
      fetchTexturesDataByIds(db, [texture_id]),
      fetchTrueSubtypesForIds(db, [texture_id]),
    ]);

    if (textureDataResult.error || textureSubtypesResult.error) {
      res.status(500).json({
        error: textureDataResult.error || textureSubtypesResult.error,
      });
      return;
    }

    const textureData = textureDataResult.data![0]; // Single texture expected
    const textureSubtype = textureSubtypesResult.data![0]; // Single subtype expected

    if (!textureData || !textureSubtype) {
      res.status(404).json({ error: "Texture not found" });
      return;
    }

    const result: TextureData = {
      id: textureData.id,
      name: textureData.name,
      textureTypes: textureSubtype,
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error:", (err as Error).message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
