import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дэлгүүр",
  description: "Тэжээвэр амьтны хоол, элс, хэрэгслийг шүүж сонгоорой.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
