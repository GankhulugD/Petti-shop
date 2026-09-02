"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMnt } from "@/lib/shop-products";

type Summary = {
  subtotal: number;
  shipping: number;
  total: number;
  orderNumber?: string;
};

function readOrderSummaryOnce(): Summary | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("petti-order-summary");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Summary;
    if (
      typeof parsed?.total !== "number" ||
      typeof parsed?.subtotal !== "number"
    ) {
      return null;
    }
    sessionStorage.removeItem("petti-order-summary");
    return parsed;
  } catch {
    return null;
  }
}

export default function CheckoutSuccessPage() {
  const [summary] = useState<Summary | null>(readOrderSummaryOnce);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 md:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-3xl bg-muted/40 px-8 py-12 text-center shadow-sm ring-1 ring-foreground/[0.05]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-foreground text-background"
        >
          <CheckCircle2 className="size-9" strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Захиалга амжилттай
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Захиалга хүлээн авлаа. Бид удахгүй танд холбогдох болно.
        </p>
        {summary?.orderNumber ? (
          <p className="mt-3 text-sm font-medium text-foreground">
            Захиалгын дугаар:{" "}
            <span className="font-mono tabular-nums">{summary.orderNumber}</span>
          </p>
        ) : null}
        {summary ? (
          <p className="mt-4 rounded-2xl bg-background/70 px-4 py-3 text-sm font-medium tabular-nums text-foreground">
            Нийт: {formatMnt(summary.total)}
          </p>
        ) : null}
        <Button
          asChild
          className="mt-8 w-full rounded-full bg-[#1A1A1A] text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
        >
          <Link href="/shop">Дэлгүүр хэсэх</Link>
        </Button>
        {summary?.orderNumber ? (
          <Button asChild variant="ghost" className="mt-2 w-full rounded-full">
            <Link href="/track">Захиалга шалгах</Link>
          </Button>
        ) : null}
      </motion.div>
    </div>
  );
}
