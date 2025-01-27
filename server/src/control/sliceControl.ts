import { Request, Response } from "express";
import { Database as TDatabase } from "better-sqlite3";

import { SlicePacket } from "../util/sharedTypes.js";
import {
  addSlice,
  addSliceLink,
  getSlicesByTextureId,
  getAutocompleteNames,
  getSliceByName,
  getLinkByID,
  editSliceLink,
  SliceTextureLinkRow,
  markSliceLinkAsDeleted,
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

export const getAutocompleteNamesControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const userID: number = res.locals.validUserID;
    const { partial_name } = req.params;

    const sliceNames = getAutocompleteNames(db, partial_name, userID);
    res.json({ sliceNames });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};

// grabs an array of SlicePacket from the DB
export const getSliceByNameControl = (req: Request, res: Response): void => {
  try {
    console.log("getSliceByNameControl");
    const db: TDatabase = res.locals.db;
    const userID: number = res.locals.validUserID;
    const { slice_name, confidence_threshold } = req.params;

    // Pass parameters to the service function
    const slices = getSliceByName(
      db,
      slice_name,
      parseFloat(confidence_threshold),
      userID
    );

    res.json({ slices });
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getLinkByIDControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const { link_id } = req.params;
    const linkID: number = Number(link_id);
    const userID: number = res.locals.validUserID;

    const slicePacket = getLinkByID(db, linkID, 101, userID);

    if (slicePacket) {
      res.json({ slicePacket });
    } else {
      res.status(404).json({ error: "Link not found" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getLinksQueryControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const userID: number = res.locals.validUserID;
    const { id, name, confidence } = req.query;

    const parsedConfidence = parseFloat(confidence as string);

    let links = [] as SlicePacket[];

    if (id) {
      // Fetch by ID and confidence
      const parsedId = parseInt(id as string, 10);
      links = getLinkByID(db, parsedId, parsedConfidence, userID);
    } else if (name) {
      // Fetch by name and confidence
      links = getSliceByName(db, name as string, parsedConfidence, userID);
    }
    res.json({ links });
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const editSliceLinkControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const slicePacket: SlicePacket = req.body;

    const sliceLinkRow: SliceTextureLinkRow = {
      id: slicePacket.ID,
      slice_id: slicePacket.sliceID,
      texture_id: slicePacket.textureID,
      top_left_x: slicePacket.topLeft.x,
      top_left_y: slicePacket.topLeft.y,
      bottom_right_x: slicePacket.bottomRight.x,
      bottom_right_y: slicePacket.bottomRight.y,
      local_description: slicePacket.localDescription || null,
      confidence: slicePacket.confidence,
      user_id: validUserID,
      subtype_base: slicePacket.textureSubtypeBase || null,
    };

    const updateResult = editSliceLink(db, sliceLinkRow);

    if (updateResult) {
      res.status(200).json({ message: "Link updated successfully" });
    } else {
      res.status(400).json({ error: "Failed to update link" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const markSliceLinkAsDeletedControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const { link_id } = req.params; // Extract link ID from params

    const linkID: number = Number(link_id);

    const result = markSliceLinkAsDeleted(db, linkID, validUserID);

    if (result) {
      res
        .status(200)
        .json({ message: "Slice link marked as deleted successfully" });
    } else {
      res.status(400).json({ error: "Failed to mark slice link as deleted" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};
