import { useQuery } from "@tanstack/react-query";
import { fetchAdminOrders, fetchAdminOrderById } from "./api";
import type { OrdersQuery } from "./types";

export const orderKeys = {
  all: ["orders"] as const,
  adminList: (query?: OrdersQuery) => ["orders", "admin-list", query] as const,
  adminDetail: (id: string) => ["orders", "admin-detail", id] as const,
};

/** Hook: admin orders list with filters */
export function useAdminOrders(query?: OrdersQuery) {
  return useQuery({
    queryKey: orderKeys.adminList(query),
    queryFn: () => fetchAdminOrders(query),
  });
}

/** Hook: admin order detail */
export function useAdminOrderById(id: string) {
  return useQuery({
    queryKey: orderKeys.adminDetail(id),
    queryFn: () => fetchAdminOrderById(id),
    enabled: Boolean(id),
  });
}
