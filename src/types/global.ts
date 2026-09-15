/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: unknown;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Custom business error class with error code and HTTP status.
 */
export class BusinessError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "BusinessError";
  }
}

/**
 * Error code → HTTP status mapping.
 */
export const ERROR_STATUS_MAP: Record<string, number> = {
  // 400 — Bad Request
  BAD_REQUEST: 400,
  DELIVERY_NOT_AVAILABLE: 400,
  VARIANT_PRODUCT_MISMATCH: 400,
  VARIANT_REQUIRED: 400,
  INVALID_DELIVERY_DAYS: 400,
  INVALID_PAYMENT_SIGNATURE: 400,

  // 401 — Unauthorized
  UNAUTHORIZED: 401,

  // 403 — Forbidden
  FORBIDDEN: 403,

  // 404 — Not Found
  PRODUCT_NOT_FOUND: 404,
  VARIANT_NOT_FOUND: 404,
  CATEGORY_NOT_FOUND: 404,
  BANNER_NOT_FOUND: 404,
  DELIVERY_RULE_NOT_FOUND: 404,
  ORDER_NOT_FOUND: 404,
  INVALID_ORDER_DETAILS: 404,

  // 409 — Conflict
  PRODUCT_INACTIVE: 409,
  VARIANT_INACTIVE: 409,
  INSUFFICIENT_STOCK: 409,
  ORDER_CANNOT_BE_CANCELLED: 409,
  ORDER_ALREADY_DELIVERED: 409,
  ORDER_ALREADY_CANCELLED: 409,
  PAYMENT_NOT_COMPLETED: 409,
  CATEGORY_SLUG_EXISTS: 409,
  PRODUCT_SLUG_EXISTS: 409,
  SKU_EXISTS: 409,
} as const;
