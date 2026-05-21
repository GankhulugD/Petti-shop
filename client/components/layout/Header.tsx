"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Heart, ShoppingBag, UserRound } from "lucide-react";

import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";

const navItems = [
  { href: "/shop", label: "Дэлгүүр" },
  { href: "/collections", label: "Цуглуулга" },
  { href: "/about", label: "Тухай" },
] as const;

function navItemActive(pathname: string, href: string): boolean {
  if (href === "/shop") {
    return pathname === "/shop" || pathname.startsWith("/shop/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const hydrated = useStoreHydrated();
  const lines = useCart((s) => s.lines);
  const openSheet = useCart((s) => s.openSheet);
  const wishIds = useWishlist((s) => s.ids);

  const cartCount = useMemo(
    () =>
      hydrated ? lines.reduce((n, l) => n + l.quantity, 0) : 0,
    [hydrated, lines],
  );
  const wishCount = hydrated ? wishIds.length : 0;

  const homeActive = pathname === "/" || pathname === "";

  return (
    <header className="sticky top-0 z-40 border-b border-[#1A1A1A]/[0.06] bg-[#F9F9F9]/90 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur-md supports-[backdrop-filter]:bg-[#F9F9F9]/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={cn(
            "shrink-0 rounded-2xl px-2 py-1 text-lg font-semibold tracking-tight transition-colors",
            homeActive
              ? "bg-[#1A1A1A]/[0.08] text-[#1A1A1A]"
              : "text-[#1A1A1A] hover:opacity-80",
          )}
        >
          Petti
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Үндсэн цэс"
        >
          {navItems.map((item) => {
            const active = navItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#1A1A1A] text-[#F9F9F9] shadow-sm"
                    : "text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/[0.04] hover:text-[#1A1A1A]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Suspense
          fallback={
            <div className="mx-auto hidden h-11 max-w-md flex-1 rounded-full bg-muted/40 md:flex" />
          }
        >
          <HeaderSearch />
        </Suspense>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/wishlist"
            className={cn(
              "relative inline-flex size-10 items-center justify-center rounded-2xl transition-colors",
              pathname === "/wishlist" || pathname.startsWith("/wishlist/")
                ? "bg-[#1A1A1A]/[0.08] text-[#1A1A1A]"
                : "text-[#1A1A1A] hover:bg-[#1A1A1A]/[0.05]",
            )}
            aria-label="Дуртай"
            aria-current={
              pathname === "/wishlist" || pathname.startsWith("/wishlist/")
                ? "page"
                : undefined
            }
          >
            <Heart className="size-[22px] stroke-[1.5]" />
            {wishCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#1A1A1A] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
                {wishCount > 99 ? "99+" : wishCount}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            onClick={openSheet}
            className="relative inline-flex size-10 items-center justify-center rounded-2xl text-[#1A1A1A] transition-colors hover:bg-[#1A1A1A]/[0.05]"
            aria-label="Сагс нээх"
          >
            <ShoppingBag className="size-[22px] stroke-[1.5]" />
            {cartCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#1A1A1A] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </button>
          <Link
            href="/profile"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-2xl transition-colors",
              pathname === "/profile" || pathname.startsWith("/profile/")
                ? "bg-[#1A1A1A]/[0.08] text-[#1A1A1A]"
                : "text-[#1A1A1A] hover:bg-[#1A1A1A]/[0.05]",
            )}
            aria-label="Профайл"
            aria-current={
              pathname === "/profile" || pathname.startsWith("/profile/")
                ? "page"
                : undefined
            }
          >
            <UserRound className="size-[22px] stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </header>
  );
}
