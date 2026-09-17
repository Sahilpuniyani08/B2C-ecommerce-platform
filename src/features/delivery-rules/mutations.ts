import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createDeliveryRule, updateDeliveryRule, deleteDeliveryRule, checkDelivery } from "./api";
import { deliveryRuleKeys } from "./queries";
import type { CreateDeliveryRuleInput, UpdateDeliveryRuleInput } from "./types";
import { getErrorMessage } from "@/lib/api-client";

export function useCreateDeliveryRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDeliveryRuleInput) => createDeliveryRule(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: deliveryRuleKeys.all });
      toast.success(`Delivery rule "${data.name}" created`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useUpdateDeliveryRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDeliveryRuleInput }) =>
      updateDeliveryRule(id, input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: deliveryRuleKeys.all });
      toast.success(`Delivery rule "${data.name}" updated`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useDeleteDeliveryRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDeliveryRule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveryRuleKeys.all });
      toast.success("Delivery rule deleted");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/** Public: check delivery availability by pincode */
export function useCheckDelivery() {
  return useMutation({
    mutationFn: (pincode: string) => checkDelivery(pincode),
    onError: () => {
      // Don't toast — we show inline error in the checkout UI
    },
  });
}

