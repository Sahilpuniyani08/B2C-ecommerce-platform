import apiClient from "@/lib/api-client";
import type {
  Order,
  OrdersQuery,
  OrdersListResponse,
  CreateOrderInput,
  CreateRazorpayOrderInput,
  RazorpayOrderResponse,
  VerifyRazorpayInput,
  TrackOrderInput,
  CancelOrderInput,
  UpdateOrderStatusInput,
} from "./types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Customer APIs (Public) ───────────────────────────────────────────

/** POST /api/orders — Create COD or Razorpay order */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await apiClient.post<ApiResponse<Order>>("/orders", input);
  return res.data.data;
}

/** POST /api/orders/razorpay — Create Razorpay order (get payment link) */
export async function createRazorpayOrder(
  input: CreateRazorpayOrderInput
): Promise<RazorpayOrderResponse> {
  const res = await apiClient.post<ApiResponse<RazorpayOrderResponse>>(
    "/orders/razorpay",
    input
  );
  return res.data.data;
}

/** POST /api/orders/razorpay/verify — Verify Razorpay payment */
export async function verifyRazorpayPayment(input: VerifyRazorpayInput): Promise<Order> {
  const res = await apiClient.post<ApiResponse<Order>>(
    "/orders/razorpay/verify",
    input
  );
  return res.data.data;
}

/** POST /api/orders/track — Track order by number + phone */
export async function trackOrder(input: TrackOrderInput): Promise<Order> {
  const res = await apiClient.post<ApiResponse<Order>>("/orders/track", input);
  return res.data.data;
}

/** POST /api/orders/cancel — Cancel order */
export async function cancelOrder(
  input: CancelOrderInput
): Promise<{ message: string }> {
  const res = await apiClient.post<ApiResponse<{ message: string }>>(
    "/orders/cancel",
    input
  );
  return res.data.data ?? { message: "Order cancelled successfully" };
}

// ─── Admin APIs (Protected) ───────────────────────────────────────────

/** GET /api/orders — Admin: list orders with filters & pagination */
export async function fetchAdminOrders(query?: OrdersQuery): Promise<OrdersListResponse> {
  const params: Record<string, string> = {};
  if (query?.page) params.page = String(query.page);
  if (query?.pageSize) params.pageSize = String(query.pageSize);
  if (query?.orderStatus) params.orderStatus = query.orderStatus;
  if (query?.paymentStatus) params.paymentStatus = query.paymentStatus;
  if (query?.search) params.search = query.search;
  if (query?.startDate) params.startDate = query.startDate;
  if (query?.endDate) params.endDate = query.endDate;

  const res = await apiClient.get<OrdersListResponse>("/orders", { params });
  return res.data;
}

/** GET /api/orders/[id] — Admin: get order detail */
export async function fetchAdminOrderById(id: string): Promise<Order> {
  const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
  return res.data.data;
}

/** PATCH /api/orders/[id] — Admin: update order status */
export async function updateAdminOrderStatus(
  id: string,
  input: UpdateOrderStatusInput
): Promise<Order> {
  const res = await apiClient.patch<ApiResponse<Order>>(`/orders/${id}`, input);
  return res.data.data;
}
