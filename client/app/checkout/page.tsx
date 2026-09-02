"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Banknote, Loader2, MapPin, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createOrder,
  fetchShopConfig,
  shippingForSubtotal,
  type StoreConfig,
} from "@/lib/api";
import { appendOrderHistory, createOrderHistoryId } from "@/lib/order-history";
import { formatMnt } from "@/lib/shop-products";
import { useCart } from "@/store/useCart";

type PaymentMethod = "cod" | "transfer";

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const clearCart = useCart((s) => s.clearCart);

  const [store, setStore] = useState<StoreConfig | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Улаанбаатар");
  const [district, setDistrict] = useState("");
  const [line1, setLine1] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchShopConfig().then(setStore);
  }, []);

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.priceMnt * l.quantity, 0),
    [lines],
  );
  const shipping = shippingForSubtotal(subtotal, store);
  const total = subtotal + shipping;

  async function handleConfirm() {
    setError(null);
    if (!fullName.trim() || !email.trim() || !line1.trim()) {
      setError("Нэр, имэйл, хаяг заавал оруулна уу.");
      return;
    }

    setSubmitting(true);
    const result = await createOrder({
      email: email.trim(),
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
      shippingAddress: {
        city: city.trim(),
        district: district.trim(),
        line1: line1.trim(),
        note: note.trim() || undefined,
      },
      items: lines.map((l) => ({
        productId: l.productId,
        variantId: l.variantId,
        quantity: l.quantity,
      })),
      notes:
        payment === "cod"
          ? "Төлбөр: Бэлэн мөнгөөр (хүргэлтээр)"
          : "Төлбөр: Дансаар шилжүүлэг",
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    const { data } = result;
    try {
      sessionStorage.setItem(
        "petti-order-summary",
        JSON.stringify({
          subtotal,
          shipping,
          total: data.totalMnt,
          orderNumber: data.orderNumber,
        }),
      );
    } catch {
      /* ignore */
    }

    appendOrderHistory({
      id: createOrderHistoryId(),
      orderNumber: data.orderNumber,
      at: new Date().toISOString(),
      total: data.totalMnt,
      subtotal,
      shipping,
      itemCount: lines.reduce((s, l) => s + l.quantity, 0),
      preview: lines.map((l) => l.name).slice(0, 2).join(" · ") || "Захиалга",
    });

    clearCart();
    router.push("/checkout/success");
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-32 pt-8 md:px-10 md:pb-16 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Захиалга баталгаажуулах</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Хүргэлтийн мэдээлэл оруулаад захиалга илгээнэ үү.
          </p>
        </div>

        {lines.length === 0 ? (
          <div className="rounded-2xl bg-muted/40 px-6 py-12 text-center">
            <p className="text-sm font-medium">Сагс хоосон байна</p>
            <Button asChild className="mt-4 rounded-full">
              <Link href="/shop">Дэлгүүр хэсэх</Link>
            </Button>
          </div>
        ) : (
          <>
            <section className="space-y-3 rounded-2xl bg-muted/30 p-4">
              <h2 className="text-sm font-semibold">Захиалгын дүн</h2>
              <ul className="space-y-2">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-3 rounded-xl bg-background/70 p-2">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={line.imageSrc} alt={line.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{line.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {line.size} × {line.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold tabular-nums">
                      {formatMnt(line.priceMnt * line.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="space-y-1 border-t border-foreground/5 pt-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Дүн</span>
                  <span className="tabular-nums text-foreground">{formatMnt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Хүргэлт</span>
                  <span className="tabular-nums text-foreground">
                    {shipping === 0 ? "Үнэгүй" : formatMnt(shipping)}
                  </span>
                </div>
                {store ? (
                  <p className="text-xs text-muted-foreground">
                    {formatMnt(store.freeShippingFromMnt)}-с дээш үнэгүй хүргэлт
                  </p>
                ) : null}
                <div className="flex justify-between pt-1 text-base font-semibold">
                  <span>Нийт</span>
                  <span className="tabular-nums">{formatMnt(total)}</span>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="size-4" />
                Хүргэлтийн мэдээлэл
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="fullName">Нэр</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl border-0 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Имэйл</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border-0 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Утас</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+976 …" className="rounded-xl border-0 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Хот</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="rounded-xl border-0 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Дүүрэг</Label>
                  <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-xl border-0 bg-muted/50" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line1">Дэлгэрэнгүй хаяг</Label>
                  <Input id="line1" value={line1} onChange={(e) => setLine1(e.target.value)} className="rounded-xl border-0 bg-muted/50" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="note">Нэмэлт тэмдэглэл</Label>
                  <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} className="rounded-xl border-0 bg-muted/50" />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold">Төлбөрийн арга</h2>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: "cod" as const, label: "Бэлэн мөнгөөр", icon: Banknote },
                    { id: "transfer" as const, label: "Дансаар", icon: Truck },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl bg-muted/40 px-3 py-4 text-sm font-medium transition-shadow ${
                      payment === id ? "ring-2 ring-foreground ring-offset-2" : ""
                    }`}
                  >
                    <Icon className="size-6" strokeWidth={1.5} />
                    {label}
                  </button>
                ))}
              </div>
              {payment === "transfer" && store?.bank ? (
                <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm">
                  <p className="font-medium">Дансаар шилжүүлэх</p>
                  <p className="mt-1 text-muted-foreground">
                    {store.bank.name} · {store.bank.account}
                    <br />
                    {store.bank.holder}
                    <br />
                    Гүйлгээний утга: захиалгын дугаар
                  </p>
                </div>
              ) : null}
            </section>

            {error ? (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            ) : null}

            <Button
              type="button"
              disabled={submitting}
              className="h-12 w-full rounded-full"
              onClick={() => void handleConfirm()}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Илгээж байна…
                </>
              ) : (
                "Захиалга илгээх"
              )}
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
