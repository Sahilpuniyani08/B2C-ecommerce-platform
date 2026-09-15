/**
 * Site-wide branding & configuration.
 * Change values here to customise for different shops.
 */
export const SITE_CONFIG = {
  /** Brand name shown in the header, footer, and page titles */
  name: "Shezone",
  /** Short tagline used in the hero */
  tagline: "Fashion That Empowers",
  /** Meta description */
  description:
    "Discover the latest ladies fashion — curated styles, premium quality, and unbeatable value. Shop dresses, tops, ethnic wear, and more.",
  /** Base URL for OG images, canonical links, etc. */
  url: "https://dripdrop.in",
  /** Contact / footer info */
  contact: {
    phone: "+91 98765 43210",
    whatsapp: "+919876543210",
    email: "hello@dripdrop.in",
    address: "123 Fashion Street, Sri Ganganagar, Rajasthan 335001",
  },
  /** Social links */
  social: {
    instagram: "https://instagram.com/dripdrop",
    facebook: "https://facebook.com/dripdrop",
  },
  /** Header navigation links */
  navLinks: [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "#about" },
    { label: "Track Order", href: "/track-order" },
  ],
  /** Footer navigation columns */
  footerLinks: {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop?featured=true" },
      { label: "Sale", href: "/shop?sale=true" },
    ],
    help: [
      { label: "Track Order", href: "/track-order" },
      { label: "Cancel Order", href: "/track-order" },
      { label: "Contact Us", href: "mailto:hello@dripdrop.in" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Shipping Policy", href: "/shipping" },
    ],
  },
  /** Marquee ticker items — shown in the scrolling announcement bar */
  marqueeItems: [
    { icon: "Sparkles", text: "Free shipping on orders above ₹999" },
    { icon: "Star", text: "100% authentic & quality guaranteed" },
    { icon: "Truck", text: "Pan-India delivery in 3–7 business days" },
    { icon: "ShieldCheck", text: "Easy cancellation before dispatch" },
    { icon: "Heart", text: "Curated ladies fashion you'll love" },
    { icon: "BadgePercent", text: "Exclusive sale collections — shop now" },
  ],
  /** Currency symbol for display */
  currency: "₹",
  /** Currency code for API */
  currencyCode: "INR",
} as const;
