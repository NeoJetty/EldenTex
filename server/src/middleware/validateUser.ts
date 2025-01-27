import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET, COOKIE_NAME } from "../util/constants.js";

// Define the expected structure of the decoded JWT payload
interface DecodedToken {
  userID: number;
}

// Middleware to validate the JWT and inject the user_id into res.locals
function validateUser(req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.cookies[COOKIE_NAME];
    // If no token is present, set validUser_id to null and continue
    if (!token) {
      res.locals.validUserID = null;
      return next();
    }
    // Verify the token synchronously using the secret key
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    // If the token is valid, extract the userId from the decoded token
    res.locals.validUserID = decoded?.userID || null;

    next();
  } catch (error) {
    console.log("Error in validateUser middleware:", error);
    res.locals.validUserID = null;
    next();
  }
}

export default validateUser;
