import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  editVariant,
  removeVariant,
} from "@/services/product-variant.service";
import { updateVariantSchema } from "@/validations/product-variant.validation";

type RouteContext = { params: Promise<{ id: string; variantid: string }> };

/**
 * PATCH /api/products/[id]/variants/[variantid] — Admin: update variant
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { variantid } = await context!.params;
  const data = await parseBody(request, updateVariantSchema);
  const variant = await editVariant(variantid, data);
  return successResponse(variant);
});

/**
 * DELETE /api/products/[id]/variants/[variantid] — Admin: delete variant
 */
export const DELETE = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { variantid } = await context!.params;
  await removeVariant(variantid);
  return successResponse({ deleted: true });
});
