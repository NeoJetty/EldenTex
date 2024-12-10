import { Application } from "express";
import {
  handleTagOnTextureVote,
  handleDeleteTagFromTexture,
  handleGetTagsForTexture,
} from "../api/handlerTextureTagging/TagOnTexture";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource";
import { emptySchema } from "../middleware/validationSchemas/emptySchema";

// Associating textures with tags
function routeTextureTagging(app: Application): void {
  app.post(
    "/api/TagToTexture",
    validateResource(emptySchema),
    handleTagOnTextureVote
  );

  app.delete(
    "/api/TagToTexture",
    validateResource(emptySchema),
    handleDeleteTagFromTexture
  );

  app.get(
    "/api/TagToTexture/:user_id/:texture_id",
    validateResource(emptySchema),
    handleGetTagsForTexture
  );
}

export default routeTextureTagging;
