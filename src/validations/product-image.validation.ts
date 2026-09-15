import { z } from "zod/v4";

export const createProductImageSchema = z.object({
  imageUrl: z.string().url(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
  storagePath: z.string().min(1),
});

export const updateProductImageSchema = z.object({
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
  storagePath: z.string().min(1).optional(),
});
