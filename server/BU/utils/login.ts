import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, COOKIE_NAME } from "../constants";
import { DBRequest } from "../middleware/connectDB"; // Import the extended DBRequest interface

const router = express.Router();

// POST route for login
router.post(
  "/",
  async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).send("Email and password are required.");
    }
    console.log(`email: ${email}, password: ${password}`);

    const db = res.locals.db; // Access the SQLite database from the response locals
    if (!db) {
      return res.status(500).send("Database connection is not available.");
    }

    // Query the database for the user by email
    const query = `SELECT id, name, password FROM users WHERE email = ?`;
    try {
      const user = db.prepare(query).get(email);

      if (!user) {
        return res.status(401).send("Invalid email or password.");
      }

      console.log(`dbdata = id: ${user.id}, dbpassword: ${user.password}`);

      // Compare the provided password with the hashed password in the database
      bcrypt.compare(
        password,
        user.password,
        (err: Error | null, isMatch: boolean) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return res.status(500).send("Internal server error.");
          }

          if (!isMatch) {
            return res.status(401).send("Invalid email or password.");
          }

          // Generate a JWT with the user's ID
          const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "24h",
          });

          // Set the token as an HTTP-only cookie
          res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: true, // Ensure this is set to `true` in production (requires HTTPS)
            sameSite: "strict",
            maxAge: 30 * 24 * 3600000, // 30 days
          });

          return res.status(200).json({
            message: "Login successful",
            username: user.name,
          });
        }
      );
    } catch (err) {
      console.error("Database error:", (err as Error).message);
      return res.status(500).send("Internal server error.");
    }
  }
);

export default router;
