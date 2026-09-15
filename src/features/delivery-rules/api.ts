import apiClient from "@/lib/api-client";
import type { DeliveryRule, CreateDeliveryRuleInput, UpdateDeliveryRuleInput } from "./types";

interface ApiResponse<T> { success: boolean; data: T; }

export async function fetchDeliveryRules(activeOnly = false): Promise<DeliveryRule[]> {
  const params = activeOnly ? { active: "true" } : {};
  const res = await apiClient.get<ApiResponse<DeliveryRule[]>>("/delivery-rules", { params });
  return res.data.data;
}

export async function fetchDeliveryRuleById(id: string): Promise<DeliveryRule> {
  const res = await apiClient.get<ApiResponse<DeliveryRule>>(`/delivery-rules/${id}`);
  return res.data.data;
}

export async function createDeliveryRule(input: CreateDeliveryRuleInput): Promise<DeliveryRule> {
  const res = await apiClient.post<ApiResponse<DeliveryRule>>("/delivery-rules", input);
  return res.data.data;
}

export async function updateDeliveryRule(id: string, input: UpdateDeliveryRuleInput): Promise<DeliveryRule> {
  const res = await apiClient.patch<ApiResponse<DeliveryRule>>(`/delivery-rules/${id}`, input);
  return res.data.data;
}

export async function deleteDeliveryRule(id: string): Promise<void> {
  await apiClient.delete(`/delivery-rules/${id}`);
}
