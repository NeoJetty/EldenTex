import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { JWT_SECRET, COOKIE_NAME } from "../util/constants.js";

// The actual handler function for login
export async function loginControl(req: Request, res: Response): Promise<void> {
  try {
    const { email, hashedPassword } = req.body;

    // Validate input
    if (!email || !hashedPassword) {
      res.status(400).send("Email and password are required.");
      return;
    }

    const db = res.locals.db; // Access the SQLite database from the request
    if (!db) {
      res.status(500).send("Database connection is not available.");
      return;
    }

    // Query the database for the user by email
    const query = `SELECT id, name, password FROM users WHERE email = ?`;
    const user = db.prepare(query).get(email);

    if (!user) {
      res.status(401).send("Invalid email or password.");
      return;
    }

    // Verify the provided password with the hashed password in the database
    const isMatch = await argon2.verify(user.password, hashedPassword);

    if (!isMatch) {
      res.status(401).send("Invalid email or password.");
      return;
    }

    // Generate a JWT with the user's ID
    const token = jwt.sign({ userID: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    // Set the token as an HTTP-only cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true, // Ensure this is set to `true` in production (requires HTTPS)
      sameSite: "strict",
      maxAge: 30 * 24 * 3600000, // 30 days
    });

    res.status(200).json({
      message: "Login successful",
      username: user.name,
    });
  } catch (err) {
    console.error("Database error:", (err as Error).message);
    res.status(500).send("Internal server error.");
  }
}

// The actual handler function for registration
export async function registerControl(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, hashedPassword } = req.body;

    // Hash the password using argon2
    const doubleHashedPassword = await argon2.hash(hashedPassword);

    const db = res.locals.db; // Access the SQLite database from the request
    if (!db) {
      res.status(500).send("Database connection is not available.");
      return;
    }

    // Insert the new user into the database
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.prepare(query).run(email, doubleHashedPassword);

    res.status(201).json({
      message: "User registered successfully.",
      email: email,
    });
  } catch (err) {
    console.error("Error during registration:", (err as Error).message);
    res.status(500).send("Internal server error.");
  }
}
