"use client";

import { useEffect, useState } from "react";

import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { ProductGridSkeleton } from "@/components/ui/page-skeletons";
import {
  fetchCatalogCached,
  readCatalogCache,
} from "@/lib/catalog-client";
import type { ShopProduct } from "@/lib/shop-products";

export function WishlistPageView() {
  const [catalog, setCatalog] = useState<ShopProduct[] | null>(() =>
    readCatalogCache(),
  );

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

  if (catalog === null) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Дуртай</h1>
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return <WishlistPageClient catalog={catalog} />;
}
