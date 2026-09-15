import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { getOrderDetail, updateOrderStatus } from "@/services/order.service";
import { updateOrderStatusSchema } from "@/validations/order.validation";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/orders/[id] — Admin: get order detail
 */
export const GET = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const order = await getOrderDetail(id);
  return successResponse(order);
});

/**
 * PATCH /api/orders/[id] — Admin: update order status
 */
export const PATCH = apiHandler(async (request: NextRequest, context?: RouteContext) => {
  await requireAdmin(request);
  const { id } = await context!.params;
  const { orderStatus, cancellationReason } = await parseBody(
    request,
    updateOrderStatusSchema
  );
  const order = await updateOrderStatus(id, orderStatus, cancellationReason);
  return successResponse(order);
});
