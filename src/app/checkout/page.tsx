"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ShoppingBag, ChevronRight, CreditCard, Banknote, Lock } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useCreateOrder, useCreateRazorpayOrder, useVerifyRazorpayPayment } from "@/features/orders/mutations";
import { SITE_CONFIG } from "@/config/site";
import { toast } from "sonner";
import Link from "next/link";

// Razorpay global type
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  prefill: { name: string; contact: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface CheckoutFormData {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  paymentMethod: "COD" | "RAZORPAY";
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrder = useCreateOrder();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: { paymentMethod: "COD" },
  });

  const selectedPayment = watch("paymentMethod");

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-[#8a8070] mx-auto mb-4" />
          <p className="font-display font-bold text-2xl text-[#0a0a0a] mb-2">Your bag is empty</p>
          <p className="text-[#8a8070] mb-6">Add items before checking out.</p>
          <Link
            href="/shop"
            className="px-7 py-3 rounded-full bg-[#0a0a0a] text-white text-sm font-bold hover:bg-[#333] transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const orderItems = items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      if (data.paymentMethod === "COD") {
        // COD flow
        const order = await createOrder.mutateAsync({
          ...data,
          paymentMethod: "COD",
          items: orderItems,
        });
        clearCart();
        router.push(`/order-success/${order.orderNumber}`);
      } else {
        // Razorpay flow
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast.error("Payment gateway failed to load. Please try again.");
          return;
        }

        const rzpOrder = await createRazorpayOrder.mutateAsync({
          ...data,
          items: orderItems,
        });

        const rzp = new window.Razorpay({
          key: rzpOrder.keyId,
          amount: rzpOrder.amount * 100, // Razorpay expects paise
          currency: rzpOrder.currency,
          order_id: rzpOrder.razorpayOrderId,
          name: SITE_CONFIG.name,
          prefill: {
            name: data.customerName,
            contact: data.phone,
          },
          handler: async (response: RazorpayResponse) => {
            try {
              const verified = await verifyPayment.mutateAsync({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: rzpOrder.orderId,
                orderNumber: rzpOrder.orderNumber,
              });
              clearCart();
              router.push(`/order-success/${verified.orderNumber ?? rzpOrder.orderNumber}`);
            } catch {
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
              toast.error("Payment was cancelled.");
            },
          },
        });

        rzp.open();
        return; // Don't re-enable submit until handler fires or modal dismissed
      }
    } catch {
      // Error already shown by mutation onError
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs Header */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8a8070] mb-8 pb-4 border-b border-[#e8e4dc]">
          <Link href="/cart" className="hover:text-olive transition-colors">
            Cart
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8a8070]" />
          <span className="text-olive">Checkout</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] shadow-xs">
                <h2 className="font-display font-black text-xl text-olive mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">1</span>
                  Customer Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="customerName" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">
                      Full Name *
                    </label>
                    <input
                      id="customerName"
                      {...register("customerName", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                        maxLength: { value: 100, message: "Name is too long" },
                      })}
                      placeholder="Priya Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors"
                    />
                    {errors.customerName && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.customerName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">
                      Mobile Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter valid 10-digit Indian mobile number",
                        },
                      })}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] shadow-xs">
                <h2 className="font-display font-black text-xl text-olive mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">2</span>
                  Delivery Address
                </h2>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">
                      Street Address *
                    </label>
                    <textarea
                      id="address"
                      {...register("address", {
                        required: "Address is required",
                        minLength: { value: 5, message: "Address is too short" },
                      })}
                      rows={2}
                      placeholder="House No, Street, Area"
                      className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors resize-none"
                    />
                    {errors.address && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">City *</label>
                      <input
                        id="city"
                        {...register("city", { required: "City is required" })}
                        placeholder="Sri Ganganagar"
                        className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors"
                      />
                      {errors.city && (
                        <p className="text-red-600 text-xs mt-1 font-medium">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">State *</label>
                      <input
                        id="state"
                        {...register("state", { required: "State is required" })}
                        placeholder="Rajasthan"
                        className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors"
                      />
                      {errors.state && (
                        <p className="text-red-600 text-xs mt-1 font-medium">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="pincode" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">Pincode *</label>
                      <input
                        id="pincode"
                        {...register("pincode", {
                          required: "Pincode is required",
                          pattern: { value: /^\d{6}$/, message: "Pincode must be exactly 6 digits" },
                        })}
                        placeholder="335001"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors"
                      />
                      {errors.pincode && (
                        <p className="text-red-600 text-xs mt-1 font-medium">{errors.pincode.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="landmark" className="block text-xs font-bold uppercase tracking-wider text-olive mb-2">
                        Landmark <span className="text-[#8a8070] font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        id="landmark"
                        {...register("landmark")}
                        placeholder="Near City Mall"
                        className="w-full px-4 py-3 rounded-xl border border-[#e8e4dc] bg-[#faf8f5] text-sm text-[#0a0a0a] placeholder:text-[#a0988a] focus:outline-none focus:border-olive focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e4dc] shadow-xs">
                <h2 className="font-display font-black text-xl text-olive mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center font-bold">3</span>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {/* COD */}
                  <label
                    htmlFor="pay-cod"
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPayment === "COD"
                      ? "border-olive bg-[#faf8f5]"
                      : "border-[#e8e4dc] hover:border-olive/40"
                      }`}
                  >
                    <input
                      id="pay-cod"
                      type="radio"
                      value="COD"
                      {...register("paymentMethod")}
                      className="w-4 h-4 accent-olive cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0a0a0a]">Cash on Delivery</p>
                      <p className="text-xs text-[#8a8070]">Pay cash when order arrives at your doorstep</p>
                    </div>
                  </label>

                  {/* Razorpay */}
                  <label
                    htmlFor="pay-razorpay"
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPayment === "RAZORPAY"
                      ? "border-olive bg-[#faf8f5]"
                      : "border-[#e8e4dc] hover:border-olive/40"
                      }`}
                  >
                    <input
                      id="pay-razorpay"
                      type="radio"
                      value="RAZORPAY"
                      {...register("paymentMethod")}
                      className="w-4 h-4 accent-olive cursor-pointer"
                    />
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0a0a0a]">Online Payment (Razorpay)</p>
                      <p className="text-xs text-[#8a8070]">Instant payment via UPI, Credit/Debit Card, or Netbanking</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 border border-[#e8e4dc] shadow-sm sticky top-24">
                <h2 className="font-display font-black text-xl text-olive mb-6 pb-3 border-b border-[#e8e4dc]">
                  Order Items
                </h2>

                {/* Items preview */}
                <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-3 items-center">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#f5f0e8] shrink-0 border border-[#e8e4dc]">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.productName} fill unoptimized className="object-cover" sizes="48px" />
                        ) : (
                          <ShoppingBag className="w-5 h-5 text-[#8a8070] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0a0a0a] line-clamp-1">{item.productName}</p>
                        {(item.size || item.color) && (
                          <p className="text-[11px] text-[#8a8070]">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <p className="text-[11px] text-[#8a8070]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-[#0a0a0a] shrink-0">
                        {SITE_CONFIG.currency}{((item.salePrice ?? item.price) * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e8e4dc] pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8070]">Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-[#0a0a0a]">{SITE_CONFIG.currency}{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8070]">Delivery Charge</span>
                    <span className="text-emerald-700 font-bold text-xs uppercase">Checked at server</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-olive text-white text-xs font-bold uppercase tracking-wider hover:bg-coral transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Order...
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {selectedPayment === "COD" ? "Confirm & Place Order" : "Proceed to Pay"}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-[#8a8070] mt-4 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  100% Safe & Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
