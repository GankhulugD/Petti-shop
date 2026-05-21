"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ORDER_HISTORY_KEY,
  type OrderHistoryEntry,
  readOrderHistory,
} from "@/lib/order-history";
import { formatMnt } from "@/lib/shop-products";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ProfilePage() {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>(() =>
    readOrderHistory(),
  );

  useEffect(() => {
    const refresh = () => setOrders(readOrderHistory());
    const onStorage = (e: StorageEvent) => {
      if (e.key === ORDER_HISTORY_KEY || e.key === null) {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 md:max-w-3xl md:px-10 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-10"
      >
        <section className="flex flex-col items-center gap-4 rounded-3xl bg-white/90 p-8 text-center shadow-sm ring-1 ring-foreground/[0.06] sm:flex-row sm:text-left">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl bg-muted ring-2 ring-foreground/[0.06]">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Болд Батаа
            </h1>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              bataa.mn@example.com
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              (Жишээ профайл — бүртгэл холбогдоогүй)
            </p>
          </div>
        </section>

        <section aria-labelledby="orders-heading">
          <h2
            id="orders-heading"
            className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <Package className="size-5 text-foreground/70" strokeWidth={1.5} />
            Миний захиалгууд
          </h2>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground ring-1 ring-foreground/[0.04]">
              Танд одоогоор захиалга байхгүй байна
            </div>
          ) : (
            <ul className="space-y-3">
              {orders.map((o, i) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="rounded-2xl border border-foreground/[0.06] bg-white/90 px-4 py-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(o.at)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground/90">
                        {o.preview || "Захиалга"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {o.itemCount} ширхэг
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {formatMnt(o.total)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="fav-heading">
          <h2
            id="fav-heading"
            className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <Heart className="size-5 text-foreground/70" strokeWidth={1.5} />
            Миний дуртай
          </h2>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full justify-between rounded-2xl border-0 bg-muted/50 px-4 text-foreground shadow-none ring-1 ring-foreground/[0.06] hover:bg-muted"
          >
            <Link href="/wishlist">
              <span>Дуртай жагсаалт руу орох</span>
              <ChevronRight className="size-4 opacity-60" />
            </Link>
          </Button>
        </section>
      </motion.div>
    </div>
  );
}
