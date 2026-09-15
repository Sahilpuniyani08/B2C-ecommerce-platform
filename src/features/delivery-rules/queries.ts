import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryRules, fetchDeliveryRuleById } from "./api";

export const deliveryRuleKeys = {
  all: ["delivery-rules"] as const,
  list: (activeOnly?: boolean) => ["delivery-rules", "list", { activeOnly }] as const,
  detail: (id: string) => ["delivery-rules", "detail", id] as const,
};

export function useDeliveryRules(activeOnly = false) {
  return useQuery({
    queryKey: deliveryRuleKeys.list(activeOnly),
    queryFn: () => fetchDeliveryRules(activeOnly),
  });
}

export function useDeliveryRuleById(id: string) {
  return useQuery({
    queryKey: deliveryRuleKeys.detail(id),
    queryFn: () => fetchDeliveryRuleById(id),
    enabled: Boolean(id),
  });
}
