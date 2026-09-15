import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  getBannerById,
  editBanner,
  removeBanner,
} from "@/services/banner.service";
import { updateBannerSchema } from "@/validations/banner.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/banners/[id] — Public: get banner by ID
 */
export const GET = apiHandler(async (_request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const banner = await getBannerById(id);
  return successResponse(banner);
});

/**
 * PATCH /api/banners/[id] — Admin: update banner
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const data = await parseBody(request, updateBannerSchema);
  const banner = await editBanner(id, data);
  return successResponse(banner);
});

/**
 * DELETE /api/banners/[id] — Admin: delete banner
 */
export const DELETE = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  await removeBanner(id);
  return successResponse({ deleted: true });
});
