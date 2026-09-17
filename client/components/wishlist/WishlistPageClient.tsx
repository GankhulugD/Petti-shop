"use client";

import Link from "next/link";
import { useMemo } from "react";

import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { getShopProductsByIds } from "@/lib/api";
import type { ShopProduct } from "@/lib/shop-products";
import { useWishlist } from "@/store/useWishlist";

export function WishlistPageClient({ catalog }: { catalog: ShopProduct[] }) {
  const hydrated = useStoreHydrated();
  const ids = useWishlist((s) => s.ids);
  const products = useMemo(
    () => (hydrated ? getShopProductsByIds(catalog, ids) : []),
    [hydrated, catalog, ids],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Дуртай
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} бүтээгдэхүүн хадгалагдсан
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-muted/30 px-8 py-16 text-center ring-1 ring-foreground/[0.05]">
            <p className="text-sm font-medium text-foreground/80">
              Дуртай жагсаалт хоосон байна
            </p>
            <Button
              asChild
              className="mt-6 rounded-full bg-[#1A1A1A] px-8 text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
            >
              <Link href="/shop">Дэлгүүр хэсэх</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
