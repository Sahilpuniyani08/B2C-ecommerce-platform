"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/features/products/queries";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductCardSkeleton } from "@/components/common/Skeleton";


export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ isFeatured: true, isActive: true });
  const displayProducts = data?.products?.slice(0, 8) ?? [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" aria-label="Featured pieces">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-coral block mb-1">
            Hand-picked
          </span>
          <h2 className="font-display font-black text-2xl sm:text-5xl text-olive tracking-tight">
            Featured <span className="text-coral">Pieces</span>
          </h2>
        </div>
        <Link
          href="/shop"
          className={"inline-flex items-center gap-2 border border-olive rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-sm font-bold uppercase tracking-wider text-olive hover:bg-olive hover:text-white transition-all duration-200 cursor-pointer"}
        >
          view more
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : displayProducts.length > 0
            ? displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
            : (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-[#e8e4dc]">
                <p className="text-[#8a8070] text-sm">No featured products yet.</p>
              </div>
            )}
      </div>
    </section>
  );
}
