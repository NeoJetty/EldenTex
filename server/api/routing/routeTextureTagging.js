import {
  handleTagOnTextureVote,
  handleDeleteTagFromTexture,
} from "../handlerTextureTagging/TagOnTexture.js";

// Import validation middleware and schema
import { validateResource } from "../../middleware/validateResource.js";
import { emptySchema } from "../../middleware/validationSchemas/emptySchema.js";

// associating textures with tags
function routeTextureTagging(app) {
  // Route for serving default filters
  app.post(
    "/api/TagToTexture",
    validateResource(emptySchema),
    handleTagOnTextureVote
  );

  app.delete(
    "/api/TagToTexture/:user_id/:tag_id/:texture_id",
    validateResource(emptySchema),
    handleDeleteTagFromTexture
  );
}

export default routeTextureTagging;
