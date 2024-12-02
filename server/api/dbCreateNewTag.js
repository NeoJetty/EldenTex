import express from "express";

const router = express.Router();

// Helper function: Whitelist table names to prevent SQL injection
function validateTableName(table) {
  const allowedTables = ["tags_from_users"];
  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table name");
  }
  return table;
}

// Function to count entries in the database
function countInDatabase(db, table, user_id, tag_id) {
  return new Promise((resolve, reject) => {
    try {
      validateTableName(table);

      const sqlQueryCheck = db.prepare(`
        SELECT COUNT(*) AS count
        FROM ${table}
        WHERE user_id = ? AND tag_id = ?;
      `);

      const row = sqlQueryCheck.get(user_id, tag_id);
      resolve(row?.count || 0);
    } catch (error) {
      reject(`Error during count check: ${error.message}`);
    }
  });
}

// Function to insert entries into the database
function insertToDatabase(db, table, user_id, tag_id) {
  return new Promise((resolve, reject) => {
    try {
      validateTableName(table);

      const sqlQuery = db.prepare(`
        INSERT INTO ${table} (user_id, tag_id)
        VALUES (?, ?);
      `);

      const info = sqlQuery.run(user_id, tag_id);
      resolve(info.lastInsertRowid);
    } catch (error) {
      reject(`Error during insertion: ${error.message}`);
    }
  });
}

// Route to handle adding a tag
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
    return res.json({
      message: "Tag added successfully",
      id: lastInsertRowid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
