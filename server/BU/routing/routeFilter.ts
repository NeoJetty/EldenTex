import express, { Application } from "express";
// Dynamically import the implementation of the endpoint
import { defaultFiltersHandler } from "../api/handlerFilter/defaultFilters";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource";
import { emptySchema } from "../middleware/validationSchemas/emptySchema";

// Filters are collections of tags, narrowing down texture searches
// Some are default, some are user-specific
function routeFilter(app: Application): void {
  // Route for serving default filters
  app.get(
    "/api/defaultFilters",
    validateResource(emptySchema),
    defaultFiltersHandler
  );
}

export default routeFilter;
