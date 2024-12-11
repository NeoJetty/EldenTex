import { Application } from "express";
// Dynamically import the implementation of the endpoint
import { getFilteredTextureBatchControl } from "../control/filteredTexturesControl.js";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

// Filters are collections of tags, narrowing down texture searches
// Some are default, some are user-specific
function routeFilteredTextures(app: Application): void {
  // Route for serving filtered textures batch
  app.get(
    "/api/filteredTexturesBatch/:user_id/:tag_id",
    validateResource(emptySchema),
    getFilteredTextureBatchControl
  );
}

export default routeFilteredTextures;
