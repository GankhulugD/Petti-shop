import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Төлбөр",
  description: "Захиалга баталгаажуулах",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
