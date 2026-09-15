import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { createRazorpayOrder } from "@/services/order.service";
import { createRazorpayOrderSchema } from "@/validations/order.validation";

/**
 * POST /api/orders/razorpay — Public: create Razorpay order
 */
export const POST = apiHandler(async (request: NextRequest) => {
  const data = await parseBody(request, createRazorpayOrderSchema);
  const result = await createRazorpayOrder(data);

  return successResponse({
    orderId: result.order.id,
    orderNumber: result.order.orderNumber,
    amount: result.razorpay.amount,
    currency: result.razorpay.currency,
    razorpayOrderId: result.razorpay.orderId,
    keyId: result.razorpay.keyId,
  }, 201);
});
