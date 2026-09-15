import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { getCategories, addCategory } from "@/services/category.service";
import { createCategorySchema } from "@/validations/category.validation";

/**
 * GET /api/categories — Public: list categories
 */
export const GET = apiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";
  const categories = await getCategories(activeOnly);
  return successResponse(categories);
});

/**
 * POST /api/categories — Admin: create category
 */
export const POST = apiHandler(async (request: NextRequest) => {
  await requireAdmin(request);
  const data = await parseBody(request, createCategorySchema);
  const category = await addCategory(data);
  return successResponse(category, 201);
});
