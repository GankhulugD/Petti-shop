import { notFound } from "next/navigation";

import { ProductForm } from "@/components/product-form";
import { api, getAxiosPayload } from "@/lib/api-client";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let raw: Record<string, unknown>;
  try {
    const res = await api.get(`/api/admin/products/${id}`);
    raw = getAxiosPayload(res) as Record<string, unknown>;
  } catch {
    notFound();
  }

  if (!raw?.id) notFound();

  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const first = variants[0] as Record<string, unknown> | undefined;
  const details =
    raw.details && typeof raw.details === "object"
      ? (raw.details as Record<string, unknown>)
      : {};
  const category =
    raw.category && typeof raw.category === "object"
      ? (raw.category as Record<string, unknown>)
      : {};

  return (
    <ProductForm
      initial={{
        id: String(raw.id),
        name: String(raw.name ?? ""),
        brand: String(raw.brand ?? ""),
        priceMnt: Number(raw.priceMnt ?? 0),
        categorySlug: String(category.slug ?? raw.categorySlug ?? "food"),
        status: String(raw.status ?? "active"),
        images: Array.isArray(raw.images) ? raw.images.join("\n") : "",
        animals: Array.isArray(raw.animals) ? raw.animals.map(String) : [],
        description: String(raw.description ?? ""),
        ingredients: String(details.ingredients ?? raw.ingredients ?? ""),
        usage: String(details.usage ?? raw.usage ?? ""),
        shipping: String(details.shipping ?? raw.shipping ?? ""),
        variantLabel: String(first?.label ?? "Стандарт"),
        variantStock: Number(first?.stock ?? first?.stockQty ?? 0),
      }}
    />
  );
}
