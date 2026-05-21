import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Цуглуулга",
  description:
    "Муур, нохой, загас, \u0428\u0443\u0432\u0443\u0443\u0443\u043d болон бусад тусгай багцууд",
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
