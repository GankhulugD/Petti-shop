"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lookupOrder, type LookedUpOrder } from "@/lib/api";
import { formatMnt } from "@/lib/shop-products";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<LookedUpOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError(null);
    setOrder(null);
    if (!orderNumber.trim() || !email.trim()) {
      setError("Захиалгын дугаар болон имэйл оруулна уу.");
      return;
    }
    setLoading(true);
    const found = await lookupOrder(orderNumber.trim(), email.trim());
    setLoading(false);
    if (!found) {
      setError("Захиалга олдсонгүй. Дугаар, имэйлээ шалгана уу.");
      return;
    }
    setOrder(found);
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 md:px-10 md:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Захиалга шалгах</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Захиалгын дугаар болон захиалга өгсөн имэйлээр төлөв харна.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Захиалгын дугаар</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="ORD-…"
            className="rounded-xl border-0 bg-muted/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Имэйл</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-0 bg-muted/50"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={loading} className="h-11 w-full rounded-full">
          {loading ? "Хайж байна…" : "Шалгах"}
        </Button>
      </form>

      {order ? (
        <div className="mt-8 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-foreground/[0.05]">
          <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
          <p className="text-sm">
            Төлөв: <strong>{order.status}</strong> · Төлбөр: {order.paymentStatus}
          </p>
          <p className="text-sm text-muted-foreground">{order.fullName}</p>
          <ul className="space-y-1 text-sm">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span>
                  {item.productName}
                  {item.variantLabel ? ` · ${item.variantLabel}` : ""} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatMnt(item.lineTotalMnt)}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-foreground/5 pt-2 text-right font-semibold tabular-nums">
            {formatMnt(order.totalMnt)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
