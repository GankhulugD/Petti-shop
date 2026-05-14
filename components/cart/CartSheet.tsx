"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatMnt } from "@/lib/shop-products";
import {
  shippingForSubtotal,
  useCart,
  type CartLine,
} from "@/store/useCart";

function CartLineRow({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.22 } }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 rounded-2xl bg-muted/40 p-3 ring-0"
    >
      <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-background">
        <Image
          src={line.imageSrc}
          alt={line.name}
          fill
          sizes="72px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
              {line.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{line.size}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
              {line.priceLabel}
            </p>
          </div>
          <motion.button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Хасах"
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(line.id)}
          >
            <X className="size-4" />
          </motion.button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-0.5 rounded-full bg-muted p-0.5">
            <motion.button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-background/80"
              aria-label="Багасгах"
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (line.quantity <= 1) onRemove(line.id);
                else onQty(line.id, line.quantity - 1);
              }}
            >
              <Minus className="size-3.5" />
            </motion.button>
            <span className="min-w-[2rem] text-center text-xs font-semibold tabular-nums text-foreground">
              {String(line.quantity).padStart(2, "0")}
            </span>
            <motion.button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-background/80"
              aria-label="Нэмэх"
              whileTap={{ scale: 0.92 }}
              onClick={() => onQty(line.id, line.quantity + 1)}
            >
              <Plus className="size-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CartSheet() {
  const router = useRouter();
  const isOpen = useCart((s) => s.isSheetOpen);
  const setOpen = useCart((s) => s.setSheetOpen);
  const lines = useCart((s) => s.lines);
  const removeLine = useCart((s) => s.removeLine);
  const setLineQuantity = useCart((s) => s.setLineQuantity);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.priceMnt * l.quantity, 0),
    [lines],
  );
  const shipping = shippingForSubtotal(subtotal);
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="z-[100] flex w-full max-w-md flex-col border-0 bg-background p-0 shadow-xl ring-1 ring-foreground/[0.06]"
        showCloseButton
      >
        <SheetHeader className="border-b border-foreground/[0.06] px-5 py-4 text-left">
          <SheetTitle className="text-lg font-semibold">Сагс</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {lines.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
            >
              <div className="rounded-full bg-muted/60 p-4 text-muted-foreground">
                <ShoppingBag className="size-8 stroke-[1.25]" />
              </div>
              <p className="text-sm font-medium text-foreground/80">
                Таны сагс хоосон байна
              </p>
              <Button
                asChild
                className="rounded-full bg-[#1A1A1A] px-6 text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
              >
                <Link href="/shop" onClick={() => setOpen(false)}>
                  Дэлгүүр хэсэх
                </Link>
              </Button>
            </motion.div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false} mode="popLayout">
                    {lines.map((line) => (
                      <CartLineRow
                        key={line.id}
                        line={line}
                        onQty={setLineQuantity}
                        onRemove={removeLine}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="border-t border-foreground/[0.06] bg-muted/30 px-5 py-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Дүн</span>
                    <span className="tabular-nums text-foreground">
                      {formatMnt(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Хүргэлт</span>
                    <span className="tabular-nums text-foreground">
                      {shipping === 0 ? "Үнэгүй" : formatMnt(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-foreground/[0.06] pt-2 text-base font-semibold text-foreground">
                    <span>Нийт</span>
                    <span className="tabular-nums">{formatMnt(total)}</span>
                  </div>
                </div>
                <motion.div
                  className="mt-4"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="button"
                    className="h-12 w-full rounded-full bg-[#1A1A1A] text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
                    onClick={() => {
                      setOpen(false);
                      router.push("/checkout");
                    }}
                  >
                    Proceed To Checkout
                  </Button>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
