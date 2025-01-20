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

// Validate request params
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        res
          .status(400)
          .json({ message: `Params validation error: ${errorMessages}` });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
};

// Validate request query
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        res
          .status(400)
          .json({ message: `Query validation error: ${errorMessages}` });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
};

// Validate request body
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        res
          .status(400)
          .json({ message: `Body validation error: ${errorMessages}` });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  };
};
