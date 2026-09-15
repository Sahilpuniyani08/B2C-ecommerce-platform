import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// ─── Admin: Paginated order list ─────────────────────────

interface OrderFilters {
  page: number;
  pageSize: number;
  orderStatus?: string;
  paymentStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export async function findOrders(filters: OrderFilters) {
  const where: Prisma.OrderWhereInput = {};

  if (filters.orderStatus) {
    where.orderStatus = filters.orderStatus as Prisma.EnumOrderStatusFilter["equals"];
  }
  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus as Prisma.EnumPaymentStatusFilter["equals"];
  }
  if (filters.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: "insensitive" } },
      { customerName: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search } },
    ];
  }
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      where.createdAt.lte = new Date(filters.endDate);
    }
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
            variant: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

// ─── Admin: Order detail ─────────────────────────────────

export async function findOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
      payment: true,
      user: true,
    },
  });
}

// ─── Customer: Track order ───────────────────────────────

export async function findOrderByNumberAndPhone(
  orderNumber: string,
  phone: string
) {
  return prisma.order.findFirst({
    where: { orderNumber, phone },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
            },
          },
          variant: true,
        },
      },
    },
  });
}

// ─── Create order with items transactionally ─────────────

interface CreateOrderData {
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: "PENDING" | "PAID";
  orderStatus: "PENDING_PAYMENT" | "CONFIRMED";
  expectedDeliveryFrom: Date;
  expectedDeliveryTo: Date;
  items: {
    productId: string;
    variantId?: string;
    productName: string;
    size?: string;
    color?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  payment: {
    provider?: string;
    providerOrderId?: string;
    amount: number;
    currency: string;
    status: "PENDING" | "PAID";
    paymentMethod: "COD" | "RAZORPAY";
  };
  stockDecrements: { variantId: string; quantity: number }[];
}

export async function createOrderWithItems(data: CreateOrderData) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Decrement stock for each variant
    for (const { variantId, quantity } of data.stockDecrements) {
      const result = await tx.productVariant.updateMany({
        where: {
          id: variantId,
          stock: { gte: quantity },
        },
        data: {
          stock: { decrement: quantity },
        },
      });

      if (result.count === 0) {
        throw new Error(`INSUFFICIENT_STOCK:${variantId}`);
      }
    }

    // 2. Create order
    const order = await tx.order.create({
      data: {
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        landmark: data.landmark,
        subtotal: data.subtotal,
        deliveryCharge: data.deliveryCharge,
        discount: data.discount,
        totalAmount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        orderStatus: data.orderStatus,
        expectedDeliveryFrom: data.expectedDeliveryFrom,
        expectedDeliveryTo: data.expectedDeliveryTo,
        items: {
          create: data.items,
        },
        payment: {
          create: data.payment,
        },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    return order;
  });
}

// ─── Update order ────────────────────────────────────────

export async function updateOrder(
  id: string,
  data: Prisma.OrderUpdateInput
) {
  return prisma.order.update({
    where: { id },
    data,
    include: {
      items: true,
      payment: true,
    },
  });
}

// ─── Update order and payment transactionally ────────────

export async function updateOrderAndPayment(
  orderId: string,
  orderData: Prisma.OrderUpdateInput,
  paymentData: Prisma.PaymentUpdateInput
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: orderData,
      include: { items: true, payment: true },
    });

    if (order.payment) {
      await tx.payment.update({
        where: { id: order.payment.id },
        data: paymentData,
      });
    }

    return order;
  });
}

// ─── Cancel order with stock restore ─────────────────────

export async function cancelOrderWithStockRestore(
  orderId: string,
  cancellationReason: string,
  stockRestores: { variantId: string; quantity: number }[]
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Restore stock
    for (const { variantId, quantity } of stockRestores) {
      await tx.productVariant.update({
        where: { id: variantId },
        data: { stock: { increment: quantity } },
      });
    }

    // Update order status
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        orderStatus: "CANCELLED",
        cancellationReason,
        cancelledAt: new Date(),
      },
      include: {
        items: true,
        payment: true,
      },
    });

    return order;
  });
}

// ─── Find payment by order ID ────────────────────────────

export async function findPaymentByOrderId(orderId: string) {
  return prisma.payment.findUnique({
    where: { orderId },
  });
}
