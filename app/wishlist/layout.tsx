import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дуртай",
  description: "Танд таалагдсан бүтээгдэхүүнүүд",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
