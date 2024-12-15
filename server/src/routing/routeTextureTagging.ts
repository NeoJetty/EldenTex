import { Application } from "express";
import {
  postTagToTextureControl,
  deleteTagToTextureControl,
  getTagToTextureControl,
} from "../control/textureTaggingControl.js";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

// Associating textures with tags
function routeTextureTagging(app: Application): void {
  app.post(
    "/api/tagToTexture",
    validateResource(emptySchema),
    postTagToTextureControl
  );

  app.delete(
    "/api/tagToTexture",
    validateResource(emptySchema),
    deleteTagToTextureControl
  );

  app.get(
    "/api/tagToTexture/:user_id/:texture_id",
    validateResource(emptySchema),
    getTagToTextureControl
  );
}

export default routeTextureTagging;
