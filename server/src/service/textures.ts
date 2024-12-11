import { Database as TDatabase } from "better-sqlite3";

export const fetchTexturesDataByIds = async (
  db: TDatabase,
  textureIDs: number[]
): Promise<{ data?: TextureData[]; error?: string }> => {
  try {
    const placeholders = textureIDs.map(() => "?").join(", ");
    const query = `
      SELECT id, name 
      FROM textures 
      WHERE id IN (${placeholders})
    `;

    const textureRows: { id: number; name: string }[] = db
      .prepare(query)
      .all(...textureIDs);
    return { data: textureRows.map((row) => ({ id: row.id, name: row.name })) };
  } catch (err) {
    console.error("Error fetching texture data:", err.message);
    return { error: "Database error" };
  }
};
