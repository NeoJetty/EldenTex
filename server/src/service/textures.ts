import { Database as TDatabase } from "better-sqlite3";

export const fetchTexturesDataByIds = async (
  db: TDatabase,
  textureIDs: number[]
): Promise<{ data?: { id: number; name: string }[]; error?: string }> => {
  try {
    const placeholders = textureIDs.map(() => "?").join(", ");
    const query = `
      SELECT id, name 
      FROM textures 
      WHERE id IN (${placeholders})
    `;

    const textureRows = db.prepare(query).all(...textureIDs) as {
      id: number;
      name: string;
    }[];

    return { data: textureRows };
  } catch (err) {
    console.error("Error fetching texture data:", err);
    return { error: "Database error" };
  }
};

export const fetchTexturesDataByName = async (
  db: TDatabase,
  textureNames: string[]
): Promise<{ data?: { id: number; name: string }[]; error?: string }> => {
  try {
    const placeholders = textureNames.map(() => "?").join(", ");
    const query = `
      SELECT id, name 
      FROM textures 
      WHERE name IN (${placeholders})
    `;

    const textureRows = db.prepare(query).all(...textureNames) as {
      id: number;
      name: string;
    }[];

    return { data: textureRows };
  } catch (err) {
    console.error("Error fetching texture data by name:", err);
    return { error: "Database error" };
  }
};
