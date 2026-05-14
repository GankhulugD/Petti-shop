import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Тухай",
  description: "Petti — тэжээвэр амьтдад зориулсан дэлгүүр",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
