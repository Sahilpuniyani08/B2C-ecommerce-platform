"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { bg3 } from "@/assets/images";


export function FamilyCommunityBlock() {
  return (
    <section className="" aria-label="Community footer block">
      <div className="bg-olive text-white p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl">
        {/* Top Split Section */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16 lg:mb-24">
          {/* Left: Clover/Organic Mask with Model matching Reference Image 1 */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative w-full max-w-sm aspect-4/5 overflow-hidden shadow-sm border-beige-dark border-[0.5px]"
              style={{
                borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
              }}
            >
              <Image
                src={bg3}
                alt="Streetwear family community"
                fill
                unoptimized
                className="object-cover object-[100%_100%]"
              />
            </div>
          </div>

          {/* Right: Message + Buttons + Directory matching Reference Image 1 */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            <h2 className="font-display font-medium text-2xl sm:text-3xl lg:text-4xl text-white/90 leading-snug max-w-xl">
              Be part of our streetwear family. Connect through the app, get inspired by influencers, and create your own unique style!
            </h2>

            {/* Pill Action Buttons matching Reference Image 1 */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-beige text-[#0a0a0a] font-bold text-xs uppercase tracking-wider hover:bg-coral hover:text-beige transition-colors"
              >
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-beige font-bold text-xs uppercase tracking-wider hover:border-beige transition-colors hover:text-olive hover:bg-beige"
              >
                Track Order
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4-Column Directory matching Reference Image 1 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 text-xs">
              <div>
                <p className="text-white/40 uppercase tracking-widest font-semibold mb-3">Categories</p>
                <ul className="space-y-2 text-beige/70">
                  <li><Link href="/shop" className="hover:text-coral">Kurtis</Link></li>
                  <li><Link href="/shop" className="hover:text-coral">Leggings</Link></li>
                  <li><Link href="/shop" className="hover:text-coral">Jackets</Link></li>
                  <li><Link href="/shop" className="hover:text-coral">Accessories</Link></li>
                </ul>
              </div>

              {/* <div>
                <p className="text-white/40 uppercase tracking-widest font-semibold mb-3">Community</p>
                <ul className="space-y-2 text-beige/70">
                  <li><Link href="/track-order" className="hover:text-coral">Track Order</Link></li>
                  <li><Link href="/terms" className="hover:text-coral">Shipping & Returns</Link></li>
                  <li><Link href={`https://wa.me/${SITE_CONFIG.contact.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-coral">Contact Us</Link></li>
                  <li><Link href="/faqs" className="hover:text-coral">FAQ</Link></li>
                </ul>
              </div> */}

              <div>
                <p className="text-white/40 uppercase tracking-widest font-semibold mb-3">Help</p>
                <ul className="space-y-2 text-beige/70">
                  <li><Link href="/track-order" className="hover:text-coral">Track Order</Link></li>
                  <li><Link href="/terms" className="hover:text-coral">Terms & Conditions</Link></li>
                  <li><a href={`https://wa.me/${SITE_CONFIG.contact.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent('Hi, I need help!')}`} target="_blank" rel="noopener noreferrer" className="hover:text-coral">Contact Us</a></li>
                  <li><Link href="/faqs" className="hover:text-coral">FAQ</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Giant Edge-To-Edge Brand Logo matching Reference Image 1 */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-center font-display font-black text-[clamp(60px,18vw,220px)] leading-[0.8] tracking-tight text-beige select-none uppercase">
            {SITE_CONFIG.name}
          </p>
          <div className="flex flex-col sm:flex-row items-center  justify-between text-[11px] text-white/40 pt-6 mt-4 border-t border-white/5 gap-2">
            <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
