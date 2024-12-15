import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateResource = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Zod's parse method will throw if validation fails
      next(); // Validation passed, continue to the next middleware
    } catch (error) {
      const errorMessages = (error as ZodError).errors
        .map((err) => err.message)
        .join(", ");
      res.status(400).json({ message: `Validation error: ${errorMessages}` });
    }
  };
};
