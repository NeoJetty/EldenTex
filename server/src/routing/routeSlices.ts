import { Application } from "express";
// Import controllers
import {
  addSliceControl,
  getSlicesControl,
  getSlicesUseQueryControl,
  getSliceByIDControl,
  editSliceControl,
  markSliceAsDeletedControl,
} from "../control/sliceControl.js";

// Import validation middleware and schema
import {
  validateBody,
  validateQuery,
  validateResource,
} from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";
import { slicesQuerySchema } from "../middleware/validationSchemas/slices/slices.schema.js";

/* Route requests around symbols and slices where the request is slice-first. Most routes will still
interact with both they symbols and the slices tables. 
This means mainly requests by slice_id or texture but also admin requests around slices
These will often return SlicePackets, but the symbol aspect of these routes is always secondary */
function routeSlices(app: Application): void {
  app.get(
    "/api/slices/byTexture/:texture_ids",
    validateResource(emptySchema),
    getSlicesControl
  );

  app.get(
    "/api/slices/:slice_id",
    validateResource(emptySchema),
    getSliceByIDControl
  );

  // { id, name, confidence } query params
  app.get(
    "/api/slices",
    validateQuery(slicesQuerySchema),
    getSlicesUseQueryControl
  );

  app.post("/api/slices", validateResource(emptySchema), addSliceControl);

  app.put("/api/slices", validateBody(emptySchema), editSliceControl);

  app.delete(
    "/api/slices/:slice_id",
    validateResource(emptySchema), // Add appropriate validation here
    markSliceAsDeletedControl
  );
}

export default routeSlices;
