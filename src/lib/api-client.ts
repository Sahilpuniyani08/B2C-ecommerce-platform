import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

/**
 * Central Axios client for all frontend API calls.
 *
 * - Automatically attaches `Authorization: Bearer <supabase_access_token>`
 *   for every request when a session exists.
 * - Strips secret keys — only the public Supabase access token is used.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30_000,
});

// ─── Request Interceptor: Attach Supabase Access Token ───────────────
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers.set("Authorization", `Bearer ${session.access_token}`);
      }
    } catch {
      // If Supabase client fails (e.g., in non-browser context), skip silently.
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Normalize Errors ───────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    // Attach a clean `message` to the error for display in components
    const serverMessage = error.response?.data?.message;
    const httpStatus = error.response?.status;

    const message =
      serverMessage ||
      (httpStatus === 401
        ? "Authentication required. Please log in."
        : httpStatus === 403
        ? "You don't have permission to perform this action."
        : httpStatus === 404
        ? "The requested resource was not found."
        : httpStatus === 409
        ? "A conflict occurred. Please check your request."
        : httpStatus === 422
        ? "Validation failed. Please check your input."
        : httpStatus && httpStatus >= 500
        ? "Server error. Please try again later."
        : "Something went wrong. Please try again.");

    // Attach the clean message back for consumers
    (error as AxiosError & { displayMessage: string }).displayMessage = message;

    return Promise.reject(error);
  }
);

export default apiClient;

/** Extract the display-friendly message from an error */
export function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "displayMessage" in error &&
    typeof (error as { displayMessage: string }).displayMessage === "string"
  ) {
    return (error as { displayMessage: string }).displayMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
