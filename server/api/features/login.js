import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // For securely comparing passwords (install it: `npm install bcrypt`)
import { JWT_SECRET, COOKIE_NAME } from "../../constants.js";
const router = express.Router();

// POST route for login
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }
  console.log(`email: ${email}, password: ${password}`);

  const db = req.db; // Access the SQLite database from the request

  // Query the database for the user by email
  const query = `SELECT id, name, password FROM users WHERE email = ?`;
  db.get(query, [email], (err, user) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error.");
    }
    console.log(`dbdata = id: ${user.id}, dbpassword: ${user.password}`);
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }

    // Compare the provided password with the hashed password in the database
    bcrypt.compare(password, user.password, (err, isMatch) => {
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
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: true, // Ensures the cookie is sent over HTTPS only
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 30 * 24 * 3600000, // a month
      });

      res.status(200).json({
        message: "Login successful",
        username: user.name,
      });
    });
  });
});

export default router;
