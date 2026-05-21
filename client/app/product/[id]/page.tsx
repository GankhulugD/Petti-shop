import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product/ProductDetailView";
import { fetchProductBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductBySlug(id);
  if (!product) return { title: "Бараа олдсонгүй" };
  const desc = product.ingredients || product.usage || product.name;
  return {
    title: product.name,
    description: desc.slice(0, 120),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductBySlug(id);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
