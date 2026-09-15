import { Prisma } from "@/generated/prisma/client";
type Decimal = Prisma.Decimal;
import { findProductById } from "@/repositories/product.repository";
import { findVariantById } from "@/repositories/product-variant.repository";
import { findDeliveryRuleByPincode } from "@/repositories/delivery-rule.repository";
import {
  createOrderWithItems,
  findOrders,
  findOrderById,
  findOrderByNumberAndPhone,
  updateOrder,
  updateOrderAndPayment,
  cancelOrderWithStockRestore,
  findPaymentByOrderId,
} from "@/repositories/order.repository";
import { razorpay, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { STORE_CONFIG } from "@/config/store";
import { BusinessError } from "@/types/global";
import crypto from "crypto";

// ─── Types ───────────────────────────────────────────────

interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface OrderInput {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  paymentMethod: "COD" | "RAZORPAY";
  items: OrderItemInput[];
}

interface ValidatedItem {
  productId: string;
  variantId: string;
  productName: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ─── Order Number Generation ─────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${STORE_CONFIG.orderNumberPrefix}-${timestamp}-${random}`;
}

// ─── Price Calculation ───────────────────────────────────

function getEffectivePrice(
  product: { price: Decimal; salePrice: Decimal | null },
  variant: { price: Decimal | null; salePrice: Decimal | null } | null
): number {
  if (variant) {
    if (variant.salePrice != null) return Number(variant.salePrice);
    if (variant.price != null) return Number(variant.price);
  }
  if (product.salePrice != null) return Number(product.salePrice);
  return Number(product.price);
}

// ─── Validate and Prepare Items ──────────────────────────

async function validateAndPrepareItems(
  items: OrderItemInput[]
): Promise<{
  validatedItems: ValidatedItem[];
  stockDecrements: { variantId: string; quantity: number }[];
}> {
  const validatedItems: ValidatedItem[] = [];
  const stockDecrements: { variantId: string; quantity: number }[] = [];

  for (const item of items) {
    // 1. Validate product
    const product = await findProductById(item.productId);
    if (!product) {
      throw new BusinessError("PRODUCT_NOT_FOUND", `Product not found: ${item.productId}`);
    }
    if (!product.isActive) {
      throw new BusinessError("PRODUCT_INACTIVE", `Product is inactive: ${product.name}`);
    }

    // 2. Check if product has variants
    const hasVariants = product.variants && product.variants.length > 0;

    if (hasVariants && !item.variantId) {
      throw new BusinessError(
        "VARIANT_REQUIRED",
        `Variant selection required for: ${product.name}`
      );
    }

    // 3. Validate variant
    let variant = null;
    if (item.variantId) {
      variant = await findVariantById(item.variantId);
      if (!variant) {
        throw new BusinessError("VARIANT_NOT_FOUND", `Variant not found: ${item.variantId}`);
      }
      if (!variant.isActive) {
        throw new BusinessError("VARIANT_INACTIVE", `Variant is inactive`);
      }
      if (variant.productId !== item.productId) {
        throw new BusinessError(
          "VARIANT_PRODUCT_MISMATCH",
          "Variant does not belong to the specified product"
        );
      }
      if (variant.stock < item.quantity) {
        throw new BusinessError(
          "INSUFFICIENT_STOCK",
          `Insufficient stock for: ${product.name}`
        );
      }

      stockDecrements.push({ variantId: variant.id, quantity: item.quantity });
    }

    // 4. Calculate price
    const unitPrice = getEffectivePrice(product, variant);
    const totalPrice = unitPrice * item.quantity;

    validatedItems.push({
      productId: product.id,
      variantId: item.variantId || variant?.id || "",
      productName: product.name,
      size: variant?.size ?? undefined,
      color: variant?.color ?? undefined,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
    });
  }

  return { validatedItems, stockDecrements };
}

// ─── Create COD Order ────────────────────────────────────

export async function createNewOrder(input: OrderInput) {
  // 1. Check delivery availability
  const deliveryRule = await findDeliveryRuleByPincode(input.pincode);
  if (!deliveryRule) {
    throw new BusinessError(
      "DELIVERY_NOT_AVAILABLE",
      "Delivery not available for this pincode"
    );
  }

  // 2. Validate items and calculate prices
  const { validatedItems, stockDecrements } = await validateAndPrepareItems(
    input.items
  );

  // 3. Calculate totals
  const subtotal = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = Number(deliveryRule.deliveryCharge);
  const discount = 0;
  const totalAmount = subtotal + deliveryCharge - discount;

  // 4. Calculate expected delivery dates
  const now = new Date();
  const expectedDeliveryFrom = new Date(now);
  expectedDeliveryFrom.setDate(now.getDate() + deliveryRule.minDays);
  const expectedDeliveryTo = new Date(now);
  expectedDeliveryTo.setDate(now.getDate() + deliveryRule.maxDays);

  // 5. Generate order number
  const orderNumber = generateOrderNumber();

  // 6. Determine statuses based on payment method
  const isCOD = input.paymentMethod === "COD";

  // 7. Create order transactionally
  const order = await createOrderWithItems({
    orderNumber,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    landmark: input.landmark,
    subtotal,
    deliveryCharge,
    discount,
    totalAmount,
    paymentMethod: input.paymentMethod,
    paymentStatus: "PENDING",
    orderStatus: isCOD ? "CONFIRMED" : "PENDING_PAYMENT",
    expectedDeliveryFrom,
    expectedDeliveryTo,
    items: validatedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId || undefined,
      productName: item.productName,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    payment: {
      provider: isCOD ? "COD" : "RAZORPAY",
      amount: totalAmount,
      currency: STORE_CONFIG.currency,
      status: "PENDING",
      paymentMethod: input.paymentMethod,
    },
    stockDecrements,
  });

  return order;
}

// ─── Create Razorpay Order ───────────────────────────────

export async function createRazorpayOrder(input: Omit<OrderInput, "paymentMethod">) {
  // 1. Check delivery availability
  const deliveryRule = await findDeliveryRuleByPincode(input.pincode);
  if (!deliveryRule) {
    throw new BusinessError(
      "DELIVERY_NOT_AVAILABLE",
      "Delivery not available for this pincode"
    );
  }

  // 2. Validate items and calculate prices
  const { validatedItems, stockDecrements } = await validateAndPrepareItems(
    input.items
  );

  // 3. Calculate totals
  const subtotal = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCharge = Number(deliveryRule.deliveryCharge);
  const discount = 0;
  const totalAmount = subtotal + deliveryCharge - discount;

  // 4. Calculate expected delivery dates
  const now = new Date();
  const expectedDeliveryFrom = new Date(now);
  expectedDeliveryFrom.setDate(now.getDate() + deliveryRule.minDays);
  const expectedDeliveryTo = new Date(now);
  expectedDeliveryTo.setDate(now.getDate() + deliveryRule.maxDays);

  // 5. Generate order number
  const orderNumber = generateOrderNumber();

  // 6. Create Razorpay order (amount in paise)
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: STORE_CONFIG.currency,
    receipt: orderNumber,
  });

  // 7. Create local order
  const order = await createOrderWithItems({
    orderNumber,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    landmark: input.landmark,
    subtotal,
    deliveryCharge,
    discount,
    totalAmount,
    paymentMethod: "RAZORPAY",
    paymentStatus: "PENDING",
    orderStatus: "PENDING_PAYMENT",
    expectedDeliveryFrom,
    expectedDeliveryTo,
    items: validatedItems.map((item) => ({
      productId: item.productId,
      variantId: item.variantId || undefined,
      productName: item.productName,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    payment: {
      provider: "RAZORPAY",
      providerOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: STORE_CONFIG.currency,
      status: "PENDING",
      paymentMethod: "RAZORPAY",
    },
    stockDecrements,
  });

  return {
    order,
    razorpay: {
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: STORE_CONFIG.currency,
      keyId: RAZORPAY_KEY_ID,
    },
  };
}

// ─── Verify Razorpay Payment ─────────────────────────────

export async function verifyRazorpayPayment(data: {
  orderId?: string;
  orderNumber?: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  // Find the order
  let order;
  if (data.orderId) {
    order = await findOrderById(data.orderId);
  }
  if (!order && data.orderNumber) {
    // Look up by order number - we need a different approach
    order = await findOrderById(data.orderId || "");
  }
  if (!order) {
    throw new BusinessError("ORDER_NOT_FOUND", "Order not found");
  }

  // Get payment record
  const payment = await findPaymentByOrderId(order.id);
  if (!payment) {
    throw new BusinessError("ORDER_NOT_FOUND", "Payment record not found");
  }

  // Use the stored providerOrderId for verification (don't trust client)
  const storedRazorpayOrderId = payment.providerOrderId;
  if (!storedRazorpayOrderId) {
    throw new BusinessError(
      "PAYMENT_NOT_COMPLETED",
      "No Razorpay order associated with this payment"
    );
  }

  // Verify signature
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET not configured");
  }

  const body = `${storedRazorpayOrderId}|${data.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== data.razorpay_signature) {
    throw new BusinessError(
      "INVALID_PAYMENT_SIGNATURE",
      "Payment verification failed"
    );
  }

  // Update order and payment
  await updateOrderAndPayment(
    order.id,
    {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
    },
    {
      status: "PAID",
      providerPaymentId: data.razorpay_payment_id,
      providerOrderId: data.razorpay_order_id,
      providerSignature: data.razorpay_signature,
      paidAt: new Date(),
    }
  );

  const updatedOrder = await findOrderById(order.id);
  return updatedOrder;
}

// ─── Track Order ─────────────────────────────────────────

export async function trackOrder(orderNumber: string, phone: string) {
  const order = await findOrderByNumberAndPhone(orderNumber, phone);
  if (!order) {
    throw new BusinessError(
      "INVALID_ORDER_DETAILS",
      "No order found with these details"
    );
  }

  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    city: order.city,
    state: order.state,
    pincode: order.pincode,
    subtotal: order.subtotal,
    deliveryCharge: order.deliveryCharge,
    discount: order.discount,
    totalAmount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    expectedDeliveryFrom: order.expectedDeliveryFrom,
    expectedDeliveryTo: order.expectedDeliveryTo,
    cancellationReason: order.cancellationReason,
    cancelledAt: order.cancelledAt,
    deliveredAt: order.deliveredAt,
    createdAt: order.createdAt,
    items: order.items,
  };
}

