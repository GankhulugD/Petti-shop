"use client";

import { useEffect, useState } from "react";

import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { ProductGridSkeleton } from "@/components/ui/page-skeletons";
import { useCatalogCache } from "@/hooks/use-catalog-cache";
import { fetchCatalogCached } from "@/lib/catalog-client";
import type { ShopProduct } from "@/lib/shop-products";

export function WishlistPageView() {
  const cached = useCatalogCache();
  const [catalog, setCatalog] = useState<ShopProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCatalogCached()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setCatalog([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const display = catalog ?? cached;

  if (display === null) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Дуртай</h1>
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return <WishlistPageClient catalog={display} />;
}
