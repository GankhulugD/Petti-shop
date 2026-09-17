"use client";

import { useState } from "react";
import Image from "next/image";

type ProductCardImageProps = {
  src: string;
  alt: string;
  badge?: "best" | "new";
};

export function ProductCardImage({ src, alt, badge }: ProductCardImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#f3f3f3]">
      {src ? (
        <>
          {!loaded ? (
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#f0f0f0] to-[#e8e8e8]"
              aria-hidden
            />
          ) : null}
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground/60">
          Зураггүй
        </div>
      )}
      {badge ? (
        <span className="absolute left-2 top-2 z-[1] rounded-full bg-[#1A1A1A] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {badge === "best" ? "Онцлох" : "Шинэ"}
        </span>
      ) : null}
    </div>
  );
}
