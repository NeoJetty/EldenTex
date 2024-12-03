// Route handler to fetch the default filters (saved searches) from the database
export const defaultFiltersHandler = (req, res) => {
  try {
    const sqlQuery = `
        SELECT search_name, tag_filters
        FROM saved_tag_searches
      `;

    // db is already attached to the request via middleware
    const rows = req.db.prepare(sqlQuery).all();

    // Respond with the fetched default filters
    res.json({ savedSearches: rows });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: "Database error occurred" });
  }
};
