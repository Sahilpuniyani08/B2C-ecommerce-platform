"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import ProgressiveBlur from "@/components/common/ProgressiveBlur";
import { bg3, bg2 } from "@/assets/images";

export function AboutBento() {
  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20"
      aria-label="About our brand"
    >
      {/* Section heading */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-coral">
              About Us
            </span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-olive tracking-tight leading-[0.95]">
            Tradition,
            <br />
            <span className="text-coral">styled your way.</span>
          </h2>
        </div>

        <p className="max-w-md text-sm sm:text-base leading-relaxed text-olive/80">
          Timeless ethnic wear thoughtfully chosen for the woman who loves
          tradition, comfort, and a little bit of her own style.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">

        <div
          className="
            relative md:col-span-7
            min-h-[500px] sm:min-h-[560px]
            overflow-hidden rounded-[32px]
            bg-olive
            group
          "
        >
          <Image
            src={bg2}
            alt="Woman wearing elegant ethnic wear"
            fill
            unoptimized
            className="
              object-cover
              transition-transform duration-700 ease-out
              group-hover:scale-105
            "
            sizes="(max-width: 768px) 100vw, 60vw"
          />

          {/* Image tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Progressive blur at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-[55%]"

          >
            <ProgressiveBlur />
          </div>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-7 sm:p-9 lg:p-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                01 / Our Story
              </span>
            </div>

            <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-[1] max-w-lg">
              Where tradition
              <br />
              meets today.
            </h3>

            <p className="mt-4 text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
              We believe ethnic wear should feel as beautiful as it looks —
              effortless, comfortable, and made to celebrate every version of
              you.
            </p>
          </div>
        </div>


        <div className="md:col-span-5 grid grid-cols-2 gap-4 sm:gap-5">
          {/* Kurta card */}
          <div
            className="
              relative overflow-hidden
              min-h-[250px] sm:min-h-[270px]
              rounded-[30px]
              bg-[#eee8dc]
              p-6 sm:p-7
              flex flex-col justify-between
              group
            "
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-olive/50">
                02 / Kurtas
              </span>

              <div className="w-9 h-9 rounded-full bg-olive flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-beige" />
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-olive leading-tight">
                Everyday
                <br />
                elegance.
              </h3>

              <p className="text-xs sm:text-sm text-olive/60 mt-3 leading-relaxed">
                Easy silhouettes made for everyday moments.
              </p>
            </div>

            {/* Decorative shape */}
            <div
              className="
                absolute -right-10 -bottom-14
                w-32 h-32
                rounded-full
                border-[18px]
                border-coral/20
                transition-transform duration-500
                group-hover:scale-125
              "
            />
          </div>

          {/* Ethnic sets image */}
          <div className="relative overflow-hidden min-h-[250px] sm:min-h-[270px] rounded-[30px] group">
            <Image
              src={bg3}
              alt="Elegant Indian ethnic fashion"
              fill
              unoptimized
              className="
                object-cover
                transition-transform duration-700
                object-[10%_100%]
                group-hover:scale-110
              "
              sizes="(max-width: 768px) 50vw, 25vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60">
                03 / Sets
              </span>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                Made to celebrate.
              </h3>
            </div>
          </div>

          {/* Details card */}
          <div
            className="
              col-span-2
              min-h-[230px]
              rounded-[30px]
              bg-olive
              text-white
              p-7 sm:p-9
              flex flex-col sm:flex-row
              justify-between
              gap-8
              relative overflow-hidden
            "
          >
            <div className="relative z-10 max-w-md">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/40">
                04 / The Details
              </span>

              <h3 className="font-display font-bold text-2xl sm:text-3xl mt-3 leading-tight">
                Crafted with care.
              </h3>

              <p className="text-sm text-white/60 mt-3 leading-relaxed">
                From beautiful prints and comfortable fabrics to thoughtful
                finishing touches, every piece is selected with you in mind.
              </p>
            </div>

            {/* Decorative typography */}
            <div className="relative z-10 flex items-end">
              <span className="font-display font-black text-[90px] sm:text-[120px] leading-none text-beige/10 select-none">
                ✦
              </span>
            </div>

            {/* Background organic shape */}
            <div
              className="
                absolute -right-24 -bottom-32
                w-72 h-72
                rounded-full
                border-[50px]
                border-beige/5
              "
            />
          </div>
        </div>

        {/* =========================================
            BOTTOM CTA
        ========================================= */}
        <div
          className="
            md:col-span-12
            rounded-[30px]
            border border-olive/15
            bg-[#f7f3eb]
            p-7 sm:p-9
            flex flex-col sm:flex-row
            items-start sm:items-center
            justify-between
            gap-6
          "
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-coral">
              Find your style
            </span>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-olive mt-1">
              Something beautiful is waiting for you.
            </h3>
          </div>

          <Link
            href="/shop"
            className="
              inline-flex items-center gap-2.5
              px-6 py-3.5
              rounded-full
              bg-olive text-beige
              text-xs font-bold uppercase tracking-wider
              hover:bg-coral
              transition-all duration-300
              whitespace-nowrap
            "
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}