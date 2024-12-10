import path from "path";
import Database, { Database as TDatabase } from "better-sqlite3";
import { fileURLToPath } from "url";
import { Request, Response, NextFunction } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware function to inject the SQLite database
const connectDB = (() => {
  const dbPath = path.resolve(__dirname, "8a2f6b3c9e4f7ab.db");
  console.log(dbPath);
  let db: TDatabase;

  // Initialize the database connection
  try {
    db = new Database(dbPath, {
      /*verbose: console.log */
    });
    console.log("Connected to the SQLite database using better-sqlite3");
  } catch (err) {
    console.error("Error connecting to the database:", (err as Error).message);
    process.exit(1); // Exit if the database connection fails
  }

  // Return the middleware function
  return (req: Request, res: Response, next: NextFunction): void => {
    res.locals.db = db; // Attach the database connection to the request object
    next();
  };
})();

export default connectDB;
