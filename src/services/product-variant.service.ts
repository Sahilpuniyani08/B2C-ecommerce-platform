import {
  findVariantsByProductId,
  findVariantById,
  findVariantBySku,
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/repositories/product-variant.repository";
import { findProductById } from "@/repositories/product.repository";
import { BusinessError } from "@/types/global";

export async function getProductVariants(productId: string) {
  const product = await findProductById(productId);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }

  return findVariantsByProductId(productId);
}

export async function getVariantById(variantId: string) {
  const variant = await findVariantById(variantId);
  if (!variant) {
    throw new BusinessError("VARIANT_NOT_FOUND", "Variant not found");
  }
  return variant;
}

export async function addVariant(
  productId: string,
  data: {
    size?: string;
    color?: string;
    sku: string;
    price?: number | null;
    salePrice?: number | null;
    stock?: number;
    isActive?: boolean;
  }
) {
  const product = await findProductById(productId);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }

  // Check SKU uniqueness
  const existing = await findVariantBySku(data.sku);
  if (existing) {
    throw new BusinessError("SKU_EXISTS", "SKU already exists");
  }

  return createVariant({
    size: data.size,
    color: data.color,
    sku: data.sku,
    price: data.price,
    salePrice: data.salePrice,
    stock: data.stock ?? 0,
    isActive: data.isActive ?? true,
    product: { connect: { id: productId } },
  });
}

export async function editVariant(
  variantId: string,
  data: {
    size?: string | null;
    color?: string | null;
    sku?: string;
    price?: number | null;
    salePrice?: number | null;
    stock?: number;
    isActive?: boolean;
  }
) {
  const variant = await findVariantById(variantId);
  if (!variant) {
    throw new BusinessError("VARIANT_NOT_FOUND", "Variant not found");
  }

  // If SKU is being changed, check uniqueness
  if (data.sku && data.sku !== variant.sku) {
    const existing = await findVariantBySku(data.sku);
    if (existing) {
      throw new BusinessError("SKU_EXISTS", "SKU already exists");
    }
  }

  return updateVariant(variantId, data);
}

export async function removeVariant(variantId: string) {
  const variant = await findVariantById(variantId);
  if (!variant) {
    throw new BusinessError("VARIANT_NOT_FOUND", "Variant not found");
  }

  return deleteVariant(variantId);
}
