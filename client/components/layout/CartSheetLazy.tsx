"use client";

import dynamic from "next/dynamic";

const CartSheet = dynamic(
  () => import("@/components/cart/CartSheet").then((m) => m.CartSheet),
  { ssr: false },
);

export function CartSheetLazy() {
  return <CartSheet />;
}
