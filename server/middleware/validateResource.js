// middleware/validateResource.js
import { ZodError } from "zod";

export const validateResource = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body); // Zod's parse method will throw if validation fails
      next(); // Validation passed, continue to the next middleware
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        return res
          .status(400)
          .json({ message: `Validation error: ${errorMessages}` });
      }
      next(error); // Pass unexpected errors to the error handler
    }
  };
};
