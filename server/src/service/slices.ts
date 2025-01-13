import { Database as TDatabase } from "better-sqlite3";
import { SlicePacket } from "../util/sharedTypes.js";

export const addSliceLink = (
  db: TDatabase,
  linkData: {
    sliceID: number;
    textureID: number;
    topLeftX: number;
    topLeftY: number;
    bottomRightX: number;
    bottomRightY: number;
    localDescription: string;
    confidence: number;
    userID: number;
    textureSubtypeBase: string;
  }
): number | null => {
  try {
    const sqlQuery = `
      INSERT INTO slice_texture_links 
      (texture_id, slice_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y, local_description, confidence, user_id, subtype_base) 
      VALUES (@textureID, @sliceID, @topLeftX, @topLeftY, @bottomRightX, @bottomRightY, @localDescription, @confidence, @userID, @textureSubtypeBase);
    `;

    const result = db.prepare(sqlQuery).run(linkData);
    return result.lastInsertRowid as number; // Return the sliceID for further use
  } catch (err) {
    console.error("Database error:", err);
    return null; // Return null on failure
  }
};

export const addSlice = (
  db: TDatabase,
  sliceData: { name: string; globalDescription: string; userID: number }
): number | null => {
  try {
    const sqlQuery = `
      INSERT INTO slices (name, global_description, user_id) 
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

interface SliceRow {
  id: number;
  sliceId: number;
  textureId: number;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
  localDescription: string;
  confidence: number;
  associationUserId: number;
  sliceName: string;
  globalDescription: string;
  sliceUserId: number;
  userId: number;
  textureSubtypeBase: string;
}

export const getSlicesByTextureId = (
  db: TDatabase,
  textureIds: number[]
): SlicePacket[] => {
  try {
    const sqlQuery = `
      SELECT
        LINK.id AS id,
        LINK.slice_id AS sliceId,
        LINK.texture_id AS textureId,
        LINK.user_id AS userId,
        LINK.top_left_x AS topLeftX,
        LINK.top_left_y AS topLeftY,
        LINK.bottom_right_x AS bottomRightX,
        LINK.bottom_right_y AS bottomRightY,
        LINK.local_description AS localDescription,
        LINK.confidence AS confidence,
        LINK.subtype_base AS textureSubtypeBase,
        SLICE.name AS sliceName,
        SLICE.global_description AS globalDescription,
        SLICE.user_id AS sliceUserId
      FROM slice_texture_links AS LINK
      JOIN slices AS SLICE ON LINK.slice_id = SLICE.id
      WHERE LINK.texture_id IN (${textureIds.map(() => "?").join(",")});
    `;

    const rows = db.prepare(sqlQuery).all(textureIds) as SliceRow[];

    return rows.map((row) => ({
      ID: row.id,
      sliceID: row.sliceId,
      sliceUserID: row.sliceUserId,
      textureID: row.textureId,
      linkUserID: row.userId,
      topLeft: {
        x: row.topLeftX,
        y: row.topLeftY,
      },
      bottomRight: {
        x: row.bottomRightX,
        y: row.bottomRightY,
      },
      localDescription: row.localDescription,
      confidence: row.confidence,
      sliceName: row.sliceName,
      globalDescription: row.globalDescription,
      textureSubtypeBase: row.textureSubtypeBase,
    }));
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
};

export type AutocompleteNameResult = { name: string }[];

export const getAutocompleteNames = (
  db: TDatabase,
  partialName: string,
  userID: number
): string[] => {
  try {
    const sqlQuery = `
      SELECT name FROM slices WHERE name LIKE '%${partialName}%' AND user_id = @userID;
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
