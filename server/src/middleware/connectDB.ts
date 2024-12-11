import path from "path";
import { fileURLToPath } from "url";
import Database, { Database as TDatabase } from "better-sqlite3";
import { Request, Response, NextFunction } from "express";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory
const rootDir = path.resolve(__dirname, "../../../database"); // Adjust based on your project structure

// Middleware function to inject the SQLite database
const connectDB = (() => {
  const dbPath = path.join(rootDir, "8a2f6b3c9e4f7ab.db");
  console.log("Database path:", dbPath);
  let db: TDatabase;

  try {
    db = new Database(dbPath, {
      /*verbose: console.log */
    });
    console.log("Connected to the SQLite database using better-sqlite3");
  } catch (err) {
    console.error("Error connecting to the database:", (err as Error).message);
    process.exit(1);
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    res.locals.db = db;
    next();
  };
})();

export default connectDB;
