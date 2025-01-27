import Database, { Database as TDatabase } from "better-sqlite3";
import {
  postTaggingTextures,
  getTagToTexture,
  deleteTagggingTextures,
} from "../service/textureTagging.js";

describe("Tag-Texture Controller Functions", () => {
  let db: TDatabase;

  beforeEach(() => {
    db = new Database(":memory:");
    // Create test data in the database with integer booleans
    db.exec(`
      CREATE TABLE tag_texture_associations (
        texture_id INTEGER,
        user_id INTEGER,
        tag_id INTEGER,
        vote INTEGER
      );
    `);
    db.exec(`
      INSERT INTO tag_texture_associations (texture_id, user_id, tag_id, vote)
      VALUES (1, 1, 1, 1),
             (2, 1, 2, 0),
             (3, 2, 1, 1);
    `);
  });

  afterEach(() => {
    db.close();
  });

  describe("postTagToTexture", () => {
    it("should insert a new vote when no previous vote exists", async () => {
      const result = await postTaggingTextures(db, 1, 3, 2, true);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Vote successfully recorded");
    });

    it("should update the vote if it is different from the previous vote", async () => {
      const result = await postTaggingTextures(db, 1, 1, 1, false);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Vote successfully updated");
    });

    it("should not update if the vote is the same as the previous one", async () => {
      const result = await postTaggingTextures(db, 1, 2, 1, false);
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "User has already voted identically on this tag and texture"
      );
    });

    it("should handle database errors gracefully", async () => {
      db.exec("DROP TABLE tag_texture_associations;");
      const result = await postTaggingTextures(db, 1, 1, 1, true);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Database error occurred");
    });
  });

  describe("getTagToTexture", () => {
    it("should return the correct tags and votes for a given texture and user", async () => {
      const result = await getTagToTexture(db, 1, 1);
      expect(result.data).toEqual([
        { tag_id: 1, vote: true },
        { tag_id: 2, vote: false },
      ]);
    });

    it("should return an error message if database query fails", async () => {
      db.exec("DROP TABLE tag_texture_associations;");
      const result = await getTagToTexture(db, 1, 1);
      expect(result.error).toBe("Database error occurred");
    });
  });

  describe("deleteTagToTexture", () => {
    it("should delete the specified tag for the given user, tag, and texture", async () => {
      const result = await deleteTagggingTextures(db, 1, 1, 1);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Tag successfully deleted");
    });

    it("should return an error message if no tag is found to delete", async () => {
      const result = await deleteTagggingTextures(db, 1, 3, 2);
      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "No tag found to delete for the given user, tag, and texture"
      );
    });

    it("should handle database errors gracefully", async () => {
      db.exec("DROP TABLE tag_texture_associations;");
      const result = await deleteTagggingTextures(db, 1, 1, 1);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Database error occurred");
    });
  });
});
