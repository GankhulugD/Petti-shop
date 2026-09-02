import type { AnimalKind, ShopCategory, ShopProduct } from "@/lib/shop-products";
import { SHOP_CATEGORIES, formatMnt } from "@/lib/shop-products";

const DEFAULT_API_URL = "http://localhost:8787";

export type StoreConfig = {
  name: string;
  slug: string;
  currency: string;
  freeShippingFromMnt: number;
  flatShippingMnt: number;
  phone?: string;
  email?: string;
  hours?: string;
  bank?: { name: string; account: string; holder: string };
};

export type LookedUpOrder = {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  totalMnt: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: {
    productName: string;
    variantLabel: string | null;
    quantity: number;
    lineTotalMnt: number;
  }[];
};

export type CreateOrderInput = {
  email: string;
  fullName: string;
  phone?: string;
  shippingAddress: {
    city?: string;
    district?: string;
    line1?: string;
    note?: string;
  };
  items: { productId: string; variantId?: string; quantity: number }[];
  notes?: string;
};

export type CreateOrderResult = {
  id: string;
  orderNumber: string;
  totalMnt: number;
  status: string;
};

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return DEFAULT_API_URL;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

type ApiVariant = {
  id: string;
  label: string;
  priceMnt: number;
  stock?: number;
  stockQty?: number;
  isDefault?: boolean;
};

type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  priceMnt: number;
  priceLabel?: string;
  rating?: number;
  badge?: string | null;
  animals?: string[];
  categorySlug?: string | null;
  imageSrc?: string;
  imageAlt?: string;
  images?: string[];
  variants?: ApiVariant[];
  sizeOptions?: {
    label: string;
    priceLabel: string;
    priceMnt?: number;
    stock?: number;
  }[];
  ingredients?: string | null;
  usage?: string | null;
  shipping?: string | null;
  description?: string | null;
};

function isShopCategory(v: string | null | undefined): v is ShopCategory {
  return !!v && (SHOP_CATEGORIES as readonly string[]).includes(v);
}

function isAnimalKind(v: string): v is AnimalKind {
  return ["dog", "cat", "fish", "bird", "small"].includes(v);
}

function mapApiProduct(raw: ApiProduct): ShopProduct {
  const priceMnt = Number(raw.priceMnt ?? 0);
  const priceLabel = raw.priceLabel ?? formatMnt(priceMnt);
  const images =
    Array.isArray(raw.images) && raw.images.length
      ? raw.images
      : raw.imageSrc
        ? [raw.imageSrc]
        : [];

  const sizeOptions =
    raw.variants?.map((v) => ({
      variantId: v.id,
      label: v.label,
      priceLabel: formatMnt(v.priceMnt),
      priceMnt: v.priceMnt,
      stock: v.stock ?? v.stockQty,
    })) ??
    raw.sizeOptions?.map((s) => ({
      label: s.label,
      priceLabel: s.priceLabel ?? formatMnt(s.priceMnt ?? priceMnt),
      priceMnt: s.priceMnt ?? priceMnt,
      stock: s.stock,
    })) ??
    [{ label: "Стандарт", priceLabel, priceMnt }];

  const categorySlug = raw.categorySlug ?? null;

  return {
    id: raw.id,
    slug: raw.slug ?? raw.id,
    name: raw.name,
    priceMnt,
    priceLabel,
    rating: Number(raw.rating ?? 4.5),
    imageSrc: images[0] ?? "",
    imageAlt: raw.imageAlt ?? raw.name,
    images,
    brand: raw.brand ?? "",
    animals: (raw.animals ?? []).filter(isAnimalKind),
    shopCategory: isShopCategory(categorySlug) ? categorySlug : "food",
    badge:
      raw.badge === "best" || raw.badge === "new" ? raw.badge : undefined,
    sizeOptions,
    ingredients: raw.ingredients ?? raw.description ?? "",
    usage: raw.usage ?? "",
    shipping: raw.shipping ?? "",
  };
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = `${getApiBaseUrl()}${path}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchShopConfig(): Promise<StoreConfig | null> {
  return fetchJson<StoreConfig>("/api/shop");
}

export async function lookupOrder(
  orderNumber: string,
  email: string,
): Promise<LookedUpOrder | null> {
  const params = new URLSearchParams({ orderNumber, email });
  return fetchJson<LookedUpOrder>(`/api/orders/lookup?${params.toString()}`);
}

export async function fetchCatalogProducts(filters?: {
  q?: string;
  cat?: string;
}): Promise<ShopProduct[]> {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.cat) params.set("cat", filters.cat);
  const qs = params.toString();
  const data = await fetchJson<{ items?: ApiProduct[] } | ApiProduct[]>(
    qs ? `/api/products?${qs}` : "/api/products",
  );
  if (!data) return [];
  const list = Array.isArray(data) ? data : (data.items ?? []);
  return list.map(mapApiProduct);
}

export async function fetchProductBySlug(
  slug: string,
): Promise<ShopProduct | null> {
  const data = await fetchJson<ApiProduct>(
    `/api/products/${encodeURIComponent(slug)}`,
  );
  if (!data) return null;
  return mapApiProduct(data);
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<{ ok: true; data: CreateOrderResult } | { ok: false; message: string }> {
  const url = `${getApiBaseUrl()}/api/orders`;
  try {
    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const body = (await res.json().catch(() => null)) as
      | CreateOrderResult
      | { error?: string; message?: string }
      | null;
    if (!res.ok) {
      const msg =
        (body && "error" in body && body.error) ||
        (body && "message" in body && body.message) ||
        `Захиалга амжилтгүй (${res.status})`;
      return { ok: false, message: String(msg) };
    }
    if (!body || !("orderNumber" in body)) {
      return { ok: false, message: "Серверийн хариу буруу байна" };
    }
    return { ok: true, data: body as CreateOrderResult };
  } catch {
    return { ok: false, message: "Серверт холбогдож чадсангүй" };
  }
}

export function getShopProductsByIds(
  catalog: ShopProduct[],
  ids: string[],
): ShopProduct[] {
  const map = new Map(catalog.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is ShopProduct => !!p);
}

export function shippingForSubtotal(
  subtotal: number,
  config?: Pick<StoreConfig, "freeShippingFromMnt" | "flatShippingMnt"> | null,
): number {
  const freeFrom = config?.freeShippingFromMnt ?? 150_000;
  const flat = config?.flatShippingMnt ?? 15_000;
  if (subtotal <= 0) return 0;
  if (subtotal >= freeFrom) return 0;
  return flat;
}
