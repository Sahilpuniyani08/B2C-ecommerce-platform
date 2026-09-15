import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function findAllBanners(activeOnly = false) {
  return prisma.banner.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    include: {
      category: true,
      product: true,
    },
    orderBy: { sortOrder: "asc" },
  });
}

export async function findBannerById(id: string) {
  return prisma.banner.findUnique({
    where: { id },
    include: {
      category: true,
      product: true,
    },
  });
}

export async function createBanner(data: Prisma.BannerCreateInput) {
  return prisma.banner.create({
    data,
    include: {
      category: true,
      product: true,
    },
  });
}

export async function updateBanner(
  id: string,
  data: Prisma.BannerUpdateInput
) {
  return prisma.banner.update({
    where: { id },
    data,
    include: {
      category: true,
      product: true,
    },
  });
}

export async function deleteBanner(id: string) {
  return prisma.banner.delete({
    where: { id },
  });
}
