"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/ui/page-skeletons";
import {
  fetchCatalogCached,
  readCatalogCache,
} from "@/lib/catalog-client";
import type { ShopProduct } from "@/lib/shop-products";

export function FlashSaleSection() {
  const [products, setProducts] = useState<ShopProduct[] | null>(() =>
    readCatalogCache({ limit: 8 }),
  );

  useEffect(() => {
    let cancelled = false;
    fetchCatalogCached({ limit: 8 })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section aria-labelledby="flash-sale-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <h2
          id="flash-sale-heading"
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Flash Sale
        </h2>
        <p className="text-sm text-foreground/50">Онцлох бүтээгдэхүүн</p>
      </div>

      {products === null ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
          <p>Одоогоор бараа байхгүй байна.</p>
        </div>
      ) : (
        <ProductGrid
          products={products}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
        />
      )}

      {products && products.length > 0 ? (
        <div className="mt-6 text-center">
          <Link
            href="/shop"
            prefetch
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Бүх барааг харах
          </Link>
        </div>
      ) : null}
    </section>
  );
}
