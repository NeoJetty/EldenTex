import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateResource = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
