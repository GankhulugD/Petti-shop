"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";

import { ProductCardImage } from "@/components/products/ProductCardImage";

import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { useWishlist } from "@/store/useWishlist";

export type ProductCardProps = {
  productId?: string;
  name: string;
  price: string;
  compareAt?: string;
  rating: number;
  imageSrc: string;
  imageAlt: string;
  href: string;
  badge?: "best" | "new";
  brand?: string;
  /** Grid-ээс нэг subscription-оор дамжуулна */
  inWishlist?: boolean;
  onToggleWishlist?: () => void;
};

export function ProductCard({
  productId,
  name,
  price,
  compareAt,
  rating,
  imageSrc,
  imageAlt,
  href,
  badge,
  brand,
  inWishlist: inWishlistProp,
  onToggleWishlist,
}: ProductCardProps) {
  const hydrated = useStoreHydrated();
  const toggleWish = useWishlist((s) => s.toggle);
  const savedInWishlist = useWishlist((s) =>
    productId && inWishlistProp === undefined ? s.has(productId) : false,
  );
  const inWishlist =
    inWishlistProp !== undefined
      ? inWishlistProp
      : hydrated && savedInWishlist;

  const handleToggleWish = () => {
    if (onToggleWishlist) {
      onToggleWishlist();
      return;
    }
    if (productId) toggleWish(productId);
  };

  return (
    <article className="relative h-full transition-transform duration-200 ease-out hover:-translate-y-1">
      <Link
        href={href}
        prefetch
        className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-foreground/[0.05] transition-shadow hover:shadow-[0_8px_28px_-12px_rgba(26,26,26,0.12)]"
      >
        <ProductCardImage src={imageSrc} alt={imageAlt} badge={badge} />
        <div className="flex min-h-[7.25rem] flex-1 flex-col gap-1.5 p-3 sm:min-h-[7.75rem] sm:p-4">
          <p className="min-h-[1lh] truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {brand || "\u00a0"}
          </p>
          <h3 className="line-clamp-2 min-h-[2lh] text-sm font-medium leading-snug text-foreground sm:text-[0.9375rem]">
            {name}
          </h3>
          <div className="mt-auto flex flex-col gap-1.5">
            <div className="flex h-5 items-baseline gap-2">
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {price}
              </p>
              {compareAt ? (
                <p className="truncate text-xs text-muted-foreground line-through">
                  {compareAt}
                </p>
              ) : null}
            </div>
            <div className="flex h-5 items-center gap-1 text-foreground/70">
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
            handleToggleWish();
          }}
        >
          <span className="flex items-center justify-center transition-transform active:scale-90">
            <Heart
              className="size-[18px]"
              strokeWidth={1.75}
              fill={inWishlist ? "currentColor" : "none"}
            />
          </span>
        </button>
      ) : null}
    </article>
  );
}
