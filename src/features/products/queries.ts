import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchProductBySlug,
  fetchProductImages,
  fetchProductVariants,
} from "./api";
import type { ProductFilters } from "./types";

export const productKeys = {
  all: ["products"] as const,
  list: (filters?: ProductFilters) => ["products", "list", filters] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  slug: (slug: string) => ["products", "slug", slug] as const,
  images: (productId: string) => ["products", productId, "images"] as const,
  variants: (productId: string) => ["products", productId, "variants"] as const,
};

/** Hook: list products with optional filters */
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}

/** Hook: get product by ID */
export function useProductById(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });
}

/** Hook: get product by slug */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

/** Hook: get product images */
export function useProductImages(productId: string) {
  return useQuery({
    queryKey: productKeys.images(productId),
    queryFn: () => fetchProductImages(productId),
    enabled: Boolean(productId),
  });
}

/** Hook: get product variants */
export function useProductVariants(productId: string) {
  return useQuery({
    queryKey: productKeys.variants(productId),
    queryFn: () => fetchProductVariants(productId),
    enabled: Boolean(productId),
  });
}
