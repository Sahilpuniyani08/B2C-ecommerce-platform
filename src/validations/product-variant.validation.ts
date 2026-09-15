import { z } from "zod/v4";

export const createVariantSchema = z.object({
  size: z.string().max(50).optional(),
  color: z.string().max(50).optional(),
  sku: z.string().min(1).max(100),
  price: z.number().positive().optional().nullable(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateVariantSchema = z.object({
  size: z.string().max(50).optional().nullable(),
  color: z.string().max(50).optional().nullable(),
  sku: z.string().min(1).max(100).optional(),
  price: z.number().positive().optional().nullable(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
