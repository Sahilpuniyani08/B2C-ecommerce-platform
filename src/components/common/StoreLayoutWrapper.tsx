"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isHomeRoute = pathname === "/";

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f5]">
      <Header />
      <main className={`flex-1 ${isHomeRoute ? "pt-0" : "pt-16 lg:pt-20"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
