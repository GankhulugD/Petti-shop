"use client";

import { useMemo } from "react";

import { ProductCard } from "@/components/products/ProductCard";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import type { ShopProduct } from "@/lib/shop-products";
import { useWishlist } from "@/store/useWishlist";

type ProductGridProps = {
  products: ShopProduct[];
  className?: string;
};

export function ProductGrid({ products, className }: ProductGridProps) {
  const hydrated = useStoreHydrated();
  const wishlistIds = useWishlist((s) => s.ids);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  return (
    <div
      className={
        className ??
        "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
      }
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          productId={p.id}
          name={p.name}
          price={p.priceLabel}
          rating={p.rating}
          imageSrc={p.imageSrc}
          imageAlt={p.imageAlt}
          href={`/product/${p.slug}`}
          badge={p.badge}
          brand={p.brand}
          inWishlist={hydrated && wishSet.has(p.id)}
          onToggleWishlist={() => toggleWish(p.id)}
        />
      ))}
    </div>
  );
}
