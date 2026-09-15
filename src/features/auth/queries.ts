import { useQuery } from "@tanstack/react-query";
import { getAdminSession } from "./api";

export const authKeys = {
  session: ["auth", "session"] as const,
};

/** Hook: get current admin session */
export function useAdminSession() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: getAdminSession,
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });
}
