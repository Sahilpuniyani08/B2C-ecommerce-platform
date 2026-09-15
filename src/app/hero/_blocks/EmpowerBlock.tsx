"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * EmpowerBlock — EXACT Reference Image 2: "Streetwear that empowers"
 * Wide feature banner with "Jacket collection" label and circular arrow button.
 */
export function EmpowerBlock() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16" aria-label="Empower section">
      {/* Header matching Reference Image 2 */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display font-black text-3xl sm:text-5xl text-[#0a0a0a] tracking-tight">
          Streetwear that empowers
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-[#0a0a0a] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-all duration-200 cursor-pointer"
        >
          view more
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Panoramic Feature Banner matching Reference Image 2 */}
      <Link
        href="/shop?category=jackets"
        className="group relative rounded-3xl sm:rounded-[32px] overflow-hidden block aspect-[16/8] sm:aspect-[21/9] bg-[#111] shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <Image
          src="https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1800&auto=format&fit=crop"
          alt="Jacket collection"
          fill
          unoptimized
          className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
        />

        {/* Gradient for typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Bottom content row matching Reference Image 2 */}
        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex items-end justify-between gap-4">
          <h3 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            Jacket collection
          </h3>

          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-white flex items-center justify-center shrink-0 shadow-lg group-hover:bg-[#c8f250] group-hover:scale-110 transition-all duration-200">
            <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 text-[#0a0a0a]" />
          </div>
        </div>
      </Link>
    </section>
  );
}
