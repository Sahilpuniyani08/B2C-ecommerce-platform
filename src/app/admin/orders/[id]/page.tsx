"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Package, MapPin, CreditCard, AlertTriangle } from "lucide-react";
import { useAdminOrderById } from "@/features/orders/queries";
import { useUpdateOrderStatus } from "@/features/orders/mutations";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/common/Skeleton";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/features/orders/types";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PACKED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PACKED", label: "Packed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminOrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: order, isLoading, isError } = useAdminOrderById(id);
  const updateStatus = useUpdateOrderStatus(id);

  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [cancelReason, setCancelReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    await updateStatus.mutateAsync({
      orderStatus: newStatus,
      cancellationReason: newStatus === "CANCELLED" ? cancelReason : undefined,
    });
    setShowConfirm(false);
    setNewStatus("");
    setCancelReason("");
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-8">
        <EmptyState icon="error" title="Order not found" description="This order may not exist." />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="w-8 h-8 rounded-xl border border-[#e8e3d8] flex items-center justify-center hover:border-[#0a0a0a] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display font-bold text-xl text-[#0a0a0a]">
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-[#8a8070]">{formatDateTime(order.createdAt)}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLOR[order.orderStatus]}`}>
          {order.orderStatus.replace(/_/g, " ")}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Order info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-[#e8e3d8] p-5">
            <h2 className="font-semibold text-sm text-[#0a0a0a] mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8a8070]" />
              Customer & Delivery
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#8a8070] mb-0.5">Name</p>
                <p className="font-medium text-[#0a0a0a]">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-[#8a8070] mb-0.5">Phone</p>
                <p className="font-medium text-[#0a0a0a]">{order.phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-[#8a8070] mb-0.5">Address</p>
                <p className="text-[#0a0a0a]">
                  {order.address}, {order.city}, {order.state} - {order.pincode}
                  {order.landmark && ` (Near: ${order.landmark})`}
                </p>
              </div>
              {order.expectedDeliveryFrom && (
                <div>
                  <p className="text-xs text-[#8a8070] mb-0.5">Expected Delivery</p>
                  <p className="font-medium text-[#0a0a0a]">
                    {formatDate(order.expectedDeliveryFrom)}
                    {order.expectedDeliveryTo && ` – ${formatDate(order.expectedDeliveryTo)}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-2xl border border-[#e8e3d8] p-5">
            <h2 className="font-semibold text-sm text-[#0a0a0a] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8a8070]" />
              Order Items ({order.items?.length})
            </h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 py-2 border-b border-[#f5f0e8] last:border-0">
                  <div>
                    <p className="font-medium text-sm text-[#0a0a0a]">{item.productName}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[#8a8070] mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs text-[#8a8070]">
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-[#0a0a0a] shrink-0">
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-[#e8e3d8] mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8a8070]">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a8070]">Delivery</span>
                <span>{formatCurrency(order.deliveryCharge)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[#e8e3d8]">
                <span>Total</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl border border-[#e8e3d8] p-5">
            <h2 className="font-semibold text-sm text-[#0a0a0a] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8a8070]" />
              Payment
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#8a8070] mb-0.5">Method</p>
                <p className="font-medium text-[#0a0a0a]">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-xs text-[#8a8070] mb-0.5">Status</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" :
                  order.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.payment?.paidAt && (
                <div>
                  <p className="text-xs text-[#8a8070] mb-0.5">Paid At</p>
                  <p className="font-medium text-[#0a0a0a]">{formatDateTime(order.payment.paidAt)}</p>
                </div>
              )}
            </div>

            {/* Cancellation info */}
            {order.cancellationReason && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs font-semibold text-red-700 mb-0.5">Cancellation Reason</p>
                <p className="text-sm text-red-600">{order.cancellationReason}</p>
                {order.cancelledAt && (
                  <p className="text-xs text-red-400 mt-1">
                    Cancelled: {formatDateTime(order.cancelledAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Status update */}
        <div>
          <div className="bg-white rounded-2xl border border-[#e8e3d8] p-5 sticky top-4">
            <h2 className="font-semibold text-sm text-[#0a0a0a] mb-4">Update Status</h2>

            <div className="space-y-3 mb-4">
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newStatus === opt.value
                      ? "border-[#0a0a0a] bg-[#f5f0e8]"
                      : "border-[#e8e3d8] hover:border-[#0a0a0a]/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="orderStatus"
                    value={opt.value}
                    checked={newStatus === opt.value}
                    onChange={() => setNewStatus(opt.value)}
                    className="w-4 h-4 accent-[#0a0a0a]"
                    disabled={order.orderStatus === opt.value}
                  />
                  <span className={`text-sm font-medium ${
                    order.orderStatus === opt.value ? "text-[#8a8070]" : "text-[#0a0a0a]"
                  }`}>
                    {opt.label}
                    {order.orderStatus === opt.value && (
                      <span className="ml-2 text-xs text-[#8a8070]">(Current)</span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            {newStatus === "CANCELLED" && (
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Cancellation reason (required)"
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-red-200 text-sm text-[#0a0a0a] placeholder:text-[#8a8070] focus:outline-none focus:border-red-400 transition-colors resize-none mb-3"
              />
            )}

            <button
              onClick={() => setShowConfirm(true)}
              disabled={!newStatus || updateStatus.isPending || (newStatus === "CANCELLED" && !cancelReason.trim())}
              className="w-full py-2.5 rounded-xl bg-[#0a0a0a] text-white text-sm font-bold hover:bg-[#333] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updateStatus.isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Update Status
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#0a0a0a]">
                Confirm Status Update
              </h3>
            </div>
            <p className="text-sm text-[#8a8070] mb-6">
              Are you sure you want to change order status to{" "}
              <strong className="text-[#0a0a0a]">{newStatus?.replace(/_/g, " ")}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#e8e3d8] text-sm font-medium text-[#0a0a0a] hover:border-[#0a0a0a]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updateStatus.isPending}
                className="flex-1 py-2.5 rounded-xl bg-[#0a0a0a] text-white text-sm font-bold hover:bg-[#333] flex items-center justify-center gap-2"
              >
                {updateStatus.isPending && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
