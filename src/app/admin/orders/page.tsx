"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useAdminOrders } from "@/features/orders/queries";
import { EmptyState } from "@/components/common/EmptyState";
import { OrderRowSkeleton } from "@/components/common/Skeleton";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/features/orders/types";

const ORDER_STATUSES: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PACKED", label: "Packed" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const PAYMENT_STATUSES: { value: PaymentStatus | ""; label: string }[] = [
  { value: "", label: "All Payments" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
];

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PACKED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useAdminOrders({
    page,
    pageSize: 15,
    orderStatus: orderStatus || undefined,
    paymentStatus: paymentStatus || undefined,
    search: search || undefined,
  });

  const orders = data?.data ?? [];
  const pagination = data?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0a0a0a]">Orders</h1>
          {pagination && (
            <p className="text-sm text-[#8a8070] mt-0.5">{pagination.total} total orders</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e8e3d8] p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8070]" />
              <input
                type="text"
                placeholder="Search by order number, name, or phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#e8e3d8] text-sm text-[#0a0a0a] placeholder:text-[#8a8070] focus:outline-none focus:border-[#0a0a0a] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#0a0a0a] text-white text-sm font-medium hover:bg-[#333] transition-colors"
            >
              Search
            </button>
          </form>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8a8070] shrink-0" />
            <select
              value={orderStatus}
              onChange={(e) => {
                setOrderStatus(e.target.value as OrderStatus | "");
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-[#e8e3d8] text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors bg-white"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value as PaymentStatus | "");
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-[#e8e3d8] text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors bg-white"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8e3d8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f5f0e8] bg-[#faf8f5]">
                {["Order #", "Customer", "Amount", "Payment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#8a8070] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => <OrderRowSkeleton key={i} />)
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="table-row-hover border-b border-[#f5f0e8] last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[var(--primary)] font-bold">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0a0a0a] whitespace-nowrap">{order.customerName}</p>
                      <p className="text-xs text-[#8a8070]">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0a0a0a] whitespace-nowrap">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                        <p className="text-xs text-[#8a8070]">{order.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_COLOR[order.orderStatus]}`}>
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8a8070] whitespace-nowrap">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="flex items-center gap-1 text-xs text-[#8a8070] hover:text-[#0a0a0a] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon="inbox" title="No orders found" description="Try adjusting your filters." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#e8e3d8]">
            <p className="text-xs text-[#8a8070]">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPreviousPage}
                className="w-8 h-8 rounded-lg border border-[#e8e3d8] flex items-center justify-center hover:border-[#0a0a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage}
                className="w-8 h-8 rounded-lg border border-[#e8e3d8] flex items-center justify-center hover:border-[#0a0a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
