"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type SearchFieldsProps = {
  mode: "shop" | "browse";
  initialQuery: string;
};

function SearchFields({ mode, initialQuery }: SearchFieldsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [value, setValue] = useState(initialQuery);

  const submit = useCallback(() => {
    const q = value.trim();
    if (mode === "shop" && pathname === "/shop") {
      const params = new URLSearchParams(sp.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      const qs = params.toString();
      router.push(qs ? `/shop?${qs}` : "/shop");
    } else if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/shop");
    }
  }, [mode, pathname, router, sp, value]);

  return (
    <>
      <div className="relative mx-auto hidden min-w-0 max-w-md flex-1 md:flex">
        <label htmlFor="site-search" className="sr-only">
          Хайлт
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1A1A1A]/35"
          aria-hidden
        />
        <input
          id="site-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Хоол, элс, хэрэгсэл хайх…"
          className="h-11 w-full rounded-full border border-[#1A1A1A]/[0.08] bg-white pl-11 pr-4 text-sm text-[#1A1A1A] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] outline-none ring-[#1A1A1A]/20 transition-[box-shadow,border-color] placeholder:text-[#1A1A1A]/40 focus:border-[#1A1A1A]/20 focus:ring-2"
        />
      </div>

      <div className="relative flex min-w-0 flex-1 md:hidden">
        <label htmlFor="site-search-mobile" className="sr-only">
          Хайлт
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#1A1A1A]/35"
          aria-hidden
        />
        <input
          id="site-search-mobile"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Хоол, элс…"
          aria-label="Хайлт"
          className="h-10 w-full min-w-0 rounded-full border border-[#1A1A1A]/[0.08] bg-white pl-10 pr-3 text-sm text-[#1A1A1A] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] outline-none ring-[#1A1A1A]/20 placeholder:text-[#1A1A1A]/40 focus:border-[#1A1A1A]/20 focus:ring-2"
        />
      </div>
    </>
  );
}

export function HeaderSearch() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const qFromShop = pathname === "/shop" ? (sp.get("q") ?? "") : "";

  if (pathname === "/shop") {
    return <SearchFields key={qFromShop} mode="shop" initialQuery={qFromShop} />;
  }

  return <SearchFields key="browse" mode="browse" initialQuery="" />;
}
