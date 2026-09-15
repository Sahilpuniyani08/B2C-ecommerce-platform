import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  getProductImages,
  addProductImage,
} from "@/services/product-image.service";
import { createProductImageSchema } from "@/validations/product-image.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id]/images — Public: list product images
 */
export const GET = apiHandler(async (_request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const images = await getProductImages(id);
  return successResponse(images);
});

/**
 * POST /api/products/[id]/images — Admin: add product image
 */
export const POST = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const data = await parseBody(request, createProductImageSchema);
  const image = await addProductImage(id, data);
  return successResponse(image, 201);
});
