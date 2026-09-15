import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import {
  getDeliveryRuleById,
  editDeliveryRule,
  removeDeliveryRule,
} from "@/services/delivery-rule.service";
import { updateDeliveryRuleSchema } from "@/validations/delivery-rule.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/delivery-rules/[id] — Get delivery rule by ID
 */
export const GET = apiHandler(async (_request: NextRequest, context?: RouteContext) => {
  const { id } = await context!.params;
  const rule = await getDeliveryRuleById(id);
  return successResponse(rule);
});

/**
 * PATCH /api/delivery-rules/[id] — Admin: update delivery rule
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const data = await parseBody(request, updateDeliveryRuleSchema);
  const rule = await editDeliveryRule(id, data);
  return successResponse(rule);
});

/**
 * DELETE /api/delivery-rules/[id] — Admin: delete delivery rule
 */
export const DELETE = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  await removeDeliveryRule(id);
  return successResponse({ deleted: true });
});
