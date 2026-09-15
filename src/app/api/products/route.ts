import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { getProducts, addProduct } from "@/services/product.service";
import { createProductSchema, getProductsQuerySchema } from "@/validations/product.validation";

/**
 * GET /api/products — Public: list products
 */
export const GET = apiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const rawParams = {
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    categorySlug: searchParams.get("categorySlug") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    search: searchParams.get("search") || undefined,
    isFeatured: searchParams.get("featured") ?? undefined,
    isActive: searchParams.get("active") ?? undefined,
  };
  const parsed = getProductsQuerySchema.parse(rawParams);
  const result = await getProducts(parsed);
  return successResponse(result);
});

/**
 * POST /api/products — Admin: create product
 */
export const POST = apiHandler(async (request: NextRequest) => {
  await requireAdmin(request);
  const data = await parseBody(request, createProductSchema);
  const product = await addProduct(data);
  return successResponse(product, 201);
});
