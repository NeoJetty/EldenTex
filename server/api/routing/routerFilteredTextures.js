import express from "express";
// Dynamically import the implementation of the endpoint
import { fetchFilteredTextureBatch } from "../handlerFilteredTextures/multipleFilteredTextures.js";

// Import validation middleware and schema
import { validateResource } from "../../middleware/validateResource.js";
import { emptySchema } from "../../middleware/validationSchemas/emptySchema.js";
// filters are collection of tags, narrowing down texture searches
// some are default, some are user specific
function routeFilteredTextures(app) {
  // Route for serving default filters
  app.get(
    "/api/filteredTexturesBatch/:user_id/:tag_id",
    validateResource(emptySchema),
    fetchFilteredTextureBatch
  );
}

export default routeFilteredTextures;
