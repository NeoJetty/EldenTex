import {
  handleTagOnTextureVote,
  handleDeleteTagFromTexture,
  handleGetTagsForTexture,
} from "../handlerTextureTagging/TagOnTexture.js";

// Import validation middleware and schema
import { validateResource } from "../../middleware/validateResource.js";
import { emptySchema } from "../../middleware/validationSchemas/emptySchema.js";

// associating textures with tags
function routeTextureTagging(app) {
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
