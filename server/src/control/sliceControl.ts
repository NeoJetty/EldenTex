import { Request, Response } from "express";
import { Database as TDatabase } from "better-sqlite3";

import { SlicePacket } from "../util/sharedTypes.js";
import {
  addSymbol,
  addSlice,
  getSlicesByTextureId,
  getSymbolNamesByPartiaName,
  getSlicePacketsBySymbolName,
  getSliceByID,
  editSlice,
  SlicesRow,
  markSliceAsDeleted,
  markSymbolAsDeleted,
} from "../service/slices.js";

export const getSlicesControl = (req: Request, res: Response): void => {
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

export const addSliceAndSymbolControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const slicePacket: SlicePacket = req.body;

    // Add the new symbol and get its ID
    const generatedSymbolID = addSymbol(db, {
      name: slicePacket.symbol.name,
      globalDescription: slicePacket.symbol.description,
      userID: validUserID,
    });

    if (!generatedSymbolID) {
      res.status(400).json({ error: "Failed to add symbol" });
      return;
    }

    // Add the new slice link and get its ID
    const generatedLinkID = addSlice(db, {
      symbolId: generatedSymbolID,
      textureId: slicePacket.slice.textureId,
      topLeftX: slicePacket.slice.topLeft.x,
      topLeftY: slicePacket.slice.topLeft.y,
      bottomRightX: slicePacket.slice.bottomRight.x,
      bottomRightY: slicePacket.slice.bottomRight.y,
      localDescription: slicePacket.slice.description,
      confidence: slicePacket.slice.confidence,
      userId: validUserID,
      textureSubtypeBase: slicePacket.slice.textureSubtypeBase,
    });

    if (generatedLinkID != null) {
      res.status(201).json({
        message: "Symbol and slice added successfully",
        symbolId: generatedSymbolID,
        sliceLinkId: generatedLinkID,
      });
    } else {
      res.status(400).json({ error: "Failed to add association" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const addSliceControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const slicePacket: SlicePacket = req.body;

    // Call addSliceLink with the extracted data
    const result = addSlice(db, {
      symbolId: slicePacket.slice.symbolId,
      textureId: slicePacket.slice.textureId,
      topLeftX: slicePacket.slice.topLeft.x,
      topLeftY: slicePacket.slice.topLeft.y,
      bottomRightX: slicePacket.slice.bottomRight.x,
      bottomRightY: slicePacket.slice.bottomRight.y,
      localDescription: slicePacket.slice.description,
      confidence: slicePacket.slice.confidence,
      userId: validUserID,
      textureSubtypeBase: slicePacket.slice.textureSubtypeBase,
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

    const symbolNames = getSymbolNamesByPartiaName(db, partial_name, userID);
    res.json({ symbolNames });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).json({ error: "Database error occurred" });
  }
};

// grabs an array of SlicePacket from the DB
export const getSlicesByPartialNameControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const userID: number = res.locals.validUserID;
    const { slice_name, confidence_threshold } = req.params;

    // Pass parameters to the service function
    const slices = getSlicePacketsBySymbolName(
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

export const getSliceByIDControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const { slice_id } = req.params;
    const sliceId: number = Number(slice_id);
    const userId: number = res.locals.validUserID;

    const slicePacket = getSliceByID(db, sliceId, 101, userId);

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

export const getSlicesUseQueryControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const userID: number = res.locals.validUserID;
    const { id, name, confidence } = req.query;

    const parsedConfidence = parseFloat(confidence as string);

    let links = [] as SlicePacket[];

    if (id) {
      // Fetch by ID and confidence
      const parsedId = parseInt(id as string, 10);
      links = getSliceByID(db, parsedId, parsedConfidence, userID);
    } else if (name) {
      // Fetch by name and confidence
      links = getSlicePacketsBySymbolName(
        db,
        name as string,
        parsedConfidence,
        userID
      );
    }
    res.json({ links });
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const editSliceControl = (req: Request, res: Response): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const slicePacket: SlicePacket = req.body;

    const sliceLinkRow: SlicesRow = {
      id: slicePacket.slice.id,
      symbol_id: slicePacket.slice.symbolId,
      texture_id: slicePacket.slice.textureId,
      top_left_x: slicePacket.slice.topLeft.x,
      top_left_y: slicePacket.slice.topLeft.y,
      bottom_right_x: slicePacket.slice.bottomRight.x,
      bottom_right_y: slicePacket.slice.bottomRight.y,
      description: slicePacket.slice.description,
      confidence: slicePacket.slice.confidence,
      user_id: validUserID,
      subtype_base: slicePacket.slice.textureSubtypeBase,
    };

    const updateResult = editSlice(db, sliceLinkRow);

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

export const markSliceAsDeletedControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const { slice_id } = req.params;

    const sliceId: number = Number(slice_id);

    const result = markSliceAsDeleted(db, sliceId, validUserID);

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

export const markSymbolAsDeletedControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const validUserID: number = res.locals.validUserID;
    const { symbol_id } = req.params;

    const result = markSymbolAsDeleted(db, Number(symbol_id), validUserID);

    if (result) {
      res.status(200).json({ message: "Slice marked as deleted successfully" });
    } else {
      res.status(400).json({ error: "Failed to mark slice link as deleted" });
    }
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};

export const getSlicePacketsByPartialNameControl = (
  req: Request,
  res: Response
): void => {
  try {
    const db: TDatabase = res.locals.db;
    const userID: number = res.locals.validUserID;
    const { partial_name } = req.params;

    // Step 1: Get all slice names matching the partial name
    const sliceNames = getSymbolNamesByPartiaName(db, partial_name, userID);

    // Step 2: Fetch SlicePackets for each slice name
    const allSlicePackets: SlicePacket[] = [];
    sliceNames.forEach((sliceName) => {
      try {
        const slicePackets = getSlicePacketsBySymbolName(
          db,
          sliceName,
          101,
          userID
        );
        allSlicePackets.push(...slicePackets);
      } catch (err) {
        console.error(`Error fetching packets for slice '${sliceName}':`, err);
      }
    });

    // Step 3: Respond with the combined results
    res.json({ slicePackets: allSlicePackets });
  } catch (err) {
    console.error("Error:", (err as Error).message);
    res.status(500).json({ error: "An error occurred" });
  }
};
