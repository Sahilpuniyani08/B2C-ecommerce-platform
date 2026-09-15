"use client";

import { useState } from "react";
import { useTrackOrder, useCancelOrder } from "@/features/orders/mutations";
import type { Order, OrderStatus } from "@/features/orders/types";
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { trackOrderBg } from "@/assets/images";

const ORDER_TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: "PENDING_PAYMENT", label: "Payment Pending" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "PACKED", label: "Packed" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED", label: "Delivered" },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING_PAYMENT: 0,
  CONFIRMED: 1,
  PACKED: 2,
  SHIPPED: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
  CANCELLED: -1,
};

function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
        <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
      </div>
    );
  }

  const currentStep = STATUS_ORDER[status];

  return (
    <div className="space-y-3">
      {ORDER_TIMELINE.map((step, idx) => {
        const isDone = idx < currentStep;
        const isActive = idx === currentStep;
        const isPending = idx > currentStep;

        return (
          <div key={step.status} className="flex items-center gap-3">
            {/* Dot */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? "timeline-dot-done" : isActive ? "timeline-dot-active" : "timeline-dot-pending"
              }`}>
              {isDone ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : isActive ? (
                <Clock className="w-4 h-4 text-white" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#8a8070]" />
              )}
            </div>

            {/* Label */}
            <p className={`text-sm ${isDone ? "text-green-700 font-medium" : isActive ? "text-[#0a0a0a] font-bold" : "text-[#8a8070]"
              }`}>
              {step.label}
              {isActive && <span className="ml-2 text-xs text-[var(--primary)] font-normal">← Current</span>}
            </p>

            {/* Connector line */}
            {idx < ORDER_TIMELINE.length - 1 && (
              <div className={`h-px flex-1 ${isDone ? "timeline-connector-done" : "timeline-connector-pending"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const trackMutation = useTrackOrder();
  const cancelMutation = useCancelOrder();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await trackMutation.mutateAsync({ orderNumber: orderNumber.trim(), phone: phone.trim() });
    setTrackedOrder(result);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    await cancelMutation.mutateAsync({
      orderNumber: orderNumber,
      phone: phone,
      cancellationReason: cancelReason,
    });
    setShowCancelModal(false);
    setCancelReason("");
    // Re-track to refresh status
    const refreshed = await trackMutation.mutateAsync({ orderNumber, phone });
    setTrackedOrder(refreshed);
  };

  const canCancel = trackedOrder &&
    ["PENDING_PAYMENT", "CONFIRMED"].includes(trackedOrder.orderStatus);



  return (
    <div className="min-h-screen bg-[#faf8f5] ">
      {/* Header */}
      <div className="relative bg-olive  md:h-60  h-40 border-b border-[#e8e3d8] ">
        <div className="absolute inset-0 bg-black/20 z-2" />
        <div className=" absolute inset-0 aspect-video h-full w-full z-1 ">
          <Image src={trackOrderBg} alt="track-order-bg" fill unoptimized className="object-cover object-[75%_30%] w-full h-full  " />
        </div>
        <div className="relative z-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-display font-bold text-xl sm:text-5xl mt-10 sm:mt-10 text-beige/80 mb-2">
            Track Order
          </h1>
          <p className="text-beige/60 text-[10px] max-w-[50%] md:max-w-auto sm:text-sm ">
            Enter your order number and mobile to check your delivery status
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search form */}
        <div className="bg-olive rounded-2xl border border-beige p-6 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Order Number (e.g. ORD-...)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              className="flex-1 px-4 py-2.5 rounded-xl!  bg-beige border  text-sm text-black focus:outline-none focus:border-olive transition-colors"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              required
              className="flex-1 px-4 py-2.5 rounded-xl!  bg-beige border  text-sm text-black focus:outline-none focus:border-olive transition-colors"
            />
            <button
              type="submit"
              disabled={trackMutation.isPending}
              className="flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl bg-coral text-white text-sm font-bold hover:bg-coral/80 transition-colors disabled:opacity-60"
            >
              {trackMutation.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Track
            </button>
          </form>
        </div>

        {/* Order results */}
        {trackedOrder && (
          <div className="space-y-6 animate-fade-up">
            {/* Order header */}
            <div className="bg-white rounded-2xl border border-[#e8e3d8] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-[#e8e3d8]">
                <div>
                  <p className="text-xs text-[#8a8070] uppercase tracking-wider mb-1">Order Number</p>
                  <p className="font-mono font-bold text-[#0a0a0a]">{trackedOrder.orderNumber}</p>
                  <p className="text-xs text-[#8a8070] mt-1">
                    Placed on {formatDateTime(trackedOrder.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-[#0a0a0a]">
                    {formatCurrency(trackedOrder.totalAmount)}
                  </p>
                  <p className="text-xs text-[#8a8070]">{trackedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Timeline */}
              <h3 className="font-semibold text-sm text-[#0a0a0a] mb-4">Delivery Status</h3>
              <OrderTimeline status={trackedOrder.orderStatus} />

              {/* Cancellation info */}
              {trackedOrder.cancellationReason && (
                <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Cancellation Reason</p>
                  <p className="text-sm text-red-600">{trackedOrder.cancellationReason}</p>
                  {trackedOrder.cancelledAt && (
                    <p className="text-xs text-red-400 mt-1">
                      Cancelled on {formatDate(trackedOrder.cancelledAt)}
                    </p>
                  )}
                </div>
              )}

              {/* Expected delivery */}
              {trackedOrder.expectedDeliveryFrom && trackedOrder.orderStatus !== "CANCELLED" && (
                <div className="mt-4 flex items-center gap-2 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-sm text-blue-700">
                    Expected delivery:{" "}
                    <strong>
                      {formatDate(trackedOrder.expectedDeliveryFrom)}
                      {trackedOrder.expectedDeliveryTo &&
                        ` – ${formatDate(trackedOrder.expectedDeliveryTo)}`}
                    </strong>
                  </p>
                </div>
              )}
            </div>

            {/* Items */}
            {trackedOrder.items?.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e8e3d8] p-6">
                <h3 className="font-semibold text-sm text-[#0a0a0a] mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </h3>
                <div className="space-y-4">
                  {trackedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm text-[#0a0a0a]">{item.productName}</p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-[#8a8070] mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="text-xs text-[#8a8070]">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm text-[#0a0a0a] shrink-0">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#e8e3d8] mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8070]">Subtotal</span>
                    <span>{formatCurrency(trackedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8070]">Delivery</span>
                    <span>{formatCurrency(trackedOrder.deliveryCharge)}</span>
                  </div>
                  {Number(trackedOrder.discount) > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(trackedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t border-[#e8e3d8] pt-2 mt-2">
                    <span>Total</span>
                    <span>{formatCurrency(trackedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel button */}
            {canCancel && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cancellation modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#0a0a0a]">
                  Cancel Order
                </h3>
              </div>
              <p className="text-sm text-[#8a8070] mb-4">
                Please tell us why you&apos;re cancelling. This helps us improve our service.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason for cancellation..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-[#e8e3d8] text-sm text-[#0a0a0a] placeholder:text-[#8a8070] focus:outline-none focus:border-red-400 transition-colors resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#e8e3d8] text-sm font-medium text-[#0a0a0a] hover:border-[#0a0a0a] transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancel}
                  disabled={!cancelReason.trim() || cancelMutation.isPending}
                  className="flex-1 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {cancelMutation.isPending && (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
