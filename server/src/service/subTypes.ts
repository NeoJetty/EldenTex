import { Database as TDatabase } from "better-sqlite3";

export const fetchTextureSubtypesData = async (
  db: TDatabase,
  textureIDs: number[]
): Promise<{ data?: TextureSubtypes[]; error?: string }> => {
  try {
    const placeholders = textureIDs.map(() => "?").join(", ");
    const query = `
      SELECT * 
      FROM texture_subtypes 
      WHERE id IN (${placeholders})
    `;

    const rows = db.prepare(query).all(...textureIDs);
    return { data: rows };
  } catch (err) {
    console.error("Error fetching texture subtypes:", err.message);
    return { error: "Database error" };
  }
};
