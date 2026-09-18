"use client";

import { useEffect, useState } from "react";

import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { ProductGridSkeleton } from "@/components/ui/page-skeletons";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { fetchProductsByIds } from "@/lib/api";
import type { ShopProduct } from "@/lib/shop-products";
import { useWishlist } from "@/store/useWishlist";

export function WishlistPageView() {
  const hydrated = useStoreHydrated();
  const ids = useWishlist((s) => s.ids);
  const [products, setProducts] = useState<ShopProduct[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;

    const load = async () => {
      if (!ids.length) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await fetchProductsByIds(ids);
        if (cancelled) return;
        const byId = new Map(data.map((p) => [p.id, p]));
        setProducts(
          ids.map((id) => byId.get(id)).filter((p): p is ShopProduct => !!p),
        );
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [hydrated, ids]);

  if (!hydrated || loading || products === null) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Дуртай</h1>
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return <WishlistPageClient products={products} />;
}
