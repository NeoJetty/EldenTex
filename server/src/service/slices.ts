import { Database as TDatabase } from "better-sqlite3";
import { SlicePacket } from "../util/sharedTypes.js";

export interface SymbolsRow {
  id: number;
  name: string;
  description: string;
  user_id: number;
}

export interface SlicesRow {
  id: number;
  texture_id: number;
  symbol_id: number;
  top_left_x: number;
  top_left_y: number;
  bottom_right_x: number;
  bottom_right_y: number;
  description: string;
  confidence: number;
  user_id: number;
  subtype_base: string;
}

export const addSlice = (
  db: TDatabase,
  linkData: {
    symbolId: number;
    textureId: number;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
    localDescription: string;
    confidence: number;
    userId: number;
    textureSubtypeBase: string;
  }
): number | null => {
  try {
    const sqlQuery = `
      INSERT INTO slices 
      (texture_id, symbol_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y, local_description, confidence, user_id, subtype_base) 
      VALUES (@textureId, @symbolId, @topLeftX, @topLeftY, @bottomRightX, @bottomRightY, @localDescription, @confidence, @userId, @textureSubtypeBase);
    `;

    const result = db.prepare(sqlQuery).run(linkData);
    return result.lastInsertRowid as number;
  } catch (err) {
    console.error("Database error:", err);
    return null;
  }
};

export const addSymbol = (
  db: TDatabase,
  sliceData: { name: string; globalDescription: string; userID: number }
): number | null => {
  try {
    const sqlQuery = `
      INSERT INTO symbols (name, global_description, user_id) 
      VALUES (@name, @globalDescription, @userID);
    `;
    const result = db.prepare(sqlQuery).run(sliceData);

    // Return the ID of the newly added slice
    return result.lastInsertRowid as number;
  } catch (err) {
    console.error("Database error:", err);
    return null;
  }
};

// Define a type for the combined row as userID and description are in both tables
interface CombinedRow extends SlicesRow, SymbolsRow {
  slice_user_id: number;
  symbol_user_id: number;
  local_description: string;
  global_description: string;
}

