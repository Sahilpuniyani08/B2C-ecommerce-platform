"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { SITE_CONFIG } from "@/config/site";

export function CartDrawer() {
  const { items, isOpen, closeDrawer, updateQuantity, removeItem, subtotal, totalItems } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 drawer-overlay"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-105 bg-white flex flex-col shadow-2xl drawer-panel"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e3d8]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-olive hover:-rotate-15 ease-in-out transition-transform duration-300" />
            <h2 className="font-display font-bold text-lg text-olive">
              Your Bag
              {totalItems > 0 && (
                <span className="ml-2 text-sm font-normal text-[#8a8070]">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full hover:bg-[#f5f0e8] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#f5f0e8] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-olive hover:-rotate-15 ease-in-out transition-transform duration-300" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg text-olive">
                  Your bag is empty
                </p>
                <p className="text-sm text-[#8a8070] mt-1">
                  Add something beautiful to get started
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-olive text-white text-sm font-medium hover:bg-olive/80 transition-colors"
              >
                Explore Shop
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const price = item.salePrice ?? item.price;
                return (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="flex gap-3 py-3 border-b border-[#f5f0e8] last:border-0"
                  >
                    {/* Image */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#f5f0e8] shrink-0 relative">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-olive" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="font-medium text-sm text-[#0a0a0a] hover:text-[var(--primary)] transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>

                      {/* Variant details */}
                      {(item.size || item.color) && (
                        <div className="flex gap-2 mt-1">
                          {item.size && (
                            <span className="text-xs text-[#8a8070] bg-[#f5f0e8] px-2 py-0.5 rounded-full">
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs text-[#8a8070] bg-[#f5f0e8] px-2 py-0.5 rounded-full">
                              {item.color}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Price */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-[#0a0a0a]">
                            {SITE_CONFIG.currency}{(price).toLocaleString("en-IN")}
                          </span>
                          {item.salePrice && (
                            <span className="text-xs text-[#8a8070] line-through">
                              {SITE_CONFIG.currency}{(item.price).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-full border border-[#e8e3d8] hover:bg-olive/80 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            disabled={item.quantity >= 20}
                            className="w-7 h-7 rounded-full border border-[#e8e3d8] hover:bg-olive/80 hover:text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Remove ${item.productName}`}
                      className="shrink-0 w-7 h-7 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors text-[#8a8070]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e8e3d8] px-5 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-olive font-bold">Subtotal</span>
              <span className="font-bold text-[#0a0a0a]">
                {SITE_CONFIG.currency}{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Delivery charges calculated at checkout
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3 rounded-full bg-[#0a0a0a] text-white text-sm font-semibold text-center hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="w-full py-3 rounded-full border border-[#e8e3d8] text-[#0a0a0a] text-sm font-medium text-center hover:border-[#0a0a0a] transition-colors"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
