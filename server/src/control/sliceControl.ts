import { Request, Response } from "express";
import {
  addSlice,
  addAssociation,
  getSlicesByTextureId,
} from "../service/slices.js";
import { Database as TDatabase } from "better-sqlite3";
import { SlicePacket } from "../util/sharedTypes.js";

export const getSliceControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const { texture_ids } = req.params;

    console.log("texture_ids:", texture_ids);

    // Assuming `texture_ids` is already validated and is a string or array
    const ids = Array.isArray(texture_ids)
      ? texture_ids.map((id) => parseInt(id as string, 10))
      : (texture_ids as string).split(",").map((id) => parseInt(id.trim(), 10));

    const slices = getSlicesByTextureId(db, ids);

    res.json({ slices });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};

export const addNewSliceControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const slicePacket: SlicePacket = req.body;

    // Add the new slice and get its ID
    const newSlice_id = addSlice(db, {
      name: slicePacket.sliceName,
      global_description: slicePacket.globalDescription,
      user_id: validUserID,
    });

    if (!newSlice_id) {
      res.status(400).json({ error: "Failed to add slice" });
      return;
    }

    // Add the association using the new slice ID
    const associationNewId = addAssociation(db, {
      slice_id: newSlice_id,
      texture_id: slicePacket.texture_id,
      top_left_x: slicePacket.topLeft.x,
      top_left_y: slicePacket.topLeft.y,
      bottom_right_x: slicePacket.bottomRight.x,
      bottom_right_y: slicePacket.bottomRight.y,
      local_description: slicePacket.localDescription,
      confidence: slicePacket.confidence,
      user_id: validUserID,
    });

    if (associationNewId != null) {
      res.status(201).json({
        message: "Slice and association added successfully",
        slice_id: newSlice_id,
        association_id: associationNewId,
      });
    } else {
      res.status(400).json({ error: "Failed to add association" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const addSliceAssociationControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const slicePacket: SlicePacket = req.body;

    // Destructure relevant fields from SlicePacket
    const {
      slice_id,
      texture_id,
      topLeft,
      bottomRight,
      localDescription,
      confidence,
      user_id,
    } = slicePacket;

    // Call addAssociation with the extracted data
    const result = addAssociation(db, {
      slice_id,
      texture_id,
      top_left_x: topLeft.x,
      top_left_y: topLeft.y,
      bottom_right_x: bottomRight.x,
      bottom_right_y: bottomRight.y,
      local_description: localDescription,
      confidence,
      user_id,
    });

    if (result != null) {
      res.status(201).json({
        message: "Association added successfully",
        association_id: result, // Include the created association ID
      });
    } else {
      res.status(400).json({ error: "Failed to add association" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};
