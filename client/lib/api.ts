import type { AnimalKind, ShopCategory, ShopProduct } from "@/lib/shop-products";
import { SHOP_CATEGORIES, formatMnt } from "@/lib/shop-products";

const DEFAULT_API_URL = "http://localhost:8787";

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
  sizeOptions?: { label: string; priceLabel: string; priceMnt?: number }[];
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
    raw.sizeOptions?.map((s) => ({
      label: s.label,
      priceLabel: s.priceLabel ?? formatMnt(s.priceMnt ?? priceMnt),
    })) ??
    raw.variants?.map((v) => ({
      label: v.label,
      priceLabel: formatMnt(v.priceMnt),
    })) ??
    [{ label: "Стандарт", priceLabel }];

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

async function fetchJson<T>(path: string): Promise<T | null> {
  const url = `${getApiBaseUrl()}${path}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[api] ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[api] fetch failed ${url}`, err);
    return null;
  }
}

export async function fetchCatalogProducts(): Promise<ShopProduct[]> {
  const data = await fetchJson<{ items?: ApiProduct[] } | ApiProduct[]>(
    "/api/products",
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

export async function fetchProductById(
  id: string,
): Promise<ShopProduct | null> {
  return fetchProductBySlug(id);
}

export function getShopProductsByIds(
  catalog: ShopProduct[],
  ids: string[],
): ShopProduct[] {
  const map = new Map(catalog.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is ShopProduct => !!p);
}
