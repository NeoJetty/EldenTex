import { Request, Response } from "express";
import { getTextureIDsFromFilter } from "../service/filteredTextures.js";
import { fetchTexturesDataByIds } from "../service/textures.js";
import { fetchTrueSubtypesForIds } from "../service/subTypes.js";
import { TextureData } from "../util/sharedTypes.js";

// Controller to fetch a filtered batch of textures
export const getFilteredTextureBatchControl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, tag_id } = req.params;

    // Validate input parameters
    if (isNaN(Number(user_id)) || isNaN(Number(tag_id))) {
      res.status(400).json({ error: "Invalid userID or tagID" });
      return;
    }

    const db = res.locals.db;

    // Step 1: Get texture IDs using the filter
    const textureIDs = getTextureIDsFromFilter(
      db,
      Number(user_id),
      Number(tag_id)
    );
    if (!textureIDs.length) {
      res.status(204).json([]);
      return; // No data case
    }

    // Step 2 & 3: Fetch texture data and subtypes in parallel
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

    const textureData = textureDataResult.data!;
    const textureSubtypes = textureSubtypesResult.data!;

    const combinedResult: TextureData[] = textureData.map((texture, index) => {
      return {
        id: texture.id,
        name: texture.name,
        textureTypes: textureSubtypes[index],
      };
    });

    res.status(200).json(combinedResult);
  } catch (err) {
    console.error("Error fetching filtered texture batch:", err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};
