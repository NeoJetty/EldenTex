import { connectDB } from "./connectDB.debug.js";
import { fetchTrueSubtypesForIds } from "../service/subTypes.js";
import { Database as TDatabase } from "better-sqlite3";

(async () => {
  try {
    // Get database connection
    const db: TDatabase = connectDB();

    // Test with a specific ID
    const testId = 10; // Replace with the ID you want to test
    const result = await fetchTrueSubtypesForIds(db, [1, 2, 10]);

    // Log the result
    console.log("Result for ID", testId, ":", result);
  } catch (err) {
    console.error("Error during test:", (err as Error).message);
  }
})();
