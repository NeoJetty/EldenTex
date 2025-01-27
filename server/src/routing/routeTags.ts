import { Application } from "express";
// Dynamically import the implementation of the endpoint
import {
  getAllTagsControl,
  getTagsByTextureControl,
} from "../control/tagsControl.js";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

function routeTags(app: Application): void {
  // Route for serving default filters
  app.get("/api/allTags", validateResource(emptySchema), getAllTagsControl);
  app.get(
    "/api/taggingTextures/:texture_id",
    validateResource(emptySchema),
    getTagsByTextureControl
  );
}

export default routeTags;
