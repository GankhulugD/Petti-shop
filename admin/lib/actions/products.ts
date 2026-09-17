"use server";

import { adminFetch } from "@/lib/server-api";

export type ProductSavePayload = {
  name: string;
  brand?: string;
  priceMnt: number;
  categorySlug: string;
  status: string;
  images: string[];
  targetAnimals: string[];
  description?: string;
  details: {
    ingredients?: string;
    usage?: string;
    shipping?: string;
  };
  variants: { label: string; priceMnt: number; stockQty: number }[];
};

export type SaveProductResult =
  | { ok: true }
  | { ok: false; error: "validation" | "api" | "config" };

export async function saveProduct(
  id: string | undefined,
  payload: ProductSavePayload,
): Promise<SaveProductResult> {
  try {
    const path = id ? `/api/admin/products/${id}` : "/api/admin/products";
    const res = await adminFetch(path, {
      method: id ? "PATCH" : "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: "api" };
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("тохируулаагүй")) return { ok: false, error: "config" };
    return { ok: false, error: "api" };
  }
}
