import { NextRequest } from "next/server";
import {
  apiHandler,
  parseBody,
  parseQuery,
  successResponse,
  paginatedResponse,
} from "@/lib/api-handler";
import { requireAdmin } from "@/lib/auth";
import { createNewOrder, getOrders } from "@/services/order.service";
import { createOrderSchema, getOrdersQuerySchema } from "@/validations/order.validation";

/**
 * GET /api/orders — Admin: list orders with pagination/filters
 */
export const GET = apiHandler(async (request: NextRequest) => {
  await requireAdmin(request);
  const filters = parseQuery(request, getOrdersQuerySchema);
  const { orders, total } = await getOrders(filters);
  return paginatedResponse(orders, {
    page: filters.page,
    pageSize: filters.pageSize,
    total,
  });
});

/**
 * POST /api/orders — Public: create order (COD)
 */
export const POST = apiHandler(async (request: NextRequest) => {
  const data = await parseBody(request, createOrderSchema);
  const order = await createNewOrder(data);
  return successResponse(order, 201);
});
