"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, ShoppingBag, UserRound } from "lucide-react";

import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";

const items = [
  { href: "/", label: "Нүүр", icon: Home, mode: "link" as const },
  { href: "/cart", label: "Сагс", icon: ShoppingBag, mode: "cart" as const },
  { href: "/wishlist", label: "Дуртай", icon: Heart, mode: "link" as const },
  { href: "/profile", label: "Профайл", icon: UserRound, mode: "link" as const },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const openSheet = useCart((s) => s.openSheet);
  const wishCount = useWishlist((s) => s.ids.length);

  return (
    <nav
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-3xl bg-[#1A1A1A] px-2 py-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] md:hidden"
      aria-label="Гар утасны доод цэс"
    >
      {items.map(({ href, label, icon: Icon, mode }) => {
        const active =
          mode === "cart"
            ? pathname === "/checkout" ||
              pathname.startsWith("/checkout/")
            : href === "/"
              ? pathname === "/" || pathname === ""
              : pathname === href || pathname.startsWith(`${href}/`);

        const className = active
          ? "relative flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-2xl bg-white px-3 py-2 text-[#1A1A1A] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)] transition-colors"
          : "relative flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-white/55 transition-colors hover:bg-white/10 hover:text-white/90";

        if (mode === "cart") {
          return (
            <button
              key="cart"
              type="button"
              onClick={openSheet}
              className={className}
            >
              <Icon
                className={`size-5 ${active ? "stroke-[2]" : "stroke-[1.5]"}`}
                aria-hidden
              />
              <span
                className={`text-[10px] font-medium leading-none ${active ? "text-[#1A1A1A]" : "text-white/55"}`}
              >
                {label}
              </span>
            </button>
          );
        }

        return (
          <Link key={href} href={href} className={className}>
            <Icon
              className={`size-5 ${active ? "stroke-[2]" : "stroke-[1.5]"}`}
              aria-hidden
            />
            {href === "/wishlist" && wishCount > 0 ? (
              <span className="absolute -right-0.5 top-1 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full bg-white px-0.5 text-[9px] font-bold leading-none text-[#1A1A1A]">
                {wishCount > 99 ? "99+" : wishCount}
              </span>
            ) : null}
            <span
              className={`text-[10px] font-medium leading-none ${active ? "text-[#1A1A1A]" : "text-white/55"}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
