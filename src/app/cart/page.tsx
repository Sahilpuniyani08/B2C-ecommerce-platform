"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { useCart } from "@/context/cart-context";
import { SITE_CONFIG } from "@/config/site";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-[#faf8f5] py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#e8e4dc]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coral block mb-1">
              Shopping Cart
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-olive tracking-tight">
              Your <span className="text-coral">Bag</span>
            </h1>
          </div>
          {totalItems > 0 && (
            <span className="text-sm font-bold text-[#8a8070] bg-[#f5f0e8] px-3 py-1 rounded-full border border-[#e8e4dc]">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#e8e4dc] text-center shadow-xs">
            <EmptyState
              icon="bag"
              title="Your bag is empty"
              description="Add some gorgeous pieces from our collection to get started."
              action={
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-olive text-white text-xs font-bold uppercase tracking-wider hover:bg-coral transition-colors duration-200 shadow-md"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const price = item.salePrice ?? item.price;
                return (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="bg-white rounded-2xl p-4 sm:p-5 flex gap-4 border border-[#e8e4dc] hover:border-olive/30 hover:shadow-md transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0 border border-[#e8e4dc]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-[#8a8070]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-editorial font-semibold text-base sm:text-lg text-[#0a0a0a] hover:text-olive transition-colors line-clamp-2"
                        >
                          {item.productName}
                        </Link>

                        {/* Variant badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.size && (
                            <span className="text-[11px] font-bold bg-[#f5f0e8] text-olive px-2.5 py-0.5 rounded-full border border-[#e8e4dc]">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-[11px] font-bold bg-[#f5f0e8] text-olive px-2.5 py-0.5 rounded-full border border-[#e8e4dc]">
                              {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#f5f0e8]">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 border border-olive/30 rounded-full px-1 py-0.5 bg-[#faf8f5]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-olive hover:text-white rounded-full transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#0a0a0a]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= 20}
                            className="w-7 h-7 flex items-center justify-center hover:bg-olive hover:text-white rounded-full transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price + Delete */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-base text-[#0a0a0a]">
                              {SITE_CONFIG.currency}{(price * item.quantity).toLocaleString("en-IN")}
                            </p>
                            {item.salePrice && (
                              <p className="text-xs text-[#8a8070] line-through">
                                {SITE_CONFIG.currency}{(item.price * item.quantity).toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="w-8 h-8 rounded-full hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors text-[#8a8070] cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  Clear Bag
                </button>
                <Link
                  href="/shop"
                  className="text-xs font-bold uppercase tracking-wider text-olive hover:underline"
                >
                  + Add More Items
                </Link>
              </div>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-4 border border-[#e8e4dc] shadow-sm sticky top-24">
                <h2 className="font-display font-black text-xl text-olive mb-6 pb-3 border-b border-[#e8e4dc]">
                  Order Summary
                </h2>

                <div className="space-y-3.5 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8a8070]">Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-[#0a0a0a]">
                      {SITE_CONFIG.currency}{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm ">
                    <span className="text-[#8a8070] text-xs">Estimated Shipping</span>
                    <span className="text-emerald-700 text-xs font-bold uppercase tracking-normal">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[#e8e4dc] pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[#0a0a0a]">Subtotal</span>
                    <span className="font-black text-2xl text-olive">
                      {SITE_CONFIG.currency}{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-full bg-olive text-white text-xs font-bold uppercase tracking-wider text-center hover:bg-coral transition-colors duration-200 flex items-center justify-center gap-2 group shadow-md"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-xs font-bold uppercase tracking-wider text-[#8a8070] hover:text-olive transition-colors mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
