import { z } from "zod/v4";

export const createDeliveryRuleSchema = z.object({
  name: z.string().min(1).max(200),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits").optional(),
  minDays: z.number().int().min(0),
  maxDays: z.number().int().min(0),
  deliveryCharge: z.number().min(0),
  isActive: z.boolean().optional(),
});

export const updateDeliveryRuleSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  state: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits").optional().nullable(),
  minDays: z.number().int().min(0).optional(),
  maxDays: z.number().int().min(0).optional(),
  deliveryCharge: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});
