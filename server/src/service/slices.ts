import { Database as TDatabase } from "better-sqlite3";
import { SlicePacket } from "../util/sharedTypes.js";

export interface SliceRow {
  id: number;
  name: string;
  global_description: string;
  user_id: number;
}

export interface SliceTextureLinkRow {
  id: number;
  texture_id: number;
  slice_id: number;
  top_left_x: number;
  top_left_y: number;
  bottom_right_x: number;
  bottom_right_y: number;
  local_description: string | null;
  confidence: number;
  user_id: number;
  subtype_base: string | null;
}

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

export const getSlicesByTextureId = (
  db: TDatabase,
  textureIds: number[]
): SlicePacket[] => {
  try {
    const sqlQuery = `
      SELECT
        LINK.id AS id,
        LINK.slice_id AS slice_id,
        LINK.texture_id AS texture_id,
        LINK.user_id AS user_id,
        LINK.top_left_x AS top_left_x,
        LINK.top_left_y AS top_left_y,
        LINK.bottom_right_x AS bottom_right_x,
        LINK.bottom_right_y AS bottom_right_y,
        LINK.local_description AS local_description,
        LINK.confidence AS confidence,
        LINK.subtype_base AS subtype_base,
        SLICE.id AS slice_id,
        SLICE.name AS name,
        SLICE.global_description AS global_description,
        SLICE.user_id AS user_id
      FROM slice_texture_links AS LINK
      JOIN slices AS SLICE ON LINK.slice_id = SLICE.id
      WHERE LINK.texture_id IN (${textureIds.map(() => "?").join(",")});
    `;

    // Fetch rows with proper type assertion
    const rows = db.prepare(sqlQuery).all(textureIds) as (SliceTextureLinkRow &
      SliceRow)[];

    // Map rows into SlicePacket
    return rows.map((row) => ({
      // Fields from `slice_texture_links`
      ID: row.id,
      sliceID: row.slice_id,
      textureID: row.texture_id,
      linkUserID: row.user_id,
      topLeft: {
        x: row.top_left_x,
        y: row.top_left_y,
      },
      bottomRight: {
        x: row.bottom_right_x,
        y: row.bottom_right_y,
      },
      localDescription: row.local_description || "",
      confidence: row.confidence,
      textureSubtypeBase: row.subtype_base || "",

      // Fields from `slices`
      sliceName: row.name,
      globalDescription: row.global_description,
      sliceUserID: row.user_id,
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

export const getSliceByName = (
  db: TDatabase,
  sliceName: string,
  confidenceThreshold: number,
  userID: number
): SlicePacket[] => {
  // Step 1: Query `slices` table and cast result to `SliceRow`
  const sliceQuery = `
    SELECT *
    FROM slices
    WHERE name = ?
      AND user_id = ?
  `;

  const slice = db.prepare(sliceQuery).get(sliceName, userID) as
    | SliceRow
    | undefined;

  if (!slice) {
    throw new Error("Slice not found");
  }

  // Step 2: Query `slice_texture_links` table and cast results to `SliceTextureLinkRow[]`
  const linksQuery = `
    SELECT *
    FROM slice_texture_links
    WHERE slice_id = ?
      AND confidence >= ?
  `;

  const links = db
    .prepare(linksQuery)
    .all(slice.id, confidenceThreshold) as SliceTextureLinkRow[];

  // Step 3: Map rows to SlicePacket
  return links.map((link) => ({
    // slice_texture_links fields
    ID: link.id,
    sliceID: link.slice_id,
    textureID: link.texture_id,
    topLeft: { x: link.top_left_x, y: link.top_left_y },
    bottomRight: { x: link.bottom_right_x, y: link.bottom_right_y },
    localDescription: link.local_description || "",
    confidence: link.confidence,
    linkUserID: link.user_id,

    // slices fields (shared across all SlicePackets for this slice)
    sliceName: slice.name,
    globalDescription: slice.global_description,
    sliceUserID: slice.user_id,
    textureSubtypeBase: link.subtype_base || "",
  }));
};

export const getLinkByID = (
  db: TDatabase,
  linkID: number,
  confidence: number,
  userID: number
): SlicePacket[] => {
  try {
    console.log("linkID", linkID, "confidence", confidence, "userID", userID);
    // Query for the slice texture link data with filters for confidence and userID
    const linkQuery = `
      SELECT *
      FROM slice_texture_links
      WHERE id = ? AND confidence >= ? AND user_id = ?
    `;
    const links = db
      .prepare(linkQuery)
      .all(linkID, confidence, userID) as SliceTextureLinkRow[];

    // If no links found, return an empty array
    if (!links.length) {
      return [];
    }

    // Query for the corresponding slice data for each link
    const sliceQuery = `
      SELECT *
      FROM slices
      WHERE id = ?
    `;

    return links.map((link) => {
      const slice = db.prepare(sliceQuery).get(link.slice_id) as SliceRow;

      // Combine data into a SlicePacket
      return {
        // slice_texture_links fields
        ID: link.id,
        sliceID: link.slice_id,
        textureID: link.texture_id,
        topLeft: { x: link.top_left_x, y: link.top_left_y },
        bottomRight: { x: link.bottom_right_x, y: link.bottom_right_y },
        localDescription: link.local_description || "",
        confidence: link.confidence,
        linkUserID: link.user_id,

        // slices fields
        sliceName: slice.name,
        globalDescription: slice.global_description,
        sliceUserID: slice.user_id,
        textureSubtypeBase: link.subtype_base || "",
      };
    });
  } catch (err) {
    console.error("Database error:", err);
    throw err; // Rethrow error to handle it in the calling control function
  }
};
