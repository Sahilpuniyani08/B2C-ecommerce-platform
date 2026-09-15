import { z } from "zod/v4";

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional().nullable(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(12),
  categorySlug: z.string().optional(),
  categoryId: z.string().optional(),
  search: z.string().optional(),
  isFeatured: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});
