import { Application } from "express";
// Import controllers
import {
  addNewSliceControl,
  addSliceAssociationControl,
  getSliceControl,
  getAutocompleteNamesControl,
  getSliceNamesByPartialNameControl,
  getLinksQueryControl,
  getLinkByIDControl,
  editSliceLinkControl,
  markSliceLinkAsDeletedControl,
  markSliceAsDeletedControl,
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
  // Route for adding a new slice with link (2 operations)
  app.post(
    "/api/slices/slice",
    validateResource(emptySchema),
    addNewSliceControl
  );

  app.post(
    "/api/links",
    validateResource(emptySchema),
    addSliceAssociationControl
  );

  app.get(
    "/api/slices/:texture_ids",
    validateResource(emptySchema),
    getSliceControl
  );

  app.get(
    "/api/slices/autocompleteNames/:partial_name",
    validateResource(emptySchema),
    getAutocompleteNamesControl
  );

  app.get(
    "/api/links/:link_id",
    validateResource(emptySchema),
    getLinkByIDControl
  );

  app.get(
    "/api/slices/:slice_name/:confidence_threshold",
    validateResource(emptySchema),
    getSliceNamesByPartialNameControl
  );

  app.get(
    "/api/slicePacketsByAutocomplete/:partial_name",
    validateResource(emptySchema),
    getSlicePacketsByPartialNameControl
  );

  // { id, name, confidence } query params
  app.get("/api/links", validateQuery(linksQuerySchema), getLinksQueryControl);
  app.put("/api/links", validateBody(emptySchema), editSliceLinkControl);
  app.delete(
    "/api/links/:link_id",
    validateResource(emptySchema), // Add appropriate validation here
    markSliceLinkAsDeletedControl
  );
  app.delete(
    "/api/slices/:slice_id",
    validateResource(emptySchema), // Add appropriate validation here
    markSliceAsDeletedControl
  );
}

export default routeSlices;
