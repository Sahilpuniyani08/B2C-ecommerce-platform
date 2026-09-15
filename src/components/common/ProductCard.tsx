"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { SITE_CONFIG } from "@/config/site";
import type { Product } from "@/features/products/types";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.imageUrl ||
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop";

  // Calculate pricing based on variants or base product
  const firstVariant =
    product.variants?.find((v) => v.isActive && v.stock > 0) ||
    product.variants?.[0];

  const basePrice = firstVariant?.price != null ? Number(firstVariant.price) : Number(product.price);
  const salePrice = firstVariant?.salePrice != null ? Number(firstVariant.salePrice) : product.salePrice != null ? Number(product.salePrice) : null;

  const displayPrice = salePrice ?? basePrice;
  const hasDiscount = salePrice != null && basePrice > salePrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - salePrice!) / basePrice) * 100)
    : null;

  const totalStock = product.variants && product.variants.length > 0
    ? product.variants.reduce((sum, v) => sum + (v.isActive ? v.stock : 0), 0)
    : 10;

  const isOutOfStock = totalStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: firstVariant?.id,
      productName: product.name,
      price: basePrice,
      salePrice: salePrice ?? undefined,
      imageUrl: primaryImage,
      size: firstVariant?.size ?? undefined,
      color: firstVariant?.color ?? undefined,
      quantity: 1,
      slug: product.slug,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative block rounded-2xl bg-white border border-[#e8e4dc] p-1 hover:shadow-md transition-all duration-300">
      <Link href={`/product/${product.slug}`}>
        {/* Image container with rounded corners */}
        <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-[#f5f0e8] mb-4">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            unoptimized
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 35vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            {discountPercent && (
              <span className="bg-coral text-beige text-[11px] font-black uppercase px-2.5 py-1 rounded-full shadow-xs">
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-[#0a0a0a] text-beige text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                Featured
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-amber-800 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                Sold Out
              </span>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`absolute bottom-3 right-3 z-20 p-2.5 rounded-full shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center ${added
              ? "bg-emerald-600 text-white scale-110"
              : isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#0a0a0a] text-beige hover:bg-coral hover:text-white hover:scale-105"
              }`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>

        {/* Product Details */}
        <div className="space-y-1 flex flex-col justify-between md:flex-row px-2 pb-2">
          <div>
            {product.category?.name && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-olive/70">
                {product.category.name}
              </p>
            )}

            <h3 className="font-editorial font-semibold text-sm sm:text-base truncate text-ellipsis text-[#1f1e1e] group-hover:text-olive transition-colors duration-300 line-clamp-1 group-hover:underline jdnajkndkdjn">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="font-bold text-base sm:text-lg text-[#0a0a0a]">
              {SITE_CONFIG.currency}{Number(displayPrice).toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-[#8a8070] line-through">
                {SITE_CONFIG.currency}{Number(basePrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
