"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { ProductCardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useProducts } from "@/features/products/queries";
import { useCategories } from "@/features/categories/queries";
import Image from "next/image";
import { suit1, suit2 } from "@/assets/images";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const { data: categories } = useCategories(true);
  const category = categories?.find((c) => c.slug === slug);

  const { data: productsData, isLoading } = useProducts({
    categorySlug: slug,
    isActive: true,
  });

  const products = productsData?.products ?? [];
  const totalCount = productsData?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header Banner */}
      <div className="relative bg-olive border-b border-[#e8e4dc]">
        <div className="absolute inset-0 bg-black/20 z-2" />
        <div className=" absolute inset-0 aspect-video h-full w-full z-1 ">
          <Image src={suit1} alt="suit1" fill unoptimized className="object-cover object-top w-full h-full " />
        </div>
        <div className="relative  z-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">


          <span className="text-xs font-bold uppercase tracking-widest text-coral block mb-1">
            Collection
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-beige/80 tracking-tight capitalize mb-2">
            {category?.name ?? slug.replace(/-/g, " ")}
          </h1>
          {category?.description && (
            <p className="text-beige/80 text-sm sm:text-base max-w-2xl leading-relaxed">{category.description}</p>
          )}
          <p className="text-xs font-bold text-white uppercase tracking-widest mt-4">
            {totalCount} {totalCount === 1 ? "Product" : "Products"} Available
          </p>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#8a8070] mb-4">
          <Link href="/" className="text-olive hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="text-olive hover:text-black transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black font-medium capitalize">{category?.name ?? slug.replace(/-/g, " ")}</span>
        </nav>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 border border-[#e8e4dc] text-center shadow-xs">
            <EmptyState
              icon="package"
              title="No products in this collection"
              description="We are updating this collection soon. Explore our other popular categories!"
              action={
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-olive text-white text-xs font-bold uppercase tracking-wider hover:bg-coral transition-colors duration-200 shadow-md"
                >
                  Browse All Products
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
