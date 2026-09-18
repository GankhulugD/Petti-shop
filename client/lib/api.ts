import { cache } from "react";

import {
  mapApiProduct,
  mapApiProductList,
  type ApiProduct,
} from "@/lib/data/product-mapper";
import type { ShopProduct } from "@/lib/shop-products";
import { UPSTREAM_REVALIDATE_SEC } from "@/lib/upstream-api";

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

export type CatalogFilters = {
  q?: string;
  cat?: string;
  limit?: number;
  ids?: string[];
};

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_API_URL тохируулаагүй. Vercel env эсвэл client/.env.local шалгана уу.",
      );
    }
    return DEFAULT_API_URL;
  }
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function catalogQuery(filters?: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.cat) params.set("cat", filters.cat);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.ids?.length) params.set("ids", filters.ids.join(","));
  const qs = params.toString();
  return qs ? `/api/products?${qs}` : "/api/products";
}

/** Server / RSC — Workers API шууд */
async function fetchUpstreamJson<T>(
  path: string,
  init?: RequestInit & { revalidate?: number | false },
): Promise<T | null> {
  const url = `${getApiBaseUrl()}${path}`;
  const { revalidate, ...rest } = init ?? {};
  const cacheMode =
    revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate: revalidate ?? UPSTREAM_REVALIDATE_SEC } };

  try {
    const res = await fetch(url, {
      ...cacheMode,
      signal: AbortSignal.timeout(10_000),
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...rest.headers,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Browser — same-origin BFF */
async function fetchBffJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(path, {
      cache: "default",
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

function bffCatalogPath(filters?: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  if (filters?.cat) params.set("cat", filters.cat);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.ids?.length) params.set("ids", filters.ids.join(","));
  const qs = params.toString();
  return qs ? `/api/catalog?${qs}` : "/api/catalog";
}

export const fetchShopConfig = cache(async (): Promise<StoreConfig | null> => {
  return fetchUpstreamJson<StoreConfig>("/api/shop");
});

/** Browser checkout — same-origin BFF */
export async function fetchShopConfigClient(): Promise<StoreConfig | null> {
  return fetchBffJson<StoreConfig>("/api/shop");
}

export const fetchCatalogProducts = cache(
  async (filters?: CatalogFilters): Promise<ShopProduct[]> => {
    const data = await fetchUpstreamJson<{ items?: ApiProduct[] } | ApiProduct[]>(
      catalogQuery(filters),
    );
    return mapApiProductList(data);
  },
);

export const fetchProductBySlug = cache(
  async (slug: string): Promise<ShopProduct | null> => {
    const data = await fetchUpstreamJson<ApiProduct>(
      `/api/products/${encodeURIComponent(slug)}`,
    );
    if (!data) return null;
    return mapApiProduct(data);
  },
);

/** Client-only — wishlist зэрэг ID-аар татах */
export async function fetchProductsByIds(
  ids: string[],
): Promise<ShopProduct[]> {
  if (!ids.length) return [];
  const data = await fetchBffJson<{ items?: ApiProduct[] }>(
    bffCatalogPath({ ids }),
  );
  return mapApiProductList(data);
}

export async function lookupOrder(
  orderNumber: string,
  email: string,
): Promise<LookedUpOrder | null> {
  const params = new URLSearchParams({ orderNumber, email });
  const path = `/api/orders/lookup?${params.toString()}`;

  if (typeof window !== "undefined") {
    return fetchBffJson<LookedUpOrder>(path);
  }

  return fetchUpstreamJson<LookedUpOrder>(path, { revalidate: false });
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<{ ok: true; data: CreateOrderResult } | { ok: false; message: string }> {
  const url =
    typeof window !== "undefined"
      ? "/api/orders"
      : `${getApiBaseUrl()}/api/orders`;
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
