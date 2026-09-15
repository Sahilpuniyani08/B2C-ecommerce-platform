"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductCardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useProducts } from "@/features/products/queries";
import { useCategories } from "@/features/categories/queries";
import Image from "next/image";
import { suit3 } from "@/assets/images";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showFeatured, setShowFeatured] = useState(false);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, showFeatured]);

  const { data: categories } = useCategories(true);
  const { data: productsData, isLoading } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    categoryId: selectedCategory,
    isFeatured: showFeatured ? true : undefined,
    isActive: true,
  });

  const products = productsData?.products ?? [];
  const totalPages = productsData?.totalPages ?? 1;
  const totalProducts = productsData?.total ?? 0;

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory(undefined);
    setShowFeatured(false);
    setPage(1);
  }, []);

  const hasFilters = Boolean(search || selectedCategory || showFeatured);

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Page header */}
      <div className="relative bg-olive border-b ">
        <div className="absolute inset-0 bg-black/20 z-2" />
        <div className=" absolute inset-0 aspect-video h-full w-full z-1 ">
          <Image src={suit3} alt="suit3" fill unoptimized className="object-cover object-top w-full h-full " />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-5">
          <span className="text-xs font-bold uppercase tracking-widest text-coral block mb-2">
            Catalog & Drops
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-beige/90 tracking-tight">
            Shop Collection
          </h1>
          <p className="text-beige/90 text-sm mt-2">
            {totalProducts > 0 ? `${totalProducts} products available` : "Explore all pieces"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters toolbar */}
        <div className="space-y-4 mb-10">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-olive" />
            <input
              id="shop-search"
              type="search"
              placeholder="Search products, fabrics, styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 focus:rounded-full! border-2 border-olive/50 bg-white text-sm placeholder:text-olive focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8070] hover:text-[#0a0a0a]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${!selectedCategory
                ? "bg-olive/80 text-white shadow-xs"
                : "bg-white border border-olive text-olive hover:border-olive/50"
                }`}
            >
              All Categories
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.id ? undefined : cat.id
                  )
                }
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedCategory === cat.id
                  ? "bg-olive/80 text-white shadow-xs"
                  : "bg-white border border-olive text-olive hover:border-olive/50"
                  }`}
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => setShowFeatured((f) => !f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${showFeatured
                ? "bg-coral/80 text-white shadow-xs"
                : "bg-white border border-olive text-olive hover:border-olive/50"
                }`}
            >
              ★ Featured
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-olive text-olive font-bold text-xs uppercase tracking-wider hover:bg-olive hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-full text-xs font-bold transition-colors cursor-pointer ${page === pageNum
                          ? "bg-olive text-white shadow-xs"
                          : "bg-white border border-[#e8e4dc] text-olive hover:border-olive"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-olive text-olive font-bold text-xs uppercase tracking-wider hover:bg-olive hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-[#e8e4dc] p-12">
            <EmptyState
              icon="package"
              title="No products found"
              description={
                hasFilters
                  ? "Try changing your search keywords or filter selection."
                  : "No products are available right now. Check back soon!"
              }
              action={
                hasFilters ? (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 rounded-full bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
