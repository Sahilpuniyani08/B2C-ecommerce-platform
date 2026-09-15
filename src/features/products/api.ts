import apiClient from "@/lib/api-client";
import type {
  Product,
  ProductFilters,
  PaginatedProductsResponse,
  ProductImage,
  ProductVariant,
  CreateProductInput,
  UpdateProductInput,
  CreateProductImageInput,
  CreateVariantInput,
  UpdateVariantInput,
} from "./types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/** GET /api/products */
export async function fetchProducts(filters?: ProductFilters): Promise<PaginatedProductsResponse> {
  const params: Record<string, string> = {};
  if (filters?.categoryId) params.categoryId = filters.categoryId;
  if (filters?.categorySlug) params.categorySlug = filters.categorySlug;
  if (filters?.isActive !== undefined) params.active = String(filters.isActive);
  if (filters?.isFeatured !== undefined) params.featured = String(filters.isFeatured);
  if (filters?.search) params.search = filters.search;
  if (filters?.page) params.page = String(filters.page);
  if (filters?.limit) params.limit = String(filters.limit);

  const res = await apiClient.get<ApiResponse<PaginatedProductsResponse>>("/products", { params });
  return res.data.data;
}

/** GET /api/products/[id] — by ID */
export async function fetchProductById(id: string): Promise<Product> {
  const res = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
  return res.data.data;
}

/** GET /api/products/[slug]?by=slug — by slug */
export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`, {
    params: { by: "slug" },
  });
  return res.data.data;
}

/** POST /api/products (Admin) */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const res = await apiClient.post<ApiResponse<Product>>("/products", input);
  return res.data.data;
}

/** PATCH /api/products/[id] (Admin) */
export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const res = await apiClient.patch<ApiResponse<Product>>(`/products/${id}`, input);
  return res.data.data;
}

/** DELETE /api/products/[id] (Admin) */
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

// ─── Product Images ──────────────────────────────────────────────────

/** GET /api/products/[id]/images */
export async function fetchProductImages(productId: string): Promise<ProductImage[]> {
  const res = await apiClient.get<ApiResponse<ProductImage[]>>(`/products/${productId}/images`);
  return res.data.data;
}

/** POST /api/products/[id]/images (Admin) */
export async function addProductImage(
  productId: string,
  input: CreateProductImageInput
): Promise<ProductImage> {
  const res = await apiClient.post<ApiResponse<ProductImage>>(
    `/products/${productId}/images`,
    input
  );
  return res.data.data;
}

// ─── Product Variants ─────────────────────────────────────────────────

/** GET /api/products/[id]/variants */
export async function fetchProductVariants(productId: string): Promise<ProductVariant[]> {
  const res = await apiClient.get<ApiResponse<ProductVariant[]>>(`/products/${productId}/variants`);
  return res.data.data;
}

/** POST /api/products/[id]/variants (Admin) */
export async function addProductVariant(
  productId: string,
  input: CreateVariantInput
): Promise<ProductVariant> {
  const res = await apiClient.post<ApiResponse<ProductVariant>>(
    `/products/${productId}/variants`,
    input
  );
  return res.data.data;
}

/** PATCH /api/products/[id]/variants/[variantId] (Admin) — if route exists */
export async function updateProductVariant(
  productId: string,
  variantId: string,
  input: UpdateVariantInput
): Promise<ProductVariant> {
  const res = await apiClient.patch<ApiResponse<ProductVariant>>(
    `/products/${productId}/variants/${variantId}`,
    input
  );
  return res.data.data;
}

/** DELETE /api/products/[id]/variants/[variantId] (Admin) */
export async function deleteProductVariant(
  productId: string,
  variantId: string
): Promise<void> {
  await apiClient.delete(`/products/${productId}/variants/${variantId}`);
}
