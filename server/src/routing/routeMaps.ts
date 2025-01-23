import { Application } from "express";
// Dynamically import the implementation of the endpoint
import { getRelatedMapsControl } from "../control/maps.control.js";

// Import validation middleware and schema
import { validateParams } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

function routeMaps(app: Application): void {
  // Route for serving default filters
  app.get(
    "/api/maps/related/:texture_id",
    validateParams(emptySchema),
    getRelatedMapsControl
  );
}

export default routeMaps;
