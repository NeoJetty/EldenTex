// serverAllTags.js
import express from "express";
const router = express.Router();

// Get all tags from the database
router.get("/", (req, res) => {
  const sqlQuery = `
        SELECT id, name, category
        FROM tags;
    `;

  try {
    const rows = req.db.prepare(sqlQuery).all();
    res.json({ tags: rows });
  } catch (err) {
    console.error("Database error:", err.message);
    return res.status(500).json({ error: "Database error occurred" });
  }
});

export default router;
