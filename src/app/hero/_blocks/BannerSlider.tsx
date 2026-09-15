"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BannerSliderSkeleton } from "@/components/common/Skeleton";
import { useBanners } from "@/features/banners/queries";
import type { Banner } from "@/features/banners/types";
import { cn } from "@/lib/utils";

/**
 * BannerSlider — Auto-playing banner carousel with navigation arrows & dots
 * Fetches active banners from the backend
 */
export function BannerSlider() {
  const { data: banners, isLoading } = useBanners(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeBanners = banners?.filter((b) => b.isActive) ?? [];

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % (activeBanners.length || 1));
  }, [activeBanners.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i === 0 ? (activeBanners.length - 1 || 0) : i - 1
    );
  }, [activeBanners.length]);

  // Auto-play
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [activeBanners.length, next]);

  if (isLoading) {
    return (
      <section className="p-2 ">
        <BannerSliderSkeleton />
      </section>
    );
  }

  if (activeBanners.length === 0) return null;

  const banner = activeBanners[activeIndex];

  return (
    <section
      className="p-2"
      aria-label="Promotional banners"
    >
      <div className="relative rounded-2xl ring-[1.5px] ring-olive/70 overflow-hidden bg-[#0a0a0a] aspect-16/5  height-[50vh] group">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            priority={activeIndex === 0}
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-linear-to-tr  from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end pb-4 h-full px-8 sm:px-12 max-w-xl">
          <h2 className="font-display font-bold text-lg sm:text-3xl lg:text-2xl text-beige leading-tight mb-2">
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p className="text-beige text-sm sm:text-base mb-2 leading-relaxed">
              {banner.subtitle}
            </p>
          )}
          {banner.buttonText && (
            <BannerLink banner={banner}>
              <span className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-olive text-beige text-sm md:text-base font-bold hover:bg-beige hover:text-olive transition-all duration-300 w-fit">
                {banner.buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </BannerLink>
          )}
        </div>

        {/* Arrows */}
        {activeBanners.length > 1 && (
          <div className="absolute right-4 bottom-4 flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous banner"
              className={cn(
                "w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center",
                "bg-olive text-beige hover:bg-olive/60 hover:text-beige cursor-pointer transition-colors"
              )}
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next banner"
              className={cn(
                "w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center",
                "bg-olive text-beige hover:bg-olive/60 hover:text-beige cursor-pointer transition-colors"
              )}
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        )}

        {/* Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex
                  ? "w-6 bg-beige border border-olive"
                  : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Navigate to category or product based on banner links */
function BannerLink({
  banner,
  children,
}: {
  banner: Banner;
  children: React.ReactNode;
}) {
  if (banner.categoryId) {
    return <Link href={`/category/${banner.categoryId}`}>{children}</Link>;
  }
  if (banner.productId) {
    return <Link href={`/product/${banner.productId}`}>{children}</Link>;
  }
  return <span>{children}</span>;
}
