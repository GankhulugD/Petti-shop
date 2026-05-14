import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getShopProduct, SHOP_PRODUCTS } from "@/lib/shop-products";

export function generateStaticParams() {
  return SHOP_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getShopProduct(id);
  if (!product) return { title: "Бараа олдсонгүй" };
  return {
    title: product.name,
    description: product.ingredients.slice(0, 120),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getShopProduct(id);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
