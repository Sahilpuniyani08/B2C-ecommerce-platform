import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { getBanners, addBanner } from "@/services/banner.service";
import { createBannerSchema } from "@/validations/banner.validation";

/**
 * GET /api/banners — Public: list banners
 */
export const GET = apiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";
  const banners = await getBanners(activeOnly);
  return successResponse(banners);
});

/**
 * POST /api/banners — Admin: create banner
 */
export const POST = apiHandler(async (request: NextRequest) => {
  await requireAdmin(request);
  const data = await parseBody(request, createBannerSchema);
  const banner = await addBanner(data);
  return successResponse(banner, 201);
});
