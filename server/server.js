import express from "express";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import routeFilter from "./api/routing/routeFilter.js";
import routeTextureTagging from "./api/routing/routeTextureTagging.js";
import routeFilteredTextures from "./api/routing/routerFilteredTextures.js";

// Use fileURLToPath to get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3030;

// Create a central SQLite database connection
const dbPath = path.resolve(__dirname, "8a2f6b3c9e4f7ab.db");
let db;

// Initialize the database
try {
  db = new Database(dbPath, {
    /*verbose: console.log */
  }); // Optionally, verbose logging for SQL queries
  console.log("Connected to the SQLite database using better-sqlite3");
} catch (err) {
  console.error("Error connecting to the database:", err.message);
  process.exit(1); // Exit the process if the database fails to connect
}

// Middleware to inject the db connection into all routes
app.use((req, res, next) => {
  req.db = db; // Attach the database connection to the request object
  next();
});

app.use(express.json());

// Async function to register routes
async function registerRoutes() {
  // ------------------------------------------------------
  // Serve modules
  // ------------------------------------------------------
  // textureData/:texture_id (GET specific texture data by texture_id, or random if texture_id is -1)
  app.use(
    "/api/textureData",
    (await import("./api/serveTextureData.js")).default
  );

  // textureDataByName/:textureName
  app.use(
    "/api/textureDataByName",
    (await import("./api/serveTextureDataByName.js")).default
  );

  // allTags
  app.use("/api/allTags", (await import("./api/serveAllTags.js")).default);
  // untaggedTexture/:user_id/:tag_id
  app.use(
    "/api/untaggedTexture",
    (await import("./api/serveRandomUntagged.js")).default
  );
  // countTaggingProgress/:user_id/:tag_id
  app.use(
    "/api/countTaggingProgress",
    (await import("./api/serveCountTaggingProgress.js")).default
  );
  // serveMapsForTexture/:texture_id
  app.use(
    "/api/serveMapsForTexture",
    (await import("./api/serveMapsForTexture.js")).default
  );
  // serveTexturesByMultipleTags/:POST-JSON{user_id,tags:[{tag_id:number, vote:bool},{...},{...}]}
  app.use(
    "/api/serveTexturesByMultipleTags",
    (await import("./api/serveTexturesByMultipleTags.js")).default
  );

  routeFilteredTextures(app);
  routeFilter(app);
  routeTextureTagging(app);

  // ------------------------------------------------------
  // DB write modules
  // ------------------------------------------------------

  // dbCreateNewTag/:user_id/:tag_id
  app.use(
    "/api/dbCreateNewTag",
    (await import("./api/dbCreateNewTag.js")).default
  );

  // dbSaveTagSearches/:POST-JSON{user_id,search_name,tags:[{tag_id:number, vote:bool},{...},{...}]}
  app.use(
    "/api/dbSaveTagSearches",
    (await import("./api/dbSaveTagSearches.js")).default
  );

  // ------------------------------------------------------
  // Utility modules
  // ------------------------------------------------------
  // login/:POST-JSON{email:string, password:string}
  app.use("/api/login", (await import("./api/features/login.js")).default);
}

// Call the async function to register the routes
registerRoutes()
  .then(() => {
    // Start the server and listen on localhost only (not network accessible)
    app.listen(port, "127.0.0.1", () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error registering routes:", err);
  });
