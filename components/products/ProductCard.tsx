"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";

import { useWishlist } from "@/store/useWishlist";

export type ProductCardProps = {
  productId?: string;
  name: string;
  price: string;
  rating: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

export function ProductCard({
  productId,
  name,
  price,
  rating,
  imageSrc,
  imageAlt,
  href,
}: ProductCardProps) {
  const toggleWish = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) =>
    productId ? s.has(productId) : false,
  );

  return (
    <motion.article
      className="relative"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className="block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-foreground/[0.05] transition-shadow hover:shadow-[0_8px_28px_-12px_rgba(26,26,26,0.12)]"
      >
        <div className="relative aspect-square bg-background">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
        <div className="space-y-1.5 p-3 sm:p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground sm:text-[0.9375rem]">
            {name}
          </h3>
          <p className="text-sm font-semibold text-foreground">{price}</p>
          <div className="flex items-center gap-1 text-foreground/70">
            <Star
              className="size-3.5 fill-foreground text-foreground sm:size-4"
              strokeWidth={0}
              aria-hidden
            />
            <span className="text-xs font-medium tabular-nums sm:text-sm">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
      {productId ? (
        <button
          type="button"
          className={`absolute right-2 top-2 z-10 inline-flex size-9 items-center justify-center rounded-full shadow-sm ring-1 ring-foreground/[0.06] backdrop-blur-sm transition-colors ${
            inWishlist
              ? "bg-white text-red-500 hover:bg-white"
              : "bg-white/95 text-foreground/70 hover:bg-white hover:text-foreground"
          }`}
          aria-label={inWishlist ? "Дуртайас хасах" : "Дуртайд нэмэх"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWish(productId);
          }}
        >
          <motion.span
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center"
          >
            <Heart
              className="size-[18px]"
              strokeWidth={1.75}
              fill={inWishlist ? "currentColor" : "none"}
            />
          </motion.span>
        </button>
      ) : null}
    </motion.article>
  );
}
