import express from "express";
// Dynamically import the implementation of the endpoint
import { defaultFiltersHandler } from "../handlerFilter/defaultFilters.js";

// Import validation middleware and schema
import { validateResource } from "../../middleware/validateResource.js";
import { emptySchema } from "../../middleware/validationSchemas/emptySchema.js";
// filters are collection of tags, narrowing down texture searches
// some are default, some are user specific
function routeFilter(app) {
  // Route for serving default filters
  app.get(
    "/api/defaultFilters",
    validateResource(emptySchema),
    defaultFiltersHandler
  );
}

export default routeFilter;
