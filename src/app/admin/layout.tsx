"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Image,
  Truck,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAdminSession } from "@/features/auth/queries";
import { useLogoutAdmin } from "@/features/auth/mutations";
import { SITE_CONFIG } from "@/config/site";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/delivery-rules", label: "Delivery Rules", icon: Truck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isLoading } = useAdminSession();
  const logoutMutation = useLogoutAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Protect all admin routes (except login)
  useEffect(() => {
    if (!isLoginPage && !isLoading && !session) {
      router.replace("/admin/login");
    }
  }, [session, isLoading, isLoginPage, router]);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.replace("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <p className="font-display font-bold text-2xl text-[#1c2119] tracking-tight">{SITE_CONFIG.name}</p>
          <p className="text-xs text-[#7d796f] mt-0.5 font-medium">Verifying admin session...</p>
        </div>
        <div className="w-8 h-8 border-3 border-[#677a5d]/20 border-t-[#677a5d] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex font-body">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1c2119] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto border-r border-[#2d3529] shadow-xl lg:shadow-none`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-display font-bold text-xl text-white tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#677a5d]" />
              {SITE_CONFIG.name}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <span className="inline-block text-[11px] font-semibold text-[#c9d4bd] bg-[#677a5d]/30 px-2 py-0.5 rounded-md mt-2">
            Admin Workspace
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3.5 py-5 overflow-y-auto space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
            Management
          </p>
          <ul className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                      active
                        ? "bg-[#677a5d] text-white font-semibold shadow-md"
                        : "text-white/70 hover:bg-white/10 hover:text-white font-medium"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-white/60"}`} />
                    {item.label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10 bg-[#151913]">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-[#677a5d] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
              {getInitials(session.email.split("@")[0])}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{session.email.split("@")[0]}</p>
              <p className="text-white/40 text-[10px] truncate">{session.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="sidebar-link w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#e5e0d5] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-4 shadow-2xs">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl hover:bg-[#f9f7f1] flex items-center justify-center text-[#1c2119] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#7d796f] min-w-0">
            <Link href="/admin" className="hover:text-[#1c2119] font-medium transition-colors shrink-0">
              Admin
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#99958b]" />
                <span className="text-[#1c2119] font-semibold capitalize truncate">
                  {pathname.split("/admin/")[1]?.split("/")[0]?.replace(/-/g, " ") ?? ""}
                </span>
              </>
            )}
          </nav>

          {/* Right: Store link */}
          <div className="ml-auto">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#677a5d] bg-[#e5eadf] hover:bg-[#c9d4bd] px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>View Live Storefront</span> ↗
            </Link>
          </div>
        </header>

        {/* Page content with proper X-axis padding/spacing */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
