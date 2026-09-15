"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { useCart } from "@/context/cart-context";
import { usePathname } from "next/navigation";

export function Header() {
  const { totalItems, openDrawer } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  // Only home page gets transparent header
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    setIsMobileMenuOpen(false);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * HOME + TOP:
   * transparent
   * beige text
   * beige buttons
   * olive icons
   *
   * HOME + SCROLLED:
   * beige background
   * olive text
   * olive buttons
   * beige icons
   *
   * OTHER PAGES:
   * beige background
   * olive text
   */

  const isTransparentHeader = isHomePage && !isScrolled;

  const headerBackground = isTransparentHeader
    ? "bg-transparent"
    : "bg-beige shadow-2xs";

  const headerText = isTransparentHeader
    ? "text-beige"
    : "text-olive";

  const actionButton = isTransparentHeader
    ? "bg-beige text-olive border-beige hover:bg-cream"
    : "bg-olive text-beige border-olive hover:bg-olive-dark";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`
          w-full px-4 sm:px-6 lg:px-8
          transition-all duration-300
          ${headerBackground}
        `}
      >
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link
            href="/"
            className={`
              font-display font-black text-2xl lg:text-3xl
              tracking-tight
              transition-colors duration-300
              hover:opacity-80
              ${headerText}
            `}
          >
            {SITE_CONFIG.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/shop"
              className={`
                header-nav-link
                text-sm font-semibold
                transition-colors duration-300
                ${headerText}
              `}
            >
              Shop
            </Link>

            <Link
              href="/#trends"
              className={`
                header-nav-link
                text-sm font-semibold
                transition-colors duration-300
                ${headerText}
              `}
            >
              Trends
            </Link>

            <Link
              href="/#about"
              className={`
                header-nav-link
                text-sm font-semibold
                transition-colors duration-300
                ${headerText}
              `}
            >
              About
            </Link>

            <Link
              href="/track-order"
              className={`
                header-nav-link
                text-sm font-semibold
                transition-colors duration-300
                ${headerText}
              `}
            >
              Track Order
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search */}
            <Link
              href="/shop"
              aria-label="Search products"
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                border
                transition-all duration-300
                ${actionButton}
              `}
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              id="cart-drawer-trigger"
              onClick={openDrawer}
              aria-label={`Open cart, ${totalItems} items`}
              className={`
                relative flex items-center justify-center
                w-10 h-10 rounded-full
                border
                transition-all duration-300
                cursor-pointer
                ${actionButton}
              `}
            >
              <ShoppingBag className="w-4 h-4" />

              {totalItems > 0 && (
                <span
                  className={`
                    absolute -top-1 -right-1
                    w-5 h-5 rounded-full
                    bg-olive text-beige
                    text-[10px] font-bold
                    flex items-center justify-center
                    leading-none
                  `}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className={`
                flex lg:hidden items-center justify-center
                w-10 h-10 rounded-full
                border
                transition-all duration-300
                ${actionButton}
              `}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-beige border-t border-border animate-fade-in shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">

            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-olive hover:bg-cream transition-colors"
            >
              Shop All
            </Link>

            <Link
              href="/#trends"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-olive hover:bg-cream transition-colors"
            >
              Trends
            </Link>

            <Link
              href="/#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-olive hover:bg-cream transition-colors"
            >
              About
            </Link>

            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-base font-semibold text-olive hover:bg-cream transition-colors"
            >
              Track Order
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}