import { Application } from "express";
// Dynamically import the implementation of the endpoint

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";
import {
  getTextureByIdControl,
  getTextureByNameControl,
  getTexturesByQueryControl,
} from "../control/textures.control.js";

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
    getTextureByNameControl
  );
  app.post(
    "/api/textures",
    validateResource(emptySchema),
    getTexturesByQueryControl
  );
}

export default routeTextures;
