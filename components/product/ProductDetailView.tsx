"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Star } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseMntFromLabel } from "@/lib/parse-mnt";
import type { ShopProduct } from "@/lib/shop-products";
import { useCart } from "@/store/useCart";

type Props = {
  product: ShopProduct;
};

export function ProductDetailView({ product }: Props) {
  const addItem = useCart((s) => s.addItem);
  const openSheet = useCart((s) => s.openSheet);
  const [imageIndex, setImageIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(() => {
    const i = product.sizeOptions.findIndex(
      (s) => s.priceLabel === product.priceLabel,
    );
    return i >= 0 ? i : product.sizeOptions.length - 1;
  });
  const [quantity, setQuantity] = useState(1);

  const mainSrc = product.images[imageIndex] ?? product.imageSrc;
  const selectedPrice =
    product.sizeOptions[sizeIndex]?.priceLabel ?? product.priceLabel;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-10 lg:gap-12"
      >
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <motion.div
              className="relative aspect-square overflow-hidden rounded-3xl bg-muted/30 shadow-sm ring-1 ring-foreground/[0.05]"
              layout
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainSrc}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={mainSrc}
                    alt={product.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:gap-3">
              {product.images.map((src, i) => (
                <motion.button
                  key={src}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-2xl ring-2 transition-shadow sm:size-20 ${
                    imageIndex === i
                      ? "ring-foreground shadow-md"
                      : "ring-transparent opacity-75 hover:opacity-100"
                  }`}
                  aria-label={`Зураг ${i + 1}: ${product.imageAlt}`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} — зураг ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              {product.badge ? (
                <Badge
                  variant={product.badge === "best" ? "default" : "secondary"}
                  className="rounded-full px-3 py-0.5 text-xs font-semibold"
                >
                  {product.badge === "best" ? "Best Seller" : "New"}
                </Badge>
              ) : null}
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {product.name}
              </h1>
              <motion.p
                key={selectedPrice}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-semibold tabular-nums text-foreground sm:text-4xl"
              >
                {selectedPrice}
              </motion.p>
              <div className="flex items-center gap-2 text-foreground/70">
                <Star
                  className="size-5 fill-foreground text-foreground"
                  strokeWidth={0}
                  aria-hidden
                />
                <span className="text-sm font-medium tabular-nums">
                  {product.rating.toFixed(1)} үнэлгээ
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/80">
                Хэмжээ сонгох
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizeOptions.map((opt, i) => (
                  <motion.button
                    key={opt.label}
                    type="button"
                    onClick={() => setSizeIndex(i)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      sizeIndex === i
                        ? "bg-foreground text-background"
                        : "bg-muted/60 text-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/80">Тоо ширхэг</p>
              <div className="inline-flex items-center gap-1 rounded-full bg-muted/50 p-1">
                <motion.div whileTap={{ scale: 0.92 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Багасгах"
                  >
                    <Minus className="size-4" />
                  </Button>
                </motion.div>
                <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <motion.div whileTap={{ scale: 0.92 }}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Нэмэх"
                  >
                    <Plus className="size-4" />
                  </Button>
                </motion.div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="button"
                className="h-12 w-full gap-2 rounded-full bg-[#1A1A1A] text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
                onClick={() => {
                  const size = product.sizeOptions[sizeIndex]?.label ?? "";
                  const priceLabel =
                    product.sizeOptions[sizeIndex]?.priceLabel ??
                    product.priceLabel;
                  const priceMnt = parseMntFromLabel(priceLabel);
                  addItem({
                    productId: product.id,
                    name: product.name,
                    priceMnt,
                    priceLabel,
                    size,
                    imageSrc: product.imageSrc,
                    quantity,
                  });
                  openSheet();
                }}
              >
                <ShoppingBag className="size-5" />
                Сагсанд нэмэх
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="rounded-2xl bg-muted/40 p-1 sm:p-2"
        >
          <Accordion
            type="multiple"
            defaultValue={["ingredients", "usage", "shipping"]}
            className="space-y-2"
          >
            <AccordionItem
              value="ingredients"
              className="rounded-xl border-0 bg-background/70 px-4 not-last:border-0"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Орц найрлага
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.ingredients}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="usage"
              className="rounded-xl border-0 bg-background/70 px-4 not-last:border-0"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Хэрэглэх заавар
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.usage}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="shipping"
              className="rounded-xl border-0 bg-background/70 px-4 not-last:border-0"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Хүргэлтийн нөхцөл
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.shipping}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>
      </motion.div>
    </div>
  );
}
