"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  MapPin,
  Smartphone,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appendOrderHistory, createOrderHistoryId } from "@/lib/order-history";
import { formatMnt } from "@/lib/shop-products";
import {
  shippingForSubtotal,
  useCart,
} from "@/store/useCart";

import type { ReactNode } from "react";

type PaymentId = "card" | "paypal" | "apple";

function MasterCardMark() {
  return (
    <span
      className="relative inline-flex h-7 w-11 shrink-0 items-center justify-center"
      aria-hidden
    >
      <span className="absolute left-0.5 top-1/2 size-6 -translate-y-1/2 rounded-full bg-[#EB001B]/90" />
      <span className="absolute right-0.5 top-1/2 size-6 -translate-y-1/2 rounded-full bg-[#F79E1B]/90" />
    </span>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clearCart);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.priceMnt * l.quantity, 0),
    [lines],
  );
  const shipping = shippingForSubtotal(subtotal);
  const total = subtotal + shipping;

  const [payment, setPayment] = useState<PaymentId>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const paymentOptions: {
    id: PaymentId;
    label: string;
    node: ReactNode;
  }[] = [
    { id: "card", label: "MasterCard", node: <MasterCardMark /> },
    { id: "paypal", label: "PayPal", node: <Wallet className="size-7" /> },
    {
      id: "apple",
      label: "Apple Pay",
      node: <Smartphone className="size-7" strokeWidth={1.5} />,
    },
  ];

  function handleConfirm() {
    const snap = { subtotal, shipping, total };
    try {
      sessionStorage.setItem("petti-order-summary", JSON.stringify(snap));
    } catch {
      /* ignore */
    }

    const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
    const names = lines.map((l) => l.name);
    const preview =
      names.length === 0
        ? "Захиалга"
        : names.length <= 2
          ? names.join(" · ")
          : `${names[0]}, ${names[1]} болон ${names.length - 2} бүтээгдэхүүн`;

    appendOrderHistory({
      id: createOrderHistoryId(),
      at: new Date().toISOString(),
      total,
      subtotal,
      shipping,
      itemCount,
      preview,
    });

    clearCart();
    router.push("/checkout/success");
  }

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-32 pt-8 md:max-w-xl md:px-10 md:pb-28 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Төлбөр тооцоо
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Хүргэлтийн хаяг болон төлбөрийн мэдээллээ баталгаажуулна уу.
          </p>
        </div>

        {lines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-muted/40 px-6 py-12 text-center"
          >
            <p className="text-sm font-medium text-foreground/80">
              Таны сагс хоосон байна
            </p>
            <Button
              asChild
              className="mt-4 rounded-full bg-[#1A1A1A] text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
            >
              <Link href="/shop">Дэлгүүр хэсэх</Link>
            </Button>
          </motion.div>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground/90">
                Захиалгын дүн
              </h2>
              <ul className="space-y-2 rounded-2xl bg-muted/40 p-3">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex gap-3 rounded-xl bg-background/60 p-2"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={line.imageSrc}
                        alt={line.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">
                        {line.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {line.size} × {line.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {formatMnt(line.priceMnt * line.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="space-y-1.5 rounded-2xl bg-muted/30 px-4 py-3 text-sm">
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
                <div className="flex justify-between border-t border-foreground/[0.06] pt-2 font-semibold text-foreground">
                  <span>Нийт</span>
                  <span className="tabular-nums">{formatMnt(total)}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-muted/40 p-4">
              <div className="flex gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-background/80 text-foreground">
                  <MapPin className="size-5" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Хүргэлтийн хаяг
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Улаанбаатар, Сүхбаатар дүүрэг, 1-р хороо, Чингис хааны
                    гудамж 15, 3 давхар 301 тоот
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Утас: +976 7711 2233
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground/90">
                Төлбөрийн арга
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {paymentOptions.map(({ id, label, node }) => {
                  const selected = payment === id;
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => setPayment(id)}
                      whileTap={{ scale: 0.97 }}
                      className={`flex flex-col items-center gap-2 rounded-2xl bg-muted/40 px-2 py-4 transition-shadow ${
                        selected
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "ring-0"
                      }`}
                    >
                      <span className="text-foreground">{node}</span>
                      <span className="text-center text-[11px] font-medium leading-tight text-foreground/85">
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {payment === "card" ? (
              <motion.section
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
                  <CreditCard className="size-4" />
                  Картын мэдээлэл
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Картын дугаар</Label>
                  <Input
                    id="card-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="h-11 rounded-xl border-0 bg-muted/50 text-foreground shadow-none focus-visible:ring-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="card-exp">Дуусах хугацаа</Label>
                    <Input
                      id="card-exp"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="h-11 rounded-xl border-0 bg-muted/50 shadow-none focus-visible:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      inputMode="numeric"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="h-11 rounded-xl border-0 bg-muted/50 shadow-none focus-visible:ring-2"
                    />
                  </div>
                </div>
              </motion.section>
            ) : null}

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foreground/[0.06] bg-[#F9F9F9]/95 px-4 py-4 backdrop-blur-md md:static md:z-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="button"
                  className="h-12 w-full rounded-full bg-[#1A1A1A] text-[#F9F9F9] hover:bg-[#1A1A1A]/90"
                  onClick={handleConfirm}
                >
                  Захиалга баталгаажуулах
                </Button>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
