import { Category } from "@/features/categories/types";

// ─── Product Image ─────────────────────────────────────────────────────
export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  storagePath: string;
}

// ─── Product Variant ───────────────────────────────────────────────────
export interface ProductVariant {
  id: string;
  productId: string;
  size?: string | null;
  color?: string | null;
  sku: string;
  price?: number | null;
  salePrice?: number | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Product ───────────────────────────────────────────────────────────
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

// ─── List Filters ──────────────────────────────────────────────────────
export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Create / Update Inputs ────────────────────────────────────────────
export interface CreateProductInput {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateProductInput {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  price?: number;
  salePrice?: number | null;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface CreateProductImageInput {
  imageUrl: string;
  sortOrder?: number;
  isPrimary?: boolean;
  storagePath: string;
}

export interface CreateVariantInput {
  size?: string;
  color?: string;
  sku: string;
  price?: number | null;
  salePrice?: number | null;
  stock?: number;
  isActive?: boolean;
}

export interface UpdateVariantInput {
  size?: string | null;
  color?: string | null;
  sku?: string;
  price?: number | null;
  salePrice?: number | null;
  stock?: number;
  isActive?: boolean;
}
