"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

function SearchInputs({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
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
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
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
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
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

function readShopQuery(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function HeaderSearchField({
  onShop,
  initialQ,
}: {
  onShop: boolean;
  initialQ: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialQ);

  const submit = useCallback(() => {
    const q = value.trim();
    if (!onShop) {
      if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
      else router.push("/shop");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (q) params.set("q", q);
    else params.delete("q");
    const qs = params.toString();
    const next = qs ? `/shop?${qs}` : "/shop";
    const current = `${window.location.pathname}${window.location.search}`;
    if (current === next) return;
    window.history.replaceState(window.history.state, "", next);
    window.dispatchEvent(new Event("petti:shop-url"));
  }, [onShop, router, value]);

  return (
    <SearchInputs value={value} onChange={setValue} onSubmit={submit} />
  );
}

export function HeaderSearchFallback() {
  return <SearchInputs value="" onChange={() => {}} onSubmit={() => {}} />;
}

export function HeaderSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onShop = pathname === "/shop";
  const [urlSync, setUrlSync] = useState(0);

  useEffect(() => {
    const onUrl = () => setUrlSync((n) => n + 1);
    window.addEventListener("petti:shop-url", onUrl);
    return () => window.removeEventListener("petti:shop-url", onUrl);
  }, []);

  const initialQ = onShop
    ? urlSync > 0
      ? readShopQuery()
      : (searchParams.get("q") ?? "")
    : "";
  const remountKey = onShop
    ? `${pathname}-${searchParams.toString()}-${urlSync}`
    : pathname;

  return (
    <HeaderSearchField
      key={remountKey}
      onShop={onShop}
      initialQ={initialQ}
    />
  );
}
