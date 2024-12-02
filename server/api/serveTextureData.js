import express from "express";
const router = express.Router();

// localhost:3030/textureData/:imageId
router.get("/:imageId", (req, res) => {
  const imageId = parseInt(req.params.imageId, 10); // Convert `imageId` to an integer
  const db = req.db; // Database connection from middleware

  try {
    if (imageId === -1) {
      // Fetch a random texture ID
      const countRow = db
        .prepare("SELECT COUNT(*) AS count FROM textures")
        .get();
      const count = countRow?.count || 0;

      if (count === 0) {
        return res.status(404).send("No textures found in the database");
      }

      const randomId = Math.floor(Math.random() * count) + 1;
      return fetchImageDataById(randomId, db, res);
    } else {
      // Fetch a specific texture ID
      return fetchImageDataById(imageId, db, res);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).send("Database error");
  }
});

// Function to fetch image data by ID
function fetchImageDataById(imageId, db, res) {
  try {
    // Fetch texture data
    const textureRow = db
      .prepare("SELECT * FROM textures WHERE id = ?")
      .get(imageId);
    if (!textureRow) {
      return res.status(404).send("No texture found with the given ID");
    }

    // Fetch texture subtypes
    const subtypeRow = db
      .prepare("SELECT * FROM texture_subtypes WHERE id = ?")
      .get(imageId);
    if (!subtypeRow) {
      return res.status(404).send("No subtypes found for the given texture ID");
    }

    // Respond with filtered texture data
    res.send({
      textureName: textureRow.name,
      id: imageId,
      textureTypes: {
        _a: subtypeRow._a,
        _n: subtypeRow._n,
        _r: subtypeRow._r,
        _v: subtypeRow._v,
        _d: subtypeRow._d,
        _em: subtypeRow._em,
        _3m: subtypeRow._3m,
        _Billboards_a: subtypeRow._Billboards_a,
        _Billboards_n: subtypeRow._Billboards_n,
        _g: subtypeRow._g,
        _m: subtypeRow._m,
        _1m: subtypeRow._1m,
        _van: subtypeRow._van,
        _vat: subtypeRow._vat,
      },
    });
  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).send("Database error");
  }
}

export default router;
