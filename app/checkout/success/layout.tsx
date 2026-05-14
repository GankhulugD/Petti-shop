import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Амжилттай",
  description: "Захиалга баталгаажлаа",
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
