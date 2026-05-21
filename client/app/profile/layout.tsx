import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл",
  description: "Хэрэглэгчийн профайл, захиалга",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
