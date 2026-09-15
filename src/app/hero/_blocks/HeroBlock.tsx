"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { bg1, bg5 } from "@/assets/images";
import { Header } from "@/components/common/Header";

/**
 * HeroBlock — EXACT Reference Image 5: "UPGRADE YOUR STYLE WITH EASE"
 * Large rounded card with authentic streetwear photography, bold typography overlay,
 * pill "Shop now ->" button, and minimalist uppercase caption.
 */
export function HeroBlock() {
  return (
    <section className="hero-wrapper" aria-label="Hero">

      <div className="relative overflow-hidden bg-[#111] min-h-[95dvh] lg:min-h-[90dvh]  flex items-end shadow-xl">
        {/* Authentic Fashion Photograph Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={bg5}
            alt="Streetwear fashion collection"
            fill
            priority
            unoptimized
            className="object-cover object-[90%_40%] md:object-right"
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-12">
          <div className="max-w-3xl">
            {/* Giant Bold Headline Matching Reference Image 5 */}
            <h1 className="font-display font-semibold text-beige text-5xl sm:text-7xl lg:text-[88px] tracking-tight leading-[0.92] uppercase mb-8 drop-shadow-sm ">
              UPGRADE<br />
              YOUR STYLE<br />
              WITH EASE
            </h1>

            {/* Action Row matching Reference Image 5 */}
            <div className="flex items-end gap-6">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-3 px-2 py-3 sm:px-6 sm:py-4 shrink-0 rounded-full text-beige bg-transparent border border-beige  text-xs sm:text-sm font-semibold uppercase tracking-wider hover:bg-beige hover:text-olive hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer w-[30vw]  h-fit md:w-fit"
              >
                Shop now
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-beige-dark text-xs sm:text-sm font-semibold uppercase tracking-widest max-w-xs leading-snug">
                Find the latest fits, exclusive releases, and influencer-curated outfits all in one spot
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
