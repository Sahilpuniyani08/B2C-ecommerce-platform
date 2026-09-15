"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/features/categories/queries";
import ProgressiveBlur from "@/components/common/ProgressiveBlur";
import { Skeleton } from "@/components/common/Skeleton";

interface TrendItem {
  id: string;
  title: string;
  href: string;
  imageUrl: string;
}


const TREND_ITEMS: TrendItem[] = [
  {
    id: "1",
    title: "Fresh sweatshirts",
    href: "/shop?category=sweatshirts",
    imageUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "New drop from Supreme",
    href: "/shop?featured=true",
    imageUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Hats spring 2025",
    href: "/shop?category=accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
];

/**
 * TrendsBlock — EXACT Reference Image 3: "Today's trends"
 * 3 vertical cards with high-fashion imagery, bottom-left bold title,
 * and white circular arrow button in bottom right.
 */
export function TrendsBlock() {
  const { data: categories, isLoading } = useCategories(true);

  console.log(categories);


  return (
    <section id="trends" className="max-w-7xl mx-auto px-2 py-6 md:py-12" aria-label="Today's trends">
      {/* Header matching Reference Image 3 */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-black text-3xl sm:text-5xl text-olive tracking-tight">
          Today&apos;s <span className="text-coral">trends</span>
        </h2>
        <Link
          href="/shop"
          className={"inline-flex items-center gap-2 border border-olive rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-olive hover:bg-olive hover:text-white transition-all duration-200 cursor-pointer"}
        >
          view more
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {
        isLoading ?
          (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, index) => {
                return (
                  <div key={index} className="w-full h-full">
                    <Skeleton className="rounded-2xl!  overflow-hidden aspect-3/4 " />
                  </div>
                )
              })}

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">

              {categories?.map((item) => (
                <Link
                  key={item.id}
                  href={`/shop?category=${item.slug}`}
                  className="group relative rounded-xl ring-2 ring-olive overflow-hidden aspect-3/4 bg-biege  shadow-sm shadow-beige hover:shadow-xl transition-all duration-300 flex flex-col justify-end "
                >
                  <div className="w-full h-full absolute inset-0">

                    <ProgressiveBlur />
                  </div>
                  {/* Background Image */}
                  <Image
                    src={String(item.imageUrl)}
                    alt={item.slug}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Content Row: Bottom Title + White Circle Arrow Button */}
                  <div className="relative z-10 bottom-5 px-5 flex items-end justify-between gap-4 w-full ">
                    <h3 className="font-display max-w-[60%] font-black text-2xl rounded-full sm:text-2xl text-white text-shadow-xs leading-tight">
                      {item.name}
                    </h3>

                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg  group-hover:bg-beige group-hover:scale-110 transition-all duration-200">
                      <ArrowRight className="w-5 h-5 -rotate-45 text-olive" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
      }

    </section>
  );
}
