import express from "express";
const router = express.Router();

// localhost:3030/textureDataByName/:textureName
router.get("/:textureName", (req, res) => {
  const textureName = req.params.textureName; // Extract texture name from the route
  const db = req.db; // Database connection from middleware

  try {
    // Fetch texture by name
    const textureRow = db
      .prepare("SELECT * FROM textures WHERE name = ?")
      .get(textureName);

    if (!textureRow) {
      return res.status(404).send("No texture found with the given name");
    }

    const textureId = textureRow.id;
    console.log(textureId);

    // Fetch texture subtypes
    const subtypeRow = db
      .prepare("SELECT * FROM texture_subtypes WHERE id = ?")
      .get(textureId);

    if (!subtypeRow) {
      return res
        .status(404)
        .send("No subtypes found for the given texture name");
    }

    // Respond with filtered texture data
    res.send({
      textureName: textureRow.name,
      id: textureId,
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
});

export default router;
