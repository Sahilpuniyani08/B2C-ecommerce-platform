"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { BannerSliderSkeleton } from "@/components/common/Skeleton";
import { useBanners } from "@/features/banners/queries";
import type { Banner } from "@/features/banners/types";
import { cn } from "@/lib/utils";


export function BannerSlider() {
  const { data: banners, isLoading } = useBanners(true);
  const activeBanners = banners?.filter((b) => b.isActive) ?? [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: activeBanners.length > 1 },
    [Autoplay({ delay: 4500, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (isLoading) {
    return (
      <section className="p-2">
        <BannerSliderSkeleton />
      </section>
    );
  }

  if (activeBanners.length === 0) return null;

  return (
    <section className="p-2" aria-label="Promotional banners">
      <div className="relative rounded-2xl ring-[1.5px] ring-olive/70 overflow-hidden bg-[#0a0a0a]">
        {/* Carousel Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {activeBanners.map((banner, index) => {
              const bannerUrl = getBannerUrl(banner);
              const SlideContent = (
                <div className="relative w-full min-h-[220px] aspect-2/1 md:aspect-16/5 group select-none">
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-black/75 via-black/30 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col justify-end pb-6 md:pb-8 h-full px-6 sm:px-12 max-w-3xl">
                    <h2 className="font-display font-medium text-lg sm:text-3xl lg:text-5xl text-beige leading-tight mb-2 drop-shadow-sm">
                      {banner.title}
                    </h2>
                    {banner.subtitle && (
                      <p className="text-beige/90 text-sm sm:text-base font-semibold  leading-relaxed drop-shadow-sm">
                        {banner.subtitle}
                      </p>
                    )}
                    {/* {banner.buttonText && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-olive text-beige text-sm md:text-base font-bold group-hover:bg-beige group-hover:text-olive transition-all duration-300 w-fit">
                        {banner.buttonText}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )} */}
                  </div>
                </div>
              );

              return (
                <div
                  key={banner.id}
                  className="flex-[0_0_100%] min-w-0 relative"
                >
                  {bannerUrl ? (
                    <Link href={bannerUrl} className="block w-full h-full">
                      {SlideContent}
                    </Link>
                  ) : (
                    SlideContent
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Pagination */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {activeBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  i === selectedIndex
                    ? "w-6 bg-beige border border-olive"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Get navigation URL using category/product slug instead of ID */
function getBannerUrl(banner: Banner): string | null {
  if (banner.category?.slug) {
    return `/category/${banner.category.slug}`;
  }
  if (banner.product?.slug) {
    return `/product/${banner.product.slug}`;
  }
  // Fallbacks if slug is missing
  if (banner.categoryId) {
    return `/category/${banner.categoryId}`;
  }
  if (banner.productId) {
    return `/product/${banner.productId}`;
  }
  return null;
}

