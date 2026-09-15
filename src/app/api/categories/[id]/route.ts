import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  getCategoryById,
  editCategory,
  removeCategory,
} from "@/services/category.service";
import { updateCategorySchema } from "@/validations/category.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/categories/[id] — Public: get category by ID
 */
export const GET = apiHandler(async (_request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const category = await getCategoryById(id);
  return successResponse(category);
});

/**
 * PATCH /api/categories/[id] — Admin: update category
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const data = await parseBody(request, updateCategorySchema);
  const category = await editCategory(id, data);
  return successResponse(category);
});

/**
 * DELETE /api/categories/[id] — Admin: delete category
 */
export const DELETE = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  await removeCategory(id);
  return successResponse({ deleted: true });
});
