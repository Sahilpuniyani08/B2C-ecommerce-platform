import { z } from "zod/v4";

export const createBannerSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional(),
  imageUrl: z.string().url(),
  buttonText: z.string().max(100).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  storagePath: z.string().optional(),
});

export const updateBannerSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(500).optional().nullable(),
  imageUrl: z.string().url().optional(),
  buttonText: z.string().max(100).optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  storagePath: z.string().optional().nullable(),
});
