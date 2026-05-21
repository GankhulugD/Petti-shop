import { api, getAxiosPayload } from "@/lib/api-client";
import {
  extractArrayFromUnknown,
  getApiErrorFromBody,
  unwrapAxiosData,
} from "@/lib/normalize-api-response";

export type ProductDisplay = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  priceMnt: number;
  status: string;
  categoryName: string | null;
  imageSrc: string;
  images: string[];
  stockTotal: number;
};

export type ProductsFetchResult = {
  list: ProductDisplay[];
  error: null | "api";
};

function normalizeProduct(raw: unknown): ProductDisplay | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = r.id != null ? String(r.id) : "";
  if (!id) return null;

  const images = Array.isArray(r.images)
    ? r.images.filter((x): x is string => typeof x === "string")
    : [];
  const variants = Array.isArray(r.variants) ? r.variants : [];
  const stockTotal = variants.reduce((sum, v) => {
    if (!v || typeof v !== "object") return sum;
    return sum + Number((v as Record<string, unknown>).stock ?? 0);
  }, 0);

  return {
    id,
    slug: String(r.slug ?? id),
    name: String(r.name ?? "Untitled"),
    brand: r.brand != null ? String(r.brand) : null,
    priceMnt: Number(r.priceMnt ?? r.price ?? 0),
    status: String(r.status ?? "active"),
    categoryName:
      r.categoryName != null
        ? String(r.categoryName)
        : r.category && typeof r.category === "object"
          ? String((r.category as Record<string, unknown>).name ?? "")
          : null,
    imageSrc: String(r.imageSrc ?? images[0] ?? ""),
    images,
    stockTotal: Number.isFinite(stockTotal) ? stockTotal : 0,
  };
}

export async function fetchProducts(): Promise<ProductsFetchResult> {
  try {
    const res = await api.get<unknown>("/api/admin/products");
    const raw = getAxiosPayload(res);
    const apiErr = getApiErrorFromBody(raw);
    if (apiErr) return { list: [], error: "api" };

    const body = unwrapAxiosData(raw);
    const list = extractArrayFromUnknown(
      body && typeof body === "object" && "items" in (body as object)
        ? (body as { items: unknown }).items
        : body,
    );

    return {
      list: list
        .map(normalizeProduct)
        .filter((p): p is ProductDisplay => p !== null),
      error: null,
    };
  } catch {
    return { list: [], error: "api" };
  }
}
