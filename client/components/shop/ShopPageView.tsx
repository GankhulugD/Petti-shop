"use client";

import { useEffect, useState } from "react";

import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { ProductGridSkeleton } from "@/components/ui/page-skeletons";
import {
  fetchCatalogCached,
  readCatalogCache,
} from "@/lib/catalog-client";
import type { ShopProduct } from "@/lib/shop-products";

export function ShopPageView() {
  const [products, setProducts] = useState<ShopProduct[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = readCatalogCache();
    if (cached?.length) setProducts(cached);

    fetchCatalogCached()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (products === null && !error) {
    return (
      <ShopPageClient products={[]} loading>
        <ProductGridSkeleton count={8} />
      </ShopPageClient>
    );
  }

  if (error || products === null) {
    return (
      <ShopPageClient products={[]} loading={false}>
        <p className="py-12 text-center text-sm text-muted-foreground">
          Бараа татахад алдаа гарлаа. Хуудсыг дахин ачааллана уу.
        </p>
      </ShopPageClient>
    );
  }

  return (
    <ShopPageClient products={products} loading={false}>
      {null}
    </ShopPageClient>
  );
}
