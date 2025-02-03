import { Application } from "express";
// Import controllers
import {
  addSliceAndSymbolControl,
  addSliceControl,
  getSlicesControl,
  getAutocompleteNamesControl,
  getSlicesByPartialNameControl,
  getSlicesUseQueryControl,
  getSliceByIDControl,
  editSliceControl,
  markSliceAsDeletedControl,
  markSymbolAsDeletedControl,
  getSlicePacketsByPartialNameControl,
} from "../control/sliceControl.js";

// Import validation middleware and schema
import {
  validateBody,
  validateQuery,
  validateResource,
} from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";
import { linksQuerySchema } from "../middleware/validationSchemas/links/links.schema.js";

function routeSlices(app: Application): void {
  // Route for adding a new symbol with slice (2 operations)
  app.post(
    "/api/symbols",
    validateResource(emptySchema),
    addSliceAndSymbolControl
  );

  app.post("/api/slices", validateResource(emptySchema), addSliceControl);

  app.get(
    "/api/slices/byTexture/:texture_ids",
    validateResource(emptySchema),
    getSlicesControl
  );

  app.get(
    "/api/symbolNames/autocomplete/:partial_name",
    validateResource(emptySchema),
    getAutocompleteNamesControl
  );

  app.get(
    "/api/slices/:slice_id",
    validateResource(emptySchema),
    getSliceByIDControl
  );

  app.get(
    "/api/slices/:slice_name/:confidence_threshold",
    validateResource(emptySchema),
    getSlicesByPartialNameControl
  );

  app.get(
    "/api/slicePackets/autocomplete/:partial_name",
    validateResource(emptySchema),
    getSlicePacketsByPartialNameControl
  );

  // { id, name, confidence } query params
  app.get(
    "/api/slices",
    validateQuery(linksQuerySchema),
    getSlicesUseQueryControl
  );

  app.put("/api/slices", validateBody(emptySchema), editSliceControl);

  app.delete(
    "/api/slices/:slice_id",
    validateResource(emptySchema), // Add appropriate validation here
    markSliceAsDeletedControl
  );
  app.delete(
    "/api/symbols/:symbol_id",
    validateResource(emptySchema), // Add appropriate validation here
    markSymbolAsDeletedControl
  );
}

export default routeSlices;
