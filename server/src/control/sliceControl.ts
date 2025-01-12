import { Request, Response } from "express";
import { Database as TDatabase } from "better-sqlite3";

import { SlicePacket } from "../util/sharedTypes.js";
import {
  addSlice,
  addSliceLink,
  getSlicesByTextureId,
} from "../service/slices.js";

export const getSliceControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const { texture_ids } = req.params;

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
    const generatedSliceID = addSlice(db, {
      name: slicePacket.sliceName,
      globalDescription: slicePacket.globalDescription,
      userID: validUserID,
    });

    if (!generatedSliceID) {
      res.status(400).json({ error: "Failed to add slice" });
      return;
    }

    const generatedLinkID = addSliceLink(db, {
      sliceID: generatedSliceID,
      textureID: slicePacket.textureID,
      topLeftX: slicePacket.topLeft.x,
      topLeftY: slicePacket.topLeft.y,
      bottomRightX: slicePacket.bottomRight.x,
      bottomRightY: slicePacket.bottomRight.y,
      localDescription: slicePacket.localDescription,
      confidence: slicePacket.confidence,
      userID: validUserID,
      textureSubtypeBase: slicePacket.textureSubtypeBase,
    });

    if (generatedLinkID != null) {
      res.status(201).json({
        message: "Slice and association added successfully",
        sliceID: generatedSliceID,
        SliceLinkID: generatedLinkID,
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
    const validUserID: number = res.locals.validUserID;
    const slicePacket: SlicePacket = req.body;

    // Call addAssociation with the extracted data
    const result = addSliceLink(db, {
      sliceID: slicePacket.sliceID,
      textureID: slicePacket.textureID,
      topLeftX: slicePacket.topLeft.x,
      topLeftY: slicePacket.topLeft.y,
      bottomRightX: slicePacket.bottomRight.x,
      bottomRightY: slicePacket.bottomRight.y,
      localDescription: slicePacket.localDescription,
      confidence: slicePacket.confidence,
      userID: validUserID,
      textureSubtypeBase: slicePacket.textureSubtypeBase,
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
