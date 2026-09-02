"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV, isActiveAdminRoute } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex items-stretch gap-0.5 rounded-3xl bg-[#111827] px-1.5 py-1.5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.35)] md:hidden"
      aria-label="Гар утасны цэс"
    >
      {ADMIN_NAV.map(({ href, shortLabel, icon: Icon }) => {
        const active = isActiveAdminRoute(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl px-1 py-2 transition-colors",
              active
                ? "bg-white text-[#111827] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)]"
                : "text-white/55 hover:bg-white/10 hover:text-white/90",
            )}
          >
            <Icon
              className={cn("size-5", active ? "stroke-[2]" : "stroke-[1.5]")}
              aria-hidden
            />
            <span className="max-w-full truncate text-[10px] font-medium leading-none">
              {shortLabel}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
