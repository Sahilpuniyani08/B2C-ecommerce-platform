import { NextRequest, NextResponse } from "next/server";
import { BusinessError, ERROR_STATUS_MAP, ApiResponse } from "@/types/global";
import { z } from "zod/v4";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiHandler<TContext = any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (request: NextRequest, context: TContext) => Promise<NextResponse<any>> | NextResponse<any>
) {
  return async (request: NextRequest, context: TContext): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

function handleError(error: unknown): NextResponse {
  // Zod validation error
  if (error instanceof z.ZodError) {
    const response: ApiResponse = {
      success: false,
      error: "Validation failed",
      details: z.prettifyError(error),
    };
    return NextResponse.json(response, { status: 400 });
  }

  // Known business error
  if (error instanceof BusinessError) {
    const statusCode =
      error.statusCode ??
      ERROR_STATUS_MAP[error.code as keyof typeof ERROR_STATUS_MAP] ??
      500;

    const response: ApiResponse = {
      success: false,
      error: error.message,
      code: error.code,
    };
    return NextResponse.json(response, { status: statusCode });
  }

  // Unexpected error — log server-side, return generic message
  console.error("Unexpected API error:", error);

  const response: ApiResponse = {
    success: false,
    error: "Internal server error",
  };
  return NextResponse.json(response, { status: 500 });
}

/**
 * Parse and validate JSON body from a request using a Zod schema.
 */
export async function parseBody<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BusinessError(
      "BAD_REQUEST",
      "Invalid or missing JSON request body",
      400
    );
  }
  return schema.parse(body);
}

/**
 * Parse and validate query parameters from a request using a Zod schema.
 */
export function parseQuery<T>(
  request: NextRequest,
  schema: z.ZodType<T>
): T {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return schema.parse(params);
}

/**
 * Create a success JSON response.
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(response, { status });
}

/**
 * Create a paginated success JSON response.
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: { page: number; pageSize: number; total: number },
  status = 200
): NextResponse {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  return NextResponse.json(
    {
      success: true,
      data,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        totalPages,
      },
    },
    { status }
  );
}
