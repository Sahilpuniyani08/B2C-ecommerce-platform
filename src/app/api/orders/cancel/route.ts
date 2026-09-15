import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { cancelOrder } from "@/services/order.service";
import { cancelOrderSchema } from "@/validations/order.validation";

/**
 * POST /api/orders/cancel — Public: cancel order by number + phone
 */
export const POST = apiHandler(async (request: NextRequest) => {
  const { orderNumber, phone, cancellationReason } = await parseBody(
    request,
    cancelOrderSchema
  );
  const order = await cancelOrder(orderNumber, phone, cancellationReason);
  return successResponse(order);
});
