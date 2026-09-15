"use client";

import {
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  BadgePercent,
  ShoppingBag,
  MapPin,
  Gem,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Star,
  Truck,
  ShieldCheck,
  Heart,
  BadgePercent,
  ShoppingBag,
  MapPin,
  Gem,
};

export function MarqueeTicker() {
  const items = [
    ...SITE_CONFIG.marqueeItems,
    ...SITE_CONFIG.marqueeItems,
  ];

  return (
    <section
      className="relative overflow-hidden mask-r-from-90% mask-l-from-90% bg-transparent py-4"
      aria-label="Store announcements"
    >

      {/* MARQUEE */}
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] ?? Sparkles;

          return (
            <div
              key={`${item.text}-${idx}`}
              className="flex items-center"
            >
              {/* ITEM */}
              <div className="inline-flex items-center gap-3 px-8 md:px-12">
                {/* ICON */}
                <span
                  className="
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full
                    bg-coral/10
                    ring-1 ring-coral/20
                  "
                >
                  <Icon
                    className="h-5 w-5 text-coral"
                    strokeWidth={1.8}
                  />
                </span>

                {/* TEXT */}
                <span
                  className="
                    text-base
                    font-semibold
                    tracking-wide
                    text-olive
                    md:text-lg
                  "
                >
                  {item.text}
                </span>
              </div>

              {/* ROSE DECORATIVE SEPARATOR */}
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-rose" />
                <span className="h-2 w-2 rotate-45 bg-coral/70" />
                <span className="h-1 w-1 rounded-full bg-rose" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}