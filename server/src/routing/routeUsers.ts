import { Application } from "express";

import { loginControl, registerControl } from "../control/usersControl.js";

import { validateResource } from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

function routeUsers(app: Application): void {
  // Route for serving default filters
  app.post("/api/login", validateResource(emptySchema), loginControl); // Pass loginControl to the handler
  app.post("/api/register", validateResource(emptySchema), registerControl); // Placeholder for the register route
}

export default routeUsers;
