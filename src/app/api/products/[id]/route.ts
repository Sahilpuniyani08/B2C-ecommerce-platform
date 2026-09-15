import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  getProductById,
  getProductBySlug,
  editProduct,
  removeProduct,
} from "@/services/product.service";
import { updateProductSchema } from "@/validations/product.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id] — Public: get product by ID or slug
 */
export const GET = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const { searchParams } = new URL(request.url);
  const bySlug = searchParams.get("by") === "slug";

  const product = bySlug ? await getProductBySlug(id) : await getProductById(id);
  return successResponse(product);
});

/**
 * PATCH /api/products/[id] — Admin: update product
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const data = await parseBody(request, updateProductSchema);
  const product = await editProduct(id, data);
  return successResponse(product);
});

/**
 * DELETE /api/products/[id] — Admin: delete product
 */
export const DELETE = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  await removeProduct(id);
  return successResponse({ deleted: true });
});
