import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findImagesByProductId(productId: string) {
  return prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findImageById(id: string) {
  return prisma.productImage.findUnique({
    where: { id },
  });
}

export async function createProductImage(
  data: Prisma.ProductImageCreateInput
) {
  return prisma.productImage.create({ data });
}

export async function updateProductImage(
  id: string,
  data: Prisma.ProductImageUpdateInput
) {
  return prisma.productImage.update({
    where: { id },
    data,
  });
}

export async function deleteProductImage(id: string) {
  return prisma.productImage.delete({
    where: { id },
  });
}
