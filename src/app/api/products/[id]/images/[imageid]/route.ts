import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  editProductImage,
  removeProductImage,
} from "@/services/product-image.service";
import { updateProductImageSchema } from "@/validations/product-image.validation";

type RouteContext = { params: Promise<{ id: string; imageid: string }> };

/**
 * PATCH /api/products/[id]/images/[imageid] — Admin: update image
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { imageid } = await context!.params;
  const data = await parseBody(request, updateProductImageSchema);
  const image = await editProductImage(imageid, data);
  return successResponse(image);
});

/**
 * DELETE /api/products/[id]/images/[imageid] — Admin: delete image
 */
export const DELETE = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { imageid } = await context!.params;
  await removeProductImage(imageid);
  return successResponse({ deleted: true });
});
