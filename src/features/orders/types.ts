// ─── Order Enums ──────────────────────────────────────────────────────
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "COD" | "RAZORPAY";

// ─── Order Item ───────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ─── Order ────────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  expectedDeliveryFrom?: string | null;
  expectedDeliveryTo?: string | null;
  cancellationReason?: string | null;
  cancelledAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment?: {
    id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    paidAt?: string | null;
  } | null;
}

// ─── Admin Orders List ────────────────────────────────────────────────
export interface OrdersQuery {
  page?: number;
  pageSize?: number;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data: Order[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// ─── Create COD Order ─────────────────────────────────────────────────
export interface CreateOrderInput {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}

// ─── Create Razorpay Order ────────────────────────────────────────────
export type CreateRazorpayOrderInput = Omit<CreateOrderInput, "paymentMethod">;

export interface RazorpayOrderResponse {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  keyId: string;
}

// ─── Verify Razorpay ─────────────────────────────────────────────────
export interface VerifyRazorpayInput {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId?: string;
  orderNumber?: string;
}

// ─── Track Order ─────────────────────────────────────────────────────
export interface TrackOrderInput {
  orderNumber: string;
  phone: string;
}

// ─── Cancel Order ────────────────────────────────────────────────────
export interface CancelOrderInput {
  orderNumber: string;
  phone: string;
  cancellationReason: string;
}

// ─── Update Order Status (Admin) ──────────────────────────────────────
export interface UpdateOrderStatusInput {
  orderStatus: OrderStatus;
  cancellationReason?: string;
}
