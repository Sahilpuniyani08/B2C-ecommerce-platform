import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { trackOrder } from "@/services/order.service";
import { trackOrderSchema } from "@/validations/order.validation";

/**
 * POST /api/orders/track — Public: track order by number + phone
 */
export const POST = apiHandler(async (request: NextRequest) => {
  const { orderNumber, phone } = await parseBody(request, trackOrderSchema);
  const tracking = await trackOrder(orderNumber, phone);
  return successResponse(tracking);
});
