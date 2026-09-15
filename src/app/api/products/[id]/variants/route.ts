import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  getProductVariants,
  addVariant,
} from "@/services/product-variant.service";
import { createVariantSchema } from "@/validations/product-variant.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id]/variants — Public: list product variants
 */
export const GET = apiHandler(async (_request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const variants = await getProductVariants(id);
  return successResponse(variants);
});

/**
 * POST /api/products/[id]/variants — Admin: add variant
 */
export const POST = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const data = await parseBody(request, createVariantSchema);
  const variant = await addVariant(id, data);
  return successResponse(variant, 201);
});
