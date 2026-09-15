import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  trackOrder,
  cancelOrder,
  updateAdminOrderStatus,
} from "./api";
import { orderKeys } from "./queries";
import type {
  CreateOrderInput,
  CreateRazorpayOrderInput,
  VerifyRazorpayInput,
  TrackOrderInput,
  CancelOrderInput,
  UpdateOrderStatusInput,
} from "./types";
import { getErrorMessage } from "@/lib/api-client";

/** Create COD order */
export function useCreateOrder() {
  return useMutation({
    mutationFn: (input: CreateOrderInput) => createOrder(input),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/** Create Razorpay pre-order */
export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: (input: CreateRazorpayOrderInput) => createRazorpayOrder(input),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/** Verify Razorpay payment after checkout */
export function useVerifyRazorpayPayment() {
  return useMutation({
    mutationFn: (input: VerifyRazorpayInput) => verifyRazorpayPayment(input),
    onSuccess: () => {
      toast.success("Payment verified! Your order is confirmed.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/** Track order (public) */
export function useTrackOrder() {
  return useMutation({
    mutationFn: (input: TrackOrderInput) => trackOrder(input),
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/** Cancel order (public) */
export function useCancelOrder() {
  return useMutation({
    mutationFn: (input: CancelOrderInput) => cancelOrder(input),
    onSuccess: () => {
      toast.success("Order cancelled successfully.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

/** Admin: update order status */
export function useUpdateOrderStatus(orderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateOrderStatusInput) =>
      updateAdminOrderStatus(orderId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.adminDetail(orderId) });
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Order status updated");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}
