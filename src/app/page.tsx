import type { Metadata } from "next";
import { HeroBlock } from "@/app/hero/_blocks/HeroBlock";
import { MarqueeTicker } from "@/app/hero/_blocks/MarqueeTicker";
import { BannerSlider } from "@/app/hero/_blocks/BannerSlider";
import { TrendsBlock } from "@/app/hero/_blocks/TrendsBlock";
import { EmpowerBlock } from "@/app/hero/_blocks/EmpowerBlock";
import { AboutBento } from "@/app/hero/_blocks/AboutBento";
import { FeaturedProducts } from "@/app/hero/_blocks/FeaturedProducts";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
};

export default function HomePage() {
  return (
    <div >
      <HeroBlock />
      <MarqueeTicker />
      <BannerSlider />
      <TrendsBlock />
      {/* <EmpowerBlock /> */}
      <FeaturedProducts />
      <AboutBento />
    </div>
  );
}
