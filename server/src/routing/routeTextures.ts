import { Application } from "express";
// Dynamically import the implementation of the endpoint

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";
import { getTextureByIdControl } from "../control/textures.control.js";

function routeTextures(app: Application): void {
  // Route for serving default filters
  app.get(
    "/api/textureData/:texture_id",
    validateResource(emptySchema),
    getTextureByIdControl
  );
  app.get(
    "/api/textureDataByName/:texture_name",
    validateResource(emptySchema),
    getTextureByIdControl
  );
}

export default routeTextures;
