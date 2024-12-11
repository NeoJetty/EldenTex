import Database, { Database as TDatabase } from "better-sqlite3";
import { getTextureIDsFromFilter } from "./filteredTextures.js";

describe("getTextureIDsFromFilter", () => {
  let db: TDatabase;

  beforeEach(() => {
    db = new Database(":memory:");
    // Create test data in the database
    db.exec(`
      CREATE TABLE tag_texture_associations (
        texture_id INTEGER,
        user_id INTEGER,
        tag_id INTEGER,
        vote BOOLEAN
      );
    `);
    db.exec(`
      INSERT INTO tag_texture_associations (texture_id, user_id, tag_id, vote)
      VALUES (1, 1, 1, TRUE),
             (2, 1, 2, TRUE),
             (3, 2, 1, TRUE);
    `);
  });

  afterEach(() => {
    db.close();
  });

  it("should return an array of texture IDs", () => {
    const user_id = 1;
    const tag_id = 1;
    const result = getTextureIDsFromFilter(db, user_id, tag_id);
    expect(result).toEqual([1]);
  });

  it("should return an empty array if no matches are found", () => {
    const user_id = 1;
    const tag_id = 3;
    const result = getTextureIDsFromFilter(db, user_id, tag_id);
    expect(result).toEqual([]);
  });

  it("should throw an error if an unexpected error occurs", () => {
    const user_id = 1;
    const tag_id = 1;
    db.exec("DROP TABLE tag_texture_associations;");
    expect(() => getTextureIDsFromFilter(db, user_id, tag_id)).toThrowError(
      "Unexpected error occurred while fetching texture IDs."
    );
  });
});
