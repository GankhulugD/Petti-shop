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
  const [products, setProducts] = useState<ShopProduct[] | null>(() =>
    readCatalogCache(),
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
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

  if (products === null) {
    return (
      <ShopPageClient products={[]} loading>
        <ProductGridSkeleton count={8} />
      </ShopPageClient>
    );
  }

  if (error && products.length === 0) {
    return (
      <ShopPageClient products={[]} loading={false}>
        <p className="py-12 text-center text-sm text-muted-foreground">
          Бараа татахад алдаа гарлаа. Дахин оролдоно уу.
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
