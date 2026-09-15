import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { getDeliveryRules, addDeliveryRule } from "@/services/delivery-rule.service";
import { createDeliveryRuleSchema } from "@/validations/delivery-rule.validation";

/**
 * GET /api/delivery-rules — List delivery rules
 */
export const GET = apiHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "true";
  const rules = await getDeliveryRules(activeOnly);
  return successResponse(rules);
});

/**
 * POST /api/delivery-rules — Admin: create delivery rule
 */
export const POST = apiHandler(async (request: NextRequest) => {
  await requireAdmin(request);
  const data = await parseBody(request, createDeliveryRuleSchema);
  const rule = await addDeliveryRule(data);
  return successResponse(rule, 201);
});
