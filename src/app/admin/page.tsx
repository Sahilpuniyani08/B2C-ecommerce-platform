"use client";

import Link from "next/link";
import { ShoppingCart, Package, Tag, Image, Truck, ArrowRight, TrendingUp } from "lucide-react";
import { useAdminOrders } from "@/features/orders/queries";
import { useProducts } from "@/features/products/queries";
import { useCategories } from "@/features/categories/queries";
import { useBanners } from "@/features/banners/queries";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
  { href: "/admin/products", label: "Products", icon: Package, color: "bg-purple-50 text-purple-600" },
  { href: "/admin/categories", label: "Categories", icon: Tag, color: "bg-green-50 text-green-600" },
  { href: "/admin/banners", label: "Banners", icon: Image, color: "bg-orange-50 text-orange-600" },
  { href: "/admin/delivery-rules", label: "Delivery", icon: Truck, color: "bg-rose-50 text-rose-600" },
];

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  PACKED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminDashboardPage() {
  const { data: ordersData } = useAdminOrders({ page: 1, pageSize: 5 });
  const { data: productsData } = useProducts({});
  const { data: categories } = useCategories();
  const { data: banners } = useBanners();

  const recentOrders = ordersData?.data?.slice(0, 5) ?? [];
  const totalOrders = ordersData?.pagination?.total ?? 0;
  const productsCount = productsData?.total ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[#0a0a0a]">Dashboard</h1>
        <p className="text-[#8a8070] text-sm mt-1">Welcome back! Here&apos;s your store at a glance.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orders", value: totalOrders, icon: ShoppingCart, href: "/admin/orders" },
          { label: "Products", value: productsCount, icon: Package, href: "/admin/products" },
          { label: "Categories", value: categories?.length ?? 0, icon: Tag, href: "/admin/categories" },
          { label: "Banners", value: banners?.length ?? 0, icon: Image, href: "/admin/banners" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-5 border border-[#e8e3d8] hover:border-[#0a0a0a]/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#0a0a0a]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[#8a8070] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-display font-bold text-3xl text-[#0a0a0a]">{stat.value}</p>
              <p className="text-xs text-[#8a8070] mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-[#e8e3d8] p-6 mb-8">
        <h2 className="font-semibold text-[#0a0a0a] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f5f0e8] text-[#0a0a0a] text-sm font-medium hover:bg-[#e8e3d8] transition-colors"
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-[#e8e3d8]">
        <div className="flex items-center justify-between p-5 border-b border-[#e8e3d8]">
          <h2 className="font-semibold text-[#0a0a0a]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-[#8a8070] hover:text-[#0a0a0a] transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5f0e8]">
                  {["Order", "Customer", "Amount", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#8a8070] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="table-row-hover border-b border-[#f5f0e8] last:border-0">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs text-[var(--primary)] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#0a0a0a]">{order.customerName}</p>
                      <p className="text-xs text-[#8a8070]">{order.phone}</p>
                    </td>
                    <td className="px-5 py-3 font-bold text-[#0a0a0a]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[order.orderStatus] ?? "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#8a8070]">
                      {formatDateTime(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-[#8a8070] text-sm">
              No orders yet. Share your store link to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
