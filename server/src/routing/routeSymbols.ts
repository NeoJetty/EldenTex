import { Application } from "express";
// Import controllers
import {
  addSliceAndSymbolControl,
  getAutocompleteNamesControl,
  getSymbolSlicesBySymbolNameControl,
  markSymbolAsDeletedControl,
  getSlicePacketsByPartialNameControl,
  getSymbolSlicesControl,
} from "../control/sliceControl.js";

// Import validation middleware and schema
import {
  validateBody,
  validateQuery,
  validateResource,
} from "../middleware/validateResource.js";
import { emptySchema } from "../middleware/validationSchemas/emptySchema.js";
import { slicesQuerySchema } from "../middleware/validationSchemas/slices/slices.schema.js";

/* Route requests around symbols and slices where the request is symbol-first. Most routes will still
interact with both they symbols and the slices tables. 
This means mainly requests by symbol_id or symbol_name but also admin requests around symbols
Similarly to slices these will sometimes return SlicePackets. */
function routeSymbols(app: Application): void {
  // Route for adding a new symbol with slice (2 operations)
  app.post(
    "/api/symbols",
    validateResource(emptySchema),
    addSliceAndSymbolControl
  );

  app.get(
    "/api/symbolNames/autocomplete/:partial_name",
    validateResource(emptySchema),
    getAutocompleteNamesControl
  );

  app.get(
    "/api/symbols/:symbol_name/:confidence_threshold",
    validateResource(emptySchema),
    getSymbolSlicesBySymbolNameControl
  );

  app.get(
    "/api/symbols",
    validateResource(emptySchema),
    getSymbolSlicesControl
  );

  app.get(
    "/api/slicePackets/autocomplete/:partial_name",
    validateResource(emptySchema),
    getSlicePacketsByPartialNameControl
  );

  app.delete(
    "/api/symbols/:symbol_id",
    validateResource(emptySchema), // Add appropriate validation here
    markSymbolAsDeletedControl
  );
}

export default routeSymbols;
