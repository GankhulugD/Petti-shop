"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";

import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { getShopProductsByIds } from "@/lib/shop-products";
import { useWishlist } from "@/store/useWishlist";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const products = useMemo(() => getShopProductsByIds(ids), [ids]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Дуртай
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} бүтээгдэхүүн хадгалагдсан
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-muted/40 px-8 py-16 text-center ring-1 ring-foreground/[0.05]">
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                productId={p.id}
                name={p.name}
                price={p.priceLabel}
                rating={p.rating}
                imageSrc={p.imageSrc}
                imageAlt={p.imageAlt}
                href={`/product/${p.id}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