export const getSlicesByTextureId = (
  db: TDatabase,
  textureIds: number[]
): SlicePacket[] => {
  try {
    const sqlQuery = `
    SELECT
      LINK.id AS id,
      LINK.texture_id AS texture_id,
      LINK.symbol_id AS symbol_id,
      LINK.user_id AS slice_user_id,
      LINK.top_left_x AS top_left_x,
      LINK.top_left_y AS top_left_y,
      LINK.bottom_right_x AS bottom_right_x,
      LINK.bottom_right_y AS bottom_right_y,
      LINK.local_description AS local_description,
      LINK.confidence AS confidence,
      LINK.subtype_base AS subtype_base,
      SLICE.id AS symbol_id,
      SLICE.name AS name,
      SLICE.global_description AS global_description,
      SLICE.user_id AS symbol_user_id
    FROM slices AS LINK
    JOIN symbols AS SLICE ON LINK.symbol_id = SLICE.id
    WHERE LINK.texture_id IN (${textureIds.map(() => "?").join(",")})
      AND LINK.deleted_at IS NULL;
    `;

    const rows = db.prepare(sqlQuery).all(textureIds) as CombinedRow[];

    return rows.map((row) => ({
      slice: {
        id: row.id,
        symbolId: row.symbol_id,
        textureId: row.texture_id,
        topLeft: { x: row.top_left_x, y: row.top_left_y },
        bottomRight: { x: row.bottom_right_x, y: row.bottom_right_y },
        description: row.local_description,
        confidence: row.confidence,
        userId: row.slice_user_id,
        textureSubtypeBase: row.subtype_base,
      },
      symbol: {
        id: row.symbol_id,
        name: row.name,
        description: row.global_description,
        userId: row.symbol_user_id,
      },
    }));
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
};

export type AutocompleteNameResult = { name: string }[];

export const getSymbolNamesByPartiaName = (
  db: TDatabase,
  partialName: string,
  userID: number
): string[] => {
  try {
    const sqlQuery = `
      SELECT name FROM symbols WHERE name LIKE '%${partialName}%' AND user_id = @userID AND deleted_at IS NULL;
    `;
    const result = db
      .prepare(sqlQuery)
      .all({ userID }) as AutocompleteNameResult;

    // Return the list of matching slice names
    return result.map((row) => row.name);
  } catch (err) {
    console.error("Database error:", err);
    return [];
  }
};

export const getSlicePacketsBySymbolName = (
  db: TDatabase,
  sliceName: string,
  confidenceThreshold: number,
  userID: number
): SlicePacket[] => {
  const sliceQuery = `
    SELECT *
    FROM symbols
    WHERE name = ?
      AND user_id = ? AND deleted_at IS NULL
  `;

  console.log(userID, sliceName);
  const symbol = db.prepare(sliceQuery).get(sliceName, userID) as SymbolsRow;
  if (!symbol) {
    throw new Error("Slice not found");
  }

  const linksQuery = `
    SELECT *
    FROM slices
    WHERE symbol_id = ? AND confidence >= ?
  `;

  const links = db
    .prepare(linksQuery)
    .all(symbol.id, confidenceThreshold) as SlicesRow[];

  // Step 3: Map rows to SlicePacket
  return links.map((slice) => ({
    slice: {
      id: slice.id,
      symbolId: slice.symbol_id,
      textureId: slice.texture_id,
      topLeft: { x: slice.top_left_x, y: slice.top_left_y },
      bottomRight: { x: slice.bottom_right_x, y: slice.bottom_right_y },
      description: slice.description,
      confidence: slice.confidence,
      userId: slice.user_id,
      textureSubtypeBase: slice.subtype_base,
    },
    symbol: {
      id: symbol.id,
      name: symbol.name,
      description: symbol.description,
      userId: symbol.user_id,
    },
  }));
};

export const getSlicePacketsBySymbolId = (
  db: TDatabase,
  symbolId: number,
  confidenceThreshold: number,
  userId: number
): SlicePacket[] => {
  const symbolQuery = `
    SELECT *
    FROM symbols
    WHERE id = ? 
      AND user_id = ? AND deleted_at IS NULL
  `;

  console.log(userId, symbolId);
  const symbol = db.prepare(symbolQuery).get(symbolId, userId) as SymbolsRow;
  if (!symbol) {
    throw new Error("Symbol not found");
  }

  const slicesQuery = `
    SELECT *
    FROM slices
    WHERE symbol_id = ? AND confidence >= ?
  `;

  const slices = db
    .prepare(slicesQuery)
    .all(symbol.id, confidenceThreshold) as SlicesRow[];

  // Map rows to SlicePacket
  return slices.map((slice) => ({
    slice: {
      id: slice.id,
      symbolId: slice.symbol_id,
      textureId: slice.texture_id,
      topLeft: { x: slice.top_left_x, y: slice.top_left_y },
      bottomRight: { x: slice.bottom_right_x, y: slice.bottom_right_y },
      description: slice.description,
      confidence: slice.confidence,
      userId: slice.user_id,
      textureSubtypeBase: slice.subtype_base,
    },
    symbol: {
      id: symbol.id,
      name: symbol.name,
      description: symbol.description,
      userId: symbol.user_id,
    },
  }));
};

export const getSliceById = (
  db: TDatabase,
  sliceId: number,
  userId: number
): SlicePacket[] => {
  try {
    console.log("linkId", sliceId, "userId", userId);
    // Query for the slice texture link data with filters for confidence and userID
    const sliceQuery = `
      SELECT *
      FROM slices
      WHERE id = ? AND user_id = ? AND deleted_at IS NULL
    `;
    const links = db.prepare(sliceQuery).all(sliceId, userId) as SlicesRow[];

    // If no links found, return an empty array
    if (!links.length) {
      return [];
    }

    // Query for the corresponding slice data for each link
    const symbolQuery = `
      SELECT *
      FROM symbols
      WHERE id = ?
    `;

    return links.map((slice) => {
      const symbol = db.prepare(symbolQuery).get(slice.symbol_id) as SymbolsRow;

      // Combine data into a SlicePacket
      return {
        slice: {
          id: slice.id,
          symbolId: slice.symbol_id,
          textureId: slice.texture_id,
          topLeft: { x: slice.top_left_x, y: slice.top_left_y },
          bottomRight: { x: slice.bottom_right_x, y: slice.bottom_right_y },
          description: slice.description,
          confidence: slice.confidence,
          userId: slice.user_id,
          textureSubtypeBase: slice.subtype_base,
        },
        symbol: {
          id: symbol.id,
          name: symbol.name,
          description: symbol.description,
          userId: symbol.user_id,
        },
      };
    });
  } catch (err) {
    console.error("Database error:", err);
    throw err; // Rethrow error to handle it in the calling control function
  }
};

export const editSlice = (db: TDatabase, linkData: SlicesRow): boolean => {
  try {
    const sqlQuery = `
      UPDATE slices
      SET 
        texture_id = @texture_id,
        top_left_x = @top_left_x,
        top_left_y = @top_left_y,
        bottom_right_x = @bottom_right_x,
        bottom_right_y = @bottom_right_y,
        local_description = @local_description,
        confidence = @confidence,
        subtype_base = @subtype_base
      WHERE id = @id AND user_id = @user_id AND symbol_id = @symbol_id;
    `;

    const result = db.prepare(sqlQuery).run({
      ...linkData,
    });
    return result.changes > 0; // Return true if a row was updated
  } catch (err) {
    console.error("Database error:", err);
    return false; // Return false on failure
  }
};

export const markSliceAsDeleted = (
  db: TDatabase,
  linkId: number,
  userId: number
): boolean => {
  try {
    const sqlQuery = `
      UPDATE slices
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = @linkId AND user_id = @userId;
    `;

    const result = db.prepare(sqlQuery).run({ linkID: linkId, userId });
    return result.changes > 0; // Return true if a row was updated
  } catch (err) {
    console.error("Database error:", err);
    return false; // Return false on failure
  }
};

export const markSymbolAsDeleted = (
  db: TDatabase,
  sliceId: number,
  userId: number
): boolean => {
  try {
    db.transaction(() => {
      // Mark the slice as deleted
      const deleteSliceQuery = `
        UPDATE symbols
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE id = @sliceId AND user_id = @userId;
      `;

      const sliceResult = db
        .prepare(deleteSliceQuery)
        .run({ sliceId, userID: userId });

      // If no slice was marked as deleted, skip link deletion
      if (sliceResult.changes === 0) {
        throw new Error("Slice not found or not owned by the user.");
      }

      // Mark all related links as deleted
      const deleteLinksQuery = `
        UPDATE slices
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE symbol_id = @sliceId AND user_id = @userId;
      `;

      db.prepare(deleteLinksQuery).run({ sliceId, userId });
    })();

    return true; // Transaction completed successfully
  } catch (err) {
    console.error("Database error:", err);
    return false; // Return false on failure
  }
};
