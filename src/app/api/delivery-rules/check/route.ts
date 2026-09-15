import { NextRequest } from "next/server";
import { apiHandler, parseBody, successResponse } from "@/lib/api-handler";
import { checkDeliveryAvailability } from "@/services/delivery-rule.service";
import { z } from "zod/v4";

const checkDeliverySchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
});

/**
 * POST /api/delivery-rules/check — Public: check delivery availability
 */
export const POST = apiHandler(async (request: NextRequest) => {
  const { pincode } = await parseBody(request, checkDeliverySchema);
  const rule = await checkDeliveryAvailability(pincode);
  return successResponse({
    available: true,
    deliveryCharge: rule.deliveryCharge,
    minDays: rule.minDays,
    maxDays: rule.maxDays,
  });
});
