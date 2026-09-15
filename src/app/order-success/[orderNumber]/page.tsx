"use client";

import { use } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Props {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{
    total?: string;
    payment?: string;
    status?: string;
    deliveryFrom?: string;
    deliveryTo?: string;
  }>;
}

export default function OrderSuccessPage({ params, searchParams }: Props) {
  const { orderNumber } = use(params);
  const sp = use(searchParams);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          {/* Success icon */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 animate-scale-in">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0a] mb-2 animate-fade-up">
              Order Placed!
            </h1>
            <p className="text-[#8a8070] animate-fade-up">
              Thank you for shopping with {SITE_CONFIG.name}
            </p>
          </div>

          {/* Order card */}
          <div className="bg-white rounded-2xl border border-[#e8e3d8] p-6 mb-6 animate-fade-up">
            <div className="flex items-center gap-2 mb-5 pb-5 border-b border-[#e8e3d8]">
              <Package className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="font-display font-bold text-lg text-[#0a0a0a]">
                Order Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Order number */}
              <div className="flex items-start justify-between">
                <span className="text-sm text-[#8a8070]">Order Number</span>
                <span className="font-mono font-bold text-sm text-[#0a0a0a] text-right max-w-[60%] break-all">
                  {orderNumber}
                </span>
              </div>

              {/* Total */}
              {sp.total && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8a8070]">Total Amount</span>
                  <span className="font-bold text-[#0a0a0a]">
                    {formatCurrency(Number(sp.total))}
                  </span>
                </div>
              )}

              {/* Payment method */}
              {sp.payment && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8a8070]">Payment</span>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#8a8070]" />
                    <span className="text-sm font-medium text-[#0a0a0a]">
                      {sp.payment === "COD" ? "Cash on Delivery" : "Online Payment"}
                    </span>
                  </div>
                </div>
              )}

              {/* Status */}
              {sp.status && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8a8070]">Order Status</span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase">
                    {sp.status.replace(/_/g, " ")}
                  </span>
                </div>
              )}

              {/* Expected delivery */}
              {(sp.deliveryFrom || sp.deliveryTo) && (
                <div className="flex items-start justify-between">
                  <span className="text-sm text-[#8a8070]">Expected Delivery</span>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#8a8070]" />
                    <span className="text-sm font-medium text-[#0a0a0a]">
                      {sp.deliveryFrom && formatDate(sp.deliveryFrom)}
                      {sp.deliveryTo && ` – ${formatDate(sp.deliveryTo)}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-[#e8e3d8] p-5 flex gap-3">
              <MapPin className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#0a0a0a] mb-0.5">Delivery</p>
                <p className="text-xs text-[#8a8070]">
                  We&apos;ll notify you when your order is shipped
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-[#e8e3d8] p-5 flex gap-3">
              <Clock className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-[#0a0a0a] mb-0.5">Track Order</p>
                <p className="text-xs text-[#8a8070]">
                  Use your order number and phone to track anytime
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/track-order"
              className="flex-1 py-3.5 rounded-full bg-[#0a0a0a] text-white text-sm font-bold text-center hover:bg-[#333] transition-colors flex items-center justify-center gap-2 group"
            >
              Track Your Order
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="flex-1 py-3.5 rounded-full border border-[#e8e3d8] text-[#0a0a0a] text-sm font-medium text-center hover:border-[#0a0a0a] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
  );
}