// ─── Cancel Order ────────────────────────────────────────

const CANCELLABLE_STATUSES = ["PENDING_PAYMENT", "CONFIRMED"];

export async function cancelOrder(
  orderNumber: string,
  phone: string,
  cancellationReason: string
) {
  const order = await findOrderByNumberAndPhone(orderNumber, phone);
  if (!order) {
    throw new BusinessError(
      "INVALID_ORDER_DETAILS",
      "No order found with these details"
    );
  }

  if (!CANCELLABLE_STATUSES.includes(order.orderStatus)) {
    throw new BusinessError(
      "ORDER_CANNOT_BE_CANCELLED",
      `Order cannot be cancelled in ${order.orderStatus} status`
    );
  }

  // Prepare stock restores for items with variants
  const stockRestores = order.items
    .filter((item: { variantId: string | null }) => item.variantId)
    .map((item: { variantId: string | null; quantity: number }) => ({
      variantId: item.variantId!,
      quantity: item.quantity,
    }));

  return cancelOrderWithStockRestore(order.id, cancellationReason, stockRestores);
}

// ─── Admin: Get Orders ───────────────────────────────────

export async function getOrders(filters: {
  page: number;
  pageSize: number;
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) {
  return findOrders(filters);
}

// ─── Admin: Get Order Detail ─────────────────────────────

export async function getOrderDetail(id: string) {
  const order = await findOrderById(id);
  if (!order) {
    throw new BusinessError("ORDER_NOT_FOUND", "Order not found");
  }
  return order;
}

// ─── Admin: Update Order Status ──────────────────────────

export async function updateOrderStatus(
  id: string,
  orderStatus: string,
  cancellationReason?: string
) {
  const order = await findOrderById(id);
  if (!order) {
    throw new BusinessError("ORDER_NOT_FOUND", "Order not found");
  }

  // Business rules
  if (order.orderStatus === "DELIVERED") {
    throw new BusinessError(
      "ORDER_ALREADY_DELIVERED",
      "Cannot change status of a delivered order"
    );
  }

  if (order.orderStatus === "CANCELLED") {
    throw new BusinessError(
      "ORDER_ALREADY_CANCELLED",
      "Cannot change status of a cancelled order"
    );
  }

  // For non-COD orders, require payment before processing
  if (
    order.paymentMethod === "RAZORPAY" &&
    order.paymentStatus !== "PAID" &&
    orderStatus !== "CANCELLED" &&
    orderStatus !== "PENDING_PAYMENT"
  ) {
    throw new BusinessError(
      "PAYMENT_NOT_COMPLETED",
      "Payment must be completed before processing"
    );
  }

  const updateData: Record<string, unknown> = { orderStatus };

  if (orderStatus === "DELIVERED") {
    updateData.deliveredAt = new Date();
  }

  if (orderStatus === "CANCELLED") {
    updateData.cancellationReason = cancellationReason;
    updateData.cancelledAt = new Date();

    // Restore stock
    const stockRestores = order.items
      .filter((item: { variantId: string | null }) => item.variantId)
      .map((item: { variantId: string | null; quantity: number }) => ({
        variantId: item.variantId!,
        quantity: item.quantity,
      }));

    if (stockRestores.length > 0) {
      return cancelOrderWithStockRestore(
        order.id,
        cancellationReason || "Cancelled by admin",
        stockRestores
      );
    }
  }

  return updateOrder(id, updateData);
}
