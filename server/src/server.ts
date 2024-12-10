import express, { Application } from "express";
/* import routeFilter from "./routing/routeFilter.js";
import routeTextureTagging from "./routing/routeTextureTagging.js";
import routeFilteredTextures from "./routing/routeFilteredTextures.js";
import connectDB from "./middleware/connectDB.js";
 */
const app: Application = express();
const port: number = 3030;

// Async function to register routes
async function registerRoutes(): Promise<void> {
  // ------------------------------------------------------
  // Serve modules
  // ------------------------------------------------------
  /*   routeFilteredTextures(app);
  routeFilter(app);
  routeTextureTagging(app);
 */
  /*   // textureData/:texture_id (GET specific texture data by texture_id, or random if texture_id is -1)
  app.use("/api/textureData", (await import("./api/serveTextureData")).default);

  // textureDataByName/:textureName
  app.use(
    "/api/textureDataByName",
    (await import("./api/serveTextureDataByName")).default
  );

  // allTags
  app.use("/api/allTags", (await import("./api/serveAllTags")).default);

  // untaggedTexture/:user_id/:tag_id
  app.use(
    "/api/untaggedTexture",
    (await import("./api/serveRandomUntagged")).default
  );

  // countTaggingProgress/:user_id/:tag_id
  app.use(
    "/api/countTaggingProgress",
    (await import("./api/serveCountTaggingProgress")).default
  );

  // serveMapsForTexture/:texture_id
  app.use(
    "/api/serveMapsForTexture",
    (await import("./api/serveMapsForTexture")).default
  );

  // serveTexturesByMultipleTags/:POST-JSON{user_id,tags:[{tag_id:number, vote:boolean},{...},{...}]}
  app.use(
    "/api/serveTexturesByMultipleTags",
    (await import("./api/serveTexturesByMultipleTags")).default
  );



  // ------------------------------------------------------
  // DB write modules
  // ------------------------------------------------------

  // dbCreateNewTag/:user_id/:tag_id
  app.use(
    "/api/dbCreateNewTag",
    (await import("./api/dbCreateNewTag")).default
  );

  // dbSaveTagSearches/:POST-JSON{user_id,search_name,tags:[{tag_id:number, vote:boolean},{...},{...}]}
  app.use(
    "/api/dbSaveTagSearches",
    (await import("./api/dbSaveTagSearches")).default
  );

  // ------------------------------------------------------
  // Utility modules
  // ------------------------------------------------------

  // login/:POST-JSON{email:string, password:string}
  app.use("/api/login", (await import("./utils/login")).default);
 */
}

// Middleware to parse JSON requests
app.use(express.json());
/* app.use(connectDB);
 */
// Call the async function to register the routes
registerRoutes()
  .then(() => {
    // Start the server and listen on localhost only (not network accessible)
    app.listen(port, "127.0.0.1", () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err: Error) => {
    console.error("Error registering routes:", err.message);
  });
