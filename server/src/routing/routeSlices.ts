import { Application } from "express";
// Import controllers
import {
  addNewSliceControl,
  addSliceAssociationControl,
  getSliceControl,
} from "../control/sliceControl.js";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

function routeSlices(app: Application): void {
  // Route for adding a new slice with association
  app.post(
    "/api/slices/slice",
    validateResource(emptySchema),
    addNewSliceControl
  );

  // Route for adding an association to an existing slice
  app.post(
    "/api/slices/link",
    validateResource(emptySchema),
    addSliceAssociationControl
  );

  app.get(
    "/api/slices/:texture_ids",
    validateResource(emptySchema),
    getSliceControl
  );
}

export default routeSlices;
