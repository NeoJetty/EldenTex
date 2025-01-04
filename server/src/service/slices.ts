import { Database as TDatabase } from "better-sqlite3";
import { SlicePacket } from "../util/sharedTypes.js";

export const addAssociation = (
  db: TDatabase,
  associationData: {
    slice_id: number;
    texture_id: number;
    top_left_x: number;
    top_left_y: number;
    bottom_right_x: number;
    bottom_right_y: number;
    local_description: string;
    confidence: number;
    user_id: number;
  }
): number | null => {
  try {
    const sqlQuery = `
      INSERT INTO slice_texture_associations 
      (texture_id, slice_id, top_left_x, top_left_y, bottom_right_x, bottom_right_y, local_description, confidence, user_id) 
      VALUES (@texture_id, @slice_id, @top_left_x, @top_left_y, @bottom_right_x, @bottom_right_y, @local_description, @confidence, @user_id);
    `;

    const result = db.prepare(sqlQuery).run(associationData);
    return result.lastInsertRowid as number; // Return the slice_id for further use
  } catch (err) {
    console.error("Database error:", err);
    return null; // Return null on failure
  }
};

export const addSlice = (
  db: TDatabase,
  sliceData: { name: string; global_description?: string; user_id?: number }
): number | null => {
  try {
    const sqlQuery = `
      INSERT INTO slices (name, global_description, user_id) 
      VALUES (@name, @global_description, @user_id);
    `;
    const result = db.prepare(sqlQuery).run(sliceData);

    // Return the ID of the newly added slice
    return result.lastInsertRowid as number;
  } catch (err) {
    console.error("Database error:", err);
    return null;
  }
};

interface T_SliceRow {
  id: number;
  slice_id: number;
  texture_id: number;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
  localDescription: string;
  confidence: number;
  associationUserId: number;
  sliceName: string;
  globalDescription: string;
  sliceUser_id: number;
  user_id: number;
}

export const getSlicesByTextureId = (
  db: TDatabase,
  texture_ids: number[]
): SlicePacket[] => {
  try {
    const sqlQuery = `
      SELECT
        sta.id AS id,
        sta.slice_id AS slice_id,
        sta.texture_id AS texture_id,
        sta.user_id AS user_id,
        sta.top_left_x AS topLeftX,
        sta.top_left_y AS topLeftY,
        sta.bottom_right_x AS bottomRightX,
        sta.bottom_right_y AS bottomRightY,
        sta.local_description AS localDescription,
        sta.confidence AS confidence,
        s.name AS sliceName,
        s.global_description AS globalDescription,
        s.user_id AS sliceUser_id
      FROM slice_texture_associations AS sta
      JOIN slices AS s ON sta.slice_id = s.id
      WHERE sta.texture_id IN (${texture_ids.map(() => "?").join(",")});
    `;

    const rows = db.prepare(sqlQuery).all(texture_ids) as T_SliceRow[];

    return rows.map((row) => ({
      id: row.id,
      slice_id: row.slice_id,
      texture_id: row.texture_id,
      user_id: row.user_id,
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
      sliceUser_id: row.sliceUser_id, // Renamed for consistency with the interface
    }));
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
};
