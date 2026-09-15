import {
  findAllProducts,
  findProductById,
  findProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/repositories/product.repository";
import { findCategoryById } from "@/repositories/category.repository";
import { BusinessError } from "@/types/global";
import { deleteFileFromStorage } from "@/services/storage.service";

export async function getProducts(filters?: {
  categoryId?: string;
  categorySlug?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return findAllProducts(filters);
}

export async function getProductById(id: string) {
  const product = await findProductById(id);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }
  return product;
}

export async function getProductBySlug(slug: string) {
  const product = await findProductBySlug(slug);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }
  return product;
}

export async function addProduct(data: {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  // Validate category exists
  const category = await findCategoryById(data.categoryId);
  if (!category) {
    throw new BusinessError("CATEGORY_NOT_FOUND", "Category not found");
  }

  // Check slug uniqueness
  const existing = await findProductBySlug(data.slug);
  if (existing) {
    throw new BusinessError("PRODUCT_SLUG_EXISTS", "Product slug already exists");
  }

  return createProduct({
    name: data.name,
    slug: data.slug,
    description: data.description,
    price: data.price,
    salePrice: data.salePrice,
    isFeatured: data.isFeatured,
    isActive: data.isActive,
    category: { connect: { id: data.categoryId } },
  });
}

export async function editProduct(
  id: string,
  data: {
    categoryId?: string;
    name?: string;
    slug?: string;
    description?: string | null;
    price?: number;
    salePrice?: number | null;
    isFeatured?: boolean;
    isActive?: boolean;
  }
) {
  const product = await findProductById(id);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }

  // If category is being changed, validate
  if (data.categoryId) {
    const category = await findCategoryById(data.categoryId);
    if (!category) {
      throw new BusinessError("CATEGORY_NOT_FOUND", "Category not found");
    }
  }

  // If slug is being changed, check uniqueness
  if (data.slug && data.slug !== product.slug) {
    const existing = await findProductBySlug(data.slug);
    if (existing) {
      throw new BusinessError("PRODUCT_SLUG_EXISTS", "Product slug already exists");
    }
  }

  const updateData: Record<string, unknown> = { ...data };
  if (data.categoryId) {
    delete updateData.categoryId;
    updateData.category = { connect: { id: data.categoryId } };
  }

  return updateProduct(id, updateData);
}

export async function removeProduct(id: string) {
  const product = await findProductById(id);
  if (!product) {
    throw new BusinessError("PRODUCT_NOT_FOUND", "Product not found");
  }

  // Delete all associated product images from storage
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      if (img.imageUrl) {
        await deleteFileFromStorage(img.imageUrl);
      }
    }
  }

  return deleteProduct(id);
}
