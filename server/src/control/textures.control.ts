import { Request, Response } from "express";
import { Database as TDatabase } from "better-sqlite3";
import {
  fetchTexturesDataByIds,
  fetchTexturesDataByName,
} from "../service/textures.js";
import { fetchTrueSubtypesForIds } from "../service/subTypes.js";
import { TextureData } from "../util/sharedTypes.js";

export const getTextureByIdControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db: TDatabase = res.locals.db;
    let texture_id = req.params.texture_id;

    // Split comma-separated values into an array of numbers
    const textureIDs = texture_id.split(",").map((id) => Number(id.trim()));

    // Fetch texture data and subtypes in parallel
    const [textureDataResult, textureSubtypesResult] = await Promise.all([
      fetchTexturesDataByIds(db, textureIDs),
      fetchTrueSubtypesForIds(db, textureIDs),
    ]);

    if (textureDataResult.error || textureSubtypesResult.error) {
      res.status(500).json({
        error: textureDataResult.error || textureSubtypesResult.error,
      });
      return;
    }

    const textureDataArray = textureDataResult.data || [];
    const textureSubtypesArray = textureSubtypesResult.data || [];

    if (textureDataArray.length === 0 || textureSubtypesArray.length === 0) {
      res.status(404).json({ error: "Texture not found" });
      return;
    }

    // Combine texture data and subtypes into an array of results
    const result: TextureData[] = textureDataArray.map((texture, index) => ({
      id: texture.id,
      name: texture.name,
      textureTypes: textureSubtypesArray[index] || null, // Match subtypes by index
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error:", (err as Error).message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const getTextureByNameControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const db: TDatabase = res.locals.db;
    let texture_name = req.params.texture_name;

    // Split comma-separated values into an array of strings
    const textureNames = texture_name.split(",").map((name) => name.trim());

    // Fetch texture data by name
    const textureDataResult = await fetchTexturesDataByName(db, textureNames);

    if (textureDataResult.error) {
      res.status(500).json({ error: textureDataResult.error });
      return;
    }

    const textureDataArray = textureDataResult.data || [];

    if (textureDataArray.length === 0) {
      res.status(404).json({ error: "Texture not found" });
      return;
    }

    // Extract IDs from fetched textures and fetch subtypes
    const textureIDs = textureDataArray.map((texture) => texture.id);

    const textureSubtypesResult = await fetchTrueSubtypesForIds(db, textureIDs);

    if (textureSubtypesResult.error) {
      res.status(500).json({ error: textureSubtypesResult.error });
      return;
    }

    // Combine texture data and subtypes
    const result: TextureData[] = textureDataArray.map((texture, index) => ({
      id: texture.id,
      name: texture.name,
      textureTypes: textureSubtypesResult.data![index] || null, // Match subtypes by index
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error:", (err as Error).message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};
