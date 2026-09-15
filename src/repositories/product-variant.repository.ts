import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findVariantsByProductId(productId: string) {
  return prisma.productVariant.findMany({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });
}

export async function findVariantById(id: string) {
  return prisma.productVariant.findUnique({
    where: { id },
  });
}

export async function findVariantBySku(sku: string) {
  return prisma.productVariant.findUnique({
    where: { sku },
  });
}

export async function createVariant(data: Prisma.ProductVariantCreateInput) {
  return prisma.productVariant.create({ data });
}

export async function updateVariant(
  id: string,
  data: Prisma.ProductVariantUpdateInput
) {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
}

export async function deleteVariant(id: string) {
  return prisma.productVariant.delete({
    where: { id },
  });
}

/**
 * Safely decrement stock within a transaction.
 * Returns the updated variant or null if insufficient stock.
 */
export async function decrementStock(
  tx: Prisma.TransactionClient,
  variantId: string,
  quantity: number
) {
  // Use updateMany with a conditional stock check to prevent negative stock
  const result = await tx.productVariant.updateMany({
    where: {
      id: variantId,
      stock: { gte: quantity },
    },
    data: {
      stock: { decrement: quantity },
    },
  });

  return result.count > 0;
}

/**
 * Restore stock for a variant within a transaction.
 */
export async function restoreStock(
  tx: Prisma.TransactionClient,
  variantId: string,
  quantity: number
) {
  await tx.productVariant.update({
    where: { id: variantId },
    data: {
      stock: { increment: quantity },
    },
  });
}
