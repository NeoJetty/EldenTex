import { Application } from "express";
// Dynamically import the implementation of the endpoint
import { defaultFiltersControl } from "../control/defaultFiltersControl.js";

// Import validation middleware and schema
import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

// Filters are collections of tags, narrowing down texture searches
// Some are default, some are user-specific
function routeFilter(app: Application): void {
  // Route for serving default filters
  app.get(
    "/api/defaultFilters",
    validateResource(emptySchema),
    defaultFiltersControl
  );
}

export default routeFilter;
