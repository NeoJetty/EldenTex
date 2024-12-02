import { Database } from "better-sqlite3";
const router = express.Router();

// THIS SEEMS INCOMPLETE
// a tag is created with tag_id and user_id, but there is no name saved for it? not even passed

// Function to count entries in the database
function countInDatabase(db, table, user_id, tag_id) {
  return new Promise((resolve, reject) => {
    const sqlQueryCheck = db.prepare(`
            SELECT COUNT(*) AS count
            FROM ${table}
            WHERE user_id = ? AND tag_id = ?;
        `);

    const row = sqlQueryCheck.get(user_id, tag_id);
    if (row) {
      resolve(row.count);
    } else {
      reject("Database error during count check");
    }
  });
}

// Function to insert entries into the database
function insertToDatabase(db, table, user_id, tag_id) {
  return new Promise((resolve, reject) => {
    const sqlQuery = db.prepare(`
            INSERT INTO ${table} (user_id, tag_id)
            VALUES (?, ?);
        `);

    try {
      sqlQuery.run(user_id, tag_id);
      resolve(this.lastInsertROWID);
    } catch (err) {
      reject("Database error during insertion");
    }
  });
}

router.post("/:user_id/:tag_id", async (req, res) => {
  const { user_id, tag_id } = req.params;

  if (!user_id || !tag_id) {
    return res.status(400).json({ error: "User ID and Tag ID are required" });
  }

  const db = req.db; // Use the already injected `db` from middleware in server.js
  const table = "tags_from_users";

  try {
    // Check if the entry exists
    const count = await countInDatabase(db, table, user_id, tag_id);
    if (count > 0) {
      return res.status(400).json({ error: "Entry already exists", count });
    }

    // Insert into the database
    const lastInsertRowid = await insertToDatabase(db, table, user_id, tag_id);
    return res.json({ message: "Tag added successfully", id: lastInsertRowid });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
});

export default router;
