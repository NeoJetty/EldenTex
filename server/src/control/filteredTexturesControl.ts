import { Request, Response } from "express";
import { getTextureIDsFromFilter } from "../service/filteredTextures.js";
import { fetchTexturesDataByIds } from "../service/textures.js";
import { fetchTextureSubtypesData } from "../service/subTypes.js";
import { TextureSubtypes } from "../util/sharedTypes.js";

// Controller to fetch a filtered batch of textures
export const getFilteredTextureBatchControl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { user_id, tag_id } = req.params;

    // Validate input parameters
    if (isNaN(Number(user_id)) || isNaN(Number(tag_id))) {
      return res.status(400).json({ error: "Invalid userID or tagID" });
    }

    const db = res.locals.db;

    // Step 1: Get texture IDs using the filter
    const textureIDs = getTextureIDsFromFilter(
      db,
      Number(user_id),
      Number(tag_id)
    );
    if (!textureIDs.length) {
      return res.status(204).json([]); // No data case
    }

    // Step 2 & 3: Fetch texture data and subtypes in parallel
    const [textureDataResult, textureSubtypesResult] = await Promise.all([
      fetchTexturesDataByIds(db, textureIDs),
      fetchTextureSubtypesData(db, textureIDs),
    ]);

    if (textureDataResult.error || textureSubtypesResult.error) {
      return res.status(500).json({
        error: textureDataResult.error || textureSubtypesResult.error,
      });
    }

    const textureData = textureDataResult.data!;
    const textureSubtypes = textureSubtypesResult.data!;

    // Combine results into the final response
    const combinedResult = textureData.map((texture) => {
      const subtypes = textureSubtypes.find(
        (subtype) => subtype.id === texture.id
      );
      return {
        ...texture,
        textureTypes: subtypes || createEmptySubtypes(),
      };
    });

    return res.status(200).json(combinedResult);
  } catch (err) {
    console.error("Error fetching filtered texture batch:", err);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
};

export const createEmptySubtypes = (): TextureSubtypes => ({
  _a: false,
  _n: false,
  _r: false,
  _v: false,
  _d: false,
  _em: false,
  _3m: false,
  _Billboards_a: false,
  _Billboards_n: false,
  _g: false,
  _m: false,
  _1m: false,
  _van: false,
  _vat: false,
});
