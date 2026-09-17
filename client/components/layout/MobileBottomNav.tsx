"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Heart,
  Home,
  ShoppingBag,
  Store,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/useCart";

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
  isActive: (pathname: string, cartOpen: boolean) => boolean;
};

const items: NavItem[] = [
  {
    id: "home",
    href: "/",
    label: "Нүүр",
    icon: Home,
    isActive: (p) => p === "/" || p === "",
  },
  {
    id: "wishlist",
    href: "/wishlist",
    label: "Дуртай",
    icon: Heart,
    isActive: (p) => p === "/wishlist" || p.startsWith("/wishlist/"),
  },
  {
    id: "shop",
    href: "/shop",
    label: "Дэлгүүр",
    icon: Store,
    isActive: (p) =>
      p === "/shop" ||
      p.startsWith("/shop/") ||
      p.startsWith("/product/"),
  },
  {
    id: "cart",
    label: "Сагс",
    icon: ShoppingBag,
    isActive: (p, cartOpen) =>
      cartOpen || p === "/checkout" || p.startsWith("/checkout/"),
  },
  {
    id: "profile",
    href: "/profile",
    label: "Профайл",
    icon: UserRound,
    isActive: (p) => p === "/profile" || p.startsWith("/profile/"),
  },
];

function CatEars() {
  return (
    <>
      <span
        className="pointer-events-none absolute -top-1 left-[5%] z-10 block h-0 w-0 border-x-[8px] border-x-transparent border-b-[12px] border-b-white -rotate-[26deg]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -top-1 right-[5%] z-10 block h-0 w-0 border-x-[8px] border-x-transparent border-b-[12px] border-b-white rotate-[26deg]"
        aria-hidden
      />
    </>
  );
}

function TabContent({
  active,
  icon: Icon,
  label,
  badge,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  badge?: number;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-0.5 px-2 py-2.5 transition-colors",
        active
          ? "rounded-full bg-white text-[#1A1A1A] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.15)]"
          : "rounded-full text-white/55 hover:bg-white/10 hover:text-white/90",
      )}
    >
      {active ? <CatEars /> : null}
      <Icon
        className={cn("size-5", active ? "stroke-[2]" : "stroke-[1.5]")}
        aria-hidden
      />
      {badge != null && badge > 0 ? (
        <span
          className={cn(
            "absolute right-2 top-1.5 flex min-h-[14px] min-w-[14px] items-center justify-center rounded-full px-0.5 text-[9px] font-bold leading-none",
            active ? "bg-[#1A1A1A] text-white" : "bg-white text-[#1A1A1A]",
          )}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
      <span className="truncate text-[10px] font-medium leading-none">
        {label}
      </span>
    </div>
  );
}

function NavTab({
  item,
  active,
  badge,
  onCartClick,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
  onCartClick?: () => void;
}) {
  const shellClass =
    "relative mx-0.5 flex min-w-0 flex-1 flex-col items-center justify-end pt-1";

  const content = (
    <TabContent
      active={active}
      icon={item.icon}
      label={item.label}
      badge={badge}
    />
  );

  if (item.id === "cart" && onCartClick) {
    return (
      <button
        type="button"
        onClick={onCartClick}
        className={shellClass}
        aria-label="Сагс нээх"
        aria-pressed={active}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={item.href!}
      className={shellClass}
      aria-current={active ? "page" : undefined}
    >
      {content}
    </Link>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useStoreHydrated();
  const openSheet = useCart((s) => s.openSheet);
  const cartOpen = useCart((s) => s.isSheetOpen);
  const lines = useCart((s) => s.lines);

  const cartCount = useMemo(
    () => (hydrated ? lines.reduce((n, l) => n + l.quantity, 0) : 0),
    [hydrated, lines],
  );

  const badges: Record<string, number> = {
    cart: cartCount,
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden"
      aria-label="Гар утасны доод цэс"
    >
      <div
        className="mx-auto flex max-w-md items-end gap-0.5 overflow-visible rounded-[1.75rem] border border-white/10 bg-[#1A1A1A] px-1.5 pb-1.5 pt-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"
      >
        {items.map((item) => (
          <NavTab
            key={item.id}
            item={item}
            active={item.isActive(pathname, cartOpen)}
            badge={badges[item.id]}
            onCartClick={item.id === "cart" ? openSheet : undefined}
          />
        ))}
      </div>
    </nav>
  );
}
