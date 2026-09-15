import {
  findAllBanners,
  findBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/repositories/banner.repository";
import { BusinessError } from "@/types/global";
import { deleteFileFromStorage } from "@/services/storage.service";

export async function getBanners(activeOnly = false) {
  return findAllBanners(activeOnly);
}

export async function getBannerById(id: string) {
  const banner = await findBannerById(id);
  if (!banner) {
    throw new BusinessError("BANNER_NOT_FOUND", "Banner not found");
  }
  return banner;
}

export async function addBanner(data: {
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  categoryId?: string | null;
  productId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  storagePath?: string;
}) {
  const createData: Record<string, unknown> = {
    title: data.title,
    subtitle: data.subtitle,
    imageUrl: data.imageUrl,
    buttonText: data.buttonText,
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
    storagePath: data.storagePath,
  };

  if (data.categoryId) {
    createData.category = { connect: { id: data.categoryId } };
  }
  if (data.productId) {
    createData.product = { connect: { id: data.productId } };
  }

  return createBanner(createData as Parameters<typeof createBanner>[0]);
}

export async function editBanner(
  id: string,
  data: {
    title?: string;
    subtitle?: string | null;
    imageUrl?: string;
    buttonText?: string | null;
    categoryId?: string | null;
    productId?: string | null;
    sortOrder?: number;
    isActive?: boolean;
    storagePath?: string | null;
  }
) {
  const banner = await findBannerById(id);
  if (!banner) {
    throw new BusinessError("BANNER_NOT_FOUND", "Banner not found");
  }

  // Delete previous image from bucket if a new image was uploaded
  if (data.imageUrl && data.imageUrl !== banner.imageUrl) {
    await deleteFileFromStorage(banner.imageUrl);
  }

  const updateData: Record<string, unknown> = { ...data };

  // Handle category relation
  if (data.categoryId !== undefined) {
    delete updateData.categoryId;
    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } };
    } else {
      updateData.category = { disconnect: true };
    }
  }

  // Handle product relation
  if (data.productId !== undefined) {
    delete updateData.productId;
    if (data.productId) {
      updateData.product = { connect: { id: data.productId } };
    } else {
      updateData.product = { disconnect: true };
    }
  }

  return updateBanner(id, updateData as Parameters<typeof updateBanner>[1]);
}

export async function removeBanner(id: string) {
  const banner = await findBannerById(id);
  if (!banner) {
    throw new BusinessError("BANNER_NOT_FOUND", "Banner not found");
  }

  if (banner.imageUrl) {
    await deleteFileFromStorage(banner.imageUrl);
  }

  return deleteBanner(id);
}

