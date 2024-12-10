import { Request, Response } from "express";
import { Database } from "sqlite3"; // Assuming you're using sqlite3, adjust if using another database type

// Interface for texture subtypes data
interface TextureSubtypes {
  _a: boolean;
  _n: boolean;
  _r: boolean;
  _v: boolean;
  _d: boolean;
  _em: boolean;
  _3m: boolean;
  _Billboards_a: boolean;
  _Billboards_n: boolean;
  _g: boolean;
  _m: boolean;
  _1m: boolean;
  _van: boolean;
  _vat: boolean;
}

// Interface for the texture data returned from the database
interface TextureData {
  id: number;
  name: string;
  textureTypes: TextureSubtypes;
}

// Function to fetch filtered texture batch
export const fetchFilteredTextureBatch = (
  req: Request,
  res: Response
): void => {
  try {
    const { user_id, tag_id } = req.params;

    // Validate input parameters
    if (isNaN(Number(user_id)) || isNaN(Number(tag_id))) {
      return res.status(400).json({ error: "Invalid userID or tagID" });
    }

    // Access the database from the request object
    const db: Database = res.locals.db;

    // Query to get all texture image IDs for the given user and tag where vote is TRUE
    const query = `
      SELECT texture_id 
      FROM tag_texture_associations 
      WHERE user_id = ? 
      AND tag_id = ? 
      AND vote = TRUE
    `;

    // Execute query to get texture IDs
    const rows: { texture_id: number }[] = db
      .prepare(query)
      .all(Number(user_id), Number(tag_id));

    // If no textures are found, return a message with an empty array
    if (rows.length === 0) {
      return res.status(200).json({
        message: "No textures found for this user_id and tag_id",
        textures: [],
      });
    }

    // Extract texture IDs
    const textureIDs = rows.map((row) => row.texture_id);

    // Fetch texture data for the retrieved texture IDs
    fetchTexturesDataByIds(textureIDs, db, res);
  } catch (err) {
    console.error("Error fetching textures by user and tag:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};

// Function to fetch texture data for multiple image IDs
const fetchTexturesDataByIds = (
  textureIDs: number[],
  db: Database,
  res: Response
): void => {
  try {
    const placeholders = textureIDs.map(() => "?").join(", ");
    const query = `
      SELECT * 
      FROM textures 
      WHERE id IN (${placeholders})
    `;

    // Execute query to get texture data
    const textureRows: { id: number; name: string }[] = db
      .prepare(query)
      .all(...textureIDs);

    // If no texture data is found, return an error
    if (textureRows.length === 0) {
      return res.status(404).json({ error: "No textures found" });
    }

    // Fetch corresponding subtype data for the textures
    fetchTextureSubtypesData(textureRows, db, res);
  } catch (err) {
    console.error("Error fetching textures data:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};

// Function to fetch texture subtypes data for multiple textures
const fetchTextureSubtypesData = (
  textureRows: { id: number; name: string }[],
  db: Database,
  res: Response
): void => {
  try {
    const imageIDs = textureRows.map((row) => row.id);
    const placeholders = imageIDs.map(() => "?").join(", ");
    const query = `
      SELECT * 
      FROM texture_subtypes 
      WHERE id IN (${placeholders})
    `;

    // Execute query to get subtype data
    const subtypeRows: {
      id: number;
      _a: boolean;
      _n: boolean;
      _r: boolean;
      _v: boolean;
      _d: boolean;
      _em: boolean;
      _3m: boolean;
      _Billboards_a: boolean;
      _Billboards_n: boolean;
      _g: boolean;
      _m: boolean;
      _1m: boolean;
      _van: boolean;
      _vat: boolean;
    }[] = db.prepare(query).all(...imageIDs);

    // Create an array of texture data with their corresponding subtypes
    const result: TextureData[] = textureRows.map((texture) => {
      const subtype = subtypeRows.find((s) => s.id === texture.id);
      return {
        textureName: texture.name,
        id: texture.id,
        textureTypes: {
          _a: subtype ? subtype._a : false,
          _n: subtype ? subtype._n : false,
          _r: subtype ? subtype._r : false,
          _v: subtype ? subtype._v : false,
          _d: subtype ? subtype._d : false,
          _em: subtype ? subtype._em : false,
          _3m: subtype ? subtype._3m : false,
          _Billboards_a: subtype ? subtype._Billboards_a : false,
          _Billboards_n: subtype ? subtype._Billboards_n : false,
          _g: subtype ? subtype._g : false,
          _m: subtype ? subtype._m : false,
          _1m: subtype ? subtype._1m : false,
          _van: subtype ? subtype._van : false,
          _vat: subtype ? subtype._vat : false,
        },
      };
    });

    // Send the result as a JSON response
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching subtypes data:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};
