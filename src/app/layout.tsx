import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/providers";
import { SITE_CONFIG } from "@/config/site";
import { CartDrawer } from "@/components/common/CartDrawer";
import { StoreLayoutWrapper } from "@/components/common/StoreLayoutWrapper";

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "ladies fashion",
    "women clothing",
    "ethnic wear",
    "dresses",
    "tops",
    "online shopping",
    "India",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
