import { Application } from "express";

import {
  loginControl,
  registerControl,
  loggedInCheckControl,
} from "../control/usersControl.js";

import {
  validateParams,
  validateResource,
} from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";

function routeUsers(app: Application): void {
  // Route for serving default filters
  app.post("/api/login", validateResource(emptySchema), loginControl);
  app.post("/api/register", validateResource(emptySchema), registerControl);
  app.get(
    "/api/loggedInCheck",
    validateParams(emptySchema),
    loggedInCheckControl
  );
}

export default routeUsers;
