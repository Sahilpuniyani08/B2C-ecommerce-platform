import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { verifyRazorpayPayment } from "@/services/order.service";
import { verifyRazorpaySchema } from "@/validations/order.validation";

/**
 * POST /api/orders/razorpay/verify — Public: verify Razorpay payment
 */
export const POST = apiHandler(async (request: NextRequest) => {
  const data = await parseBody(request, verifyRazorpaySchema);
  const order = await verifyRazorpayPayment(data);
  return successResponse(order);
});
