import path from "path";
import { fileURLToPath } from "url";
import Database, { Database as TDatabase } from "better-sqlite3";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory
const rootDir = path.resolve(__dirname, "../../../database"); // Adjust based on your project structure

export const connectDB = (): TDatabase => {
  const dbPath = path.join(rootDir, "8a2f6b3c9e4f7ab.db");
  // console.log("Database path:", dbPath);

  try {
    const db = new Database(dbPath, {
      /*verbose: console.log */
    });
    console.log("-- Connected to DB --");
    return db;
  } catch (err) {
    console.error("Error connecting to the database:", (err as Error).message);
    throw new Error("Failed to connect to the database.");
  }
};
