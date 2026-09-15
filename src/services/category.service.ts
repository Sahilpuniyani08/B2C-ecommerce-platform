import {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/repositories/category.repository";
import { BusinessError } from "@/types/global";
import { deleteFileFromStorage } from "@/services/storage.service";

export async function getCategories(activeOnly = false) {
  return findAllCategories(activeOnly);
}

export async function getCategoryById(id: string) {
  const category = await findCategoryById(id);
  if (!category) {
    throw new BusinessError("CATEGORY_NOT_FOUND", "Category not found");
  }
  return category;
}

export async function addCategory(data: {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
  storagePath?: string;
}) {
  // Check slug uniqueness
  const existing = await findCategoryBySlug(data.slug);
  if (existing) {
    throw new BusinessError("CATEGORY_SLUG_EXISTS", "Category slug already exists");
  }

  return createCategory(data);
}

export async function editCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string | null;
    imageUrl?: string | null;
    isActive?: boolean;
    sortOrder?: number;
    storagePath?: string | null;
  }
) {
  const category = await findCategoryById(id);
  if (!category) {
    throw new BusinessError("CATEGORY_NOT_FOUND", "Category not found");
  }

  // If slug is being changed, check uniqueness
  if (data.slug && data.slug !== category.slug) {
    const existing = await findCategoryBySlug(data.slug);
    if (existing) {
      throw new BusinessError("CATEGORY_SLUG_EXISTS", "Category slug already exists");
    }
  }

  // Delete previous image from bucket if a new image was uploaded
  if (data.imageUrl && data.imageUrl !== category.imageUrl) {
    await deleteFileFromStorage(category.imageUrl);
  }

  return updateCategory(id, data);
}

export async function removeCategory(id: string) {
  const category = await findCategoryById(id);
  if (!category) {
    throw new BusinessError("CATEGORY_NOT_FOUND", "Category not found");
  }

  if (category.imageUrl) {
    await deleteFileFromStorage(category.imageUrl);
  }

  return deleteCategory(id);
}

