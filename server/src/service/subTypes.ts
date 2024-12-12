import { Database as TDatabase } from "better-sqlite3";

// Define the expected structure of a row (adjust according to your actual table columns)
interface TextureSubtypeRow {
  id: number;
  [key: string]: number; // Any key will have a numeric value
}

export const fetchTrueSubtypesForIds = async (
  db: TDatabase,
  textureIDs: number[]
): Promise<{ data?: string[][]; error?: string }> => {
  try {
    const placeholders = textureIDs.map(() => "?").join(", ");
    const query = `
      SELECT * 
      FROM texture_subtypes 
      WHERE id IN (${placeholders})
    `;

    // Fetch the rows for all the IDs, explicitly cast to TextureSubtypeRow[]
    const rows = db.prepare(query).all(...textureIDs) as TextureSubtypeRow[];

    // Map over the rows and filter out subtypes for each row
    const trueSubtypes = rows.map((row) => {
      // Filter keys where the value is 1, skipping the 'id' key
      return Object.keys(row).filter(
        (key) => key !== "id" && row[key as keyof TextureSubtypeRow] === 1
      );
    });

    return { data: trueSubtypes };
  } catch (err) {
    console.error("Error fetching true subtypes:", (err as Error).message);
    return { error: "Database error" };
  }
};

export const fetchTrueSubtypesForId = async (
  db: TDatabase,
  id: number
): Promise<{ data?: string[]; error?: string }> => {
  try {
    const query = `
      SELECT *
      FROM texture_subtypes
      WHERE id = ?
    `;

    const row = db.prepare(query).get(id) as TextureSubtypeRow;

    if (!row) {
      return { data: [] }; // No data found for the given ID.
    }

    // Filter keys where the value is 1, skipping the 'id' key.
    const trueKeys = Object.keys(row).filter(
      (key) => key !== "id" && row[key as keyof TextureSubtypeRow] === 1
    );

    return { data: trueKeys };
  } catch (err) {
    console.error("Error fetching true subtypes:", (err as Error).message);
    return { error: "Database error" };
  }
};
