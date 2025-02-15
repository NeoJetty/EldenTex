import { z } from "zod";

export const slicesQuerySchema = z
  .object({
    id: z.string().regex(/^\d+$/, "id must be a positive integer").optional(),
    name: z.string().min(1, "name cannot be empty").optional(),
    confidence: z
      .string()
      .regex(/^\d+(\.\d+)?$/, "confidence must be a valid number")
      .optional()
      .default("0"), // Default value of "0" if confidence is not provided
  })
  .refine((data) => data.id || data.name, {
    message: "Either 'id' or 'name' must be provided",
    path: ["id", "name"], // Specifies the fields for error reporting
  })
  .refine((data) => !(data.id && data.name), {
    message: "'id' and 'name' cannot both be provided at the same time",
    path: ["id", "name"], // Specifies the fields for error reporting
  });
