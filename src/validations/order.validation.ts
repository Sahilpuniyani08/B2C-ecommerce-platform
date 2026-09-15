import { z } from "zod/v4";

// ─── Order Item Schema ──────────────────────────────────

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(20),
});

// ─── Create Order Schema ────────────────────────────────

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  landmark: z.string().max(200).optional(),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  items: z.array(orderItemSchema).min(1).max(50),
});

// ─── Razorpay Order Schema ──────────────────────────────

export const createRazorpayOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  address: z.string().min(5).max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  landmark: z.string().max(200).optional(),
  items: z.array(orderItemSchema).min(1).max(50),
});

// ─── Track Order Schema ─────────────────────────────────

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(1),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
});

// ─── Cancel Order Schema ────────────────────────────────

export const cancelOrderSchema = z.object({
  orderNumber: z.string().min(1),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  cancellationReason: z.string().min(1).max(500),
});

// ─── Verify Razorpay Schema ─────────────────────────────

export const verifyRazorpaySchema = z.object({
  orderId: z.string().uuid().optional(),
  orderNumber: z.string().optional(),
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// ─── Admin: Update Order Status Schema ──────────────────

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
  cancellationReason: z.string().max(500).optional(),
});

// ─── Admin: Orders Query Schema ─────────────────────────

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  orderStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
