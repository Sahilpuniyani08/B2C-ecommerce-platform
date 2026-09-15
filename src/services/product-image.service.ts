import {
  findImagesByProductId,
  findImageById,
  createProductImage,
  updateProductImage,
  deleteProductImage,
} from "@/repositories/product-image.repository";
import { findProductById } from "@/repositories/product.repository";
import { BusinessError } from "@/types/global";
import { deleteFileFromStorage } from "@/services/storage.service";

export async function getProductImages(productId: string) {
  // Validate product exists
  const product = await findProductById(productId);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }

  return findImagesByProductId(productId);
}

export async function addProductImage(
  productId: string,
  data: {
    imageUrl: string;
    sortOrder?: number;
    isPrimary?: boolean;
    storagePath: string;
  }
) {
  const product = await findProductById(productId);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }

  return createProductImage({
    imageUrl: data.imageUrl,
    sortOrder: data.sortOrder ?? 0,
    isPrimary: data.isPrimary ?? false,
    storagePath: data.storagePath,
    product: { connect: { id: productId } },
  });
}

export async function editProductImage(
  imageId: string,
  data: {
    imageUrl?: string;
    sortOrder?: number;
    isPrimary?: boolean;
    storagePath?: string;
  }
) {
  const image = await findImageById(imageId);
  if (!image) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product image not found");
  }

  // Delete previous image from bucket if a new image was uploaded
  if (data.imageUrl && data.imageUrl !== image.imageUrl) {
    await deleteFileFromStorage(image.imageUrl);
  }

  return updateProductImage(imageId, data);
}

export async function removeProductImage(imageId: string) {
  const image = await findImageById(imageId);
  if (!image) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product image not found");
  }

  if (image.imageUrl) {
    await deleteFileFromStorage(image.imageUrl);
  }

  return deleteProductImage(imageId);
}

